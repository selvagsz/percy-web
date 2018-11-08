import setupAcceptance, {
  setupSession,
  renderAdapterErrorsAsPage,
} from '../helpers/setup-acceptance';
import {percySnapshot} from 'ember-percy';
import {visit, click, currentRouteName} from '@ember/test-helpers';

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
    expect(currentRouteName()).to.equal('join');

    await percySnapshot(this.test);
  });

  it('invalid rejected', async function() {
    await renderAdapterErrorsAsPage(async () => {
      await visit('/join/invalid-code');
      expect(currentRouteName()).to.equal('error');
      await percySnapshot(this.test);
    });
  });

  it('valid accepted', async function() {
    await visit('/join/valid-code');
    expect(currentRouteName()).to.equal('join');

    await percySnapshot(this.test);
    await click('[data-test-accept-invitation]');
    expect(currentRouteName()).to.equal('organization.index');

    await percySnapshot(this.test.fullTitle() + ' | Into organization');
  });
});
