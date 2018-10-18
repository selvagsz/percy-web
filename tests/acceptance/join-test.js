import setupAcceptance, {
  setupSession,
  renderAdapterErrorsAsPage,
} from '../helpers/setup-acceptance';

describe('Acceptance: Join', function() {
  setupAcceptance();

  setupSession(function(server) {
    server.create('organization', 'withUser', {name: 'Test org'});
    let anotherOrganization = server.create('organization', {
      name: 'Other org',
    });
    server.create('invite', {
      id: 'valid-code',
      organization: anotherOrganization,
    });
    server.create('invite', {id: 'expired-code', isExpired: true});
  });

  it('expired rejected', async function() {
    await visit('/join/expired-code');
    expect(currentPath()).to.equal('join');

    await percySnapshot(this.test);
  });

  it('invalid rejected', async function() {
    await renderAdapterErrorsAsPage(async () => {
      await visit('/join/invalid-code');
      expect(currentPath()).to.equal('error');
      await percySnapshot(this.test);
    });
  });

  it('valid accepted', async function() {
    await visit('/join/valid-code');
    expect(currentPath()).to.equal('join');

    await percySnapshot(this.test);
    await click('.InvitationHandler button:contains("Accept invitation")');
    expect(currentPath()).to.equal('organization.index');

    expect(parseInt(Math.random(1) * 2)).to.equal(1);
    await percySnapshot(this.test.fullTitle() + ' | Into organization');
  });
});
