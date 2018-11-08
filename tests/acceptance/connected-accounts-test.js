import setupAcceptance, {setupSession} from 'percy-web/tests/helpers/setup-acceptance';
import ConnectedAccountsPage from 'percy-web/tests/pages/connected-accounts-page';
import {percySnapshot} from 'ember-percy';

describe('Acceptance: ConnectedAccounts when user has GitHub identity', function() {
  setupAcceptance({authenticate: true});

  setupSession(function(server) {
    server.create('user', 'withGithubIdentity');
  });

  it('shows page with a add email/password account button', async function() {
    await ConnectedAccountsPage.visitConnectedAccounts();
    expect(ConnectedAccountsPage.isAddAuth0IdentityFormVisible).to.equal(false);
    expect(ConnectedAccountsPage.panel.isAddAuth0IdentityVisible).to.equal(true);

    await percySnapshot(this.test.fullTitle());
  });

  it('shows page with email/password form', async function() {
    await ConnectedAccountsPage.visitConnectedAccounts();
    await ConnectedAccountsPage.panel.clickAddAuth0Identity();
    expect(ConnectedAccountsPage.isAddAuth0IdentityFormVisible).to.equal(true);

    await percySnapshot(this.test.fullTitle());
  });

  it('display errors when setting a weak password', async function() {
    await ConnectedAccountsPage.visitConnectedAccounts();
    await ConnectedAccountsPage.panel.clickAddAuth0Identity();
    await ConnectedAccountsPage.accountNewForm.fillInPassword('weak').submitForm();
    await percySnapshot(this.test.fullTitle() + ' after submitting');
  });

  it('display errors that come back from the API with detail', async function() {
    await ConnectedAccountsPage.visitConnectedAccounts();
    await ConnectedAccountsPage.panel.clickAddAuth0Identity();
    await ConnectedAccountsPage.accountNewForm
      .fillInPassword('passwordStrengthError!123')
      .submitForm();
    await percySnapshot(this.test.fullTitle() + ' after submitting');
  });

  it('display errors gracefully when there is no detail', async function() {
    await ConnectedAccountsPage.visitConnectedAccounts();
    await ConnectedAccountsPage.panel.clickAddAuth0Identity();
    await ConnectedAccountsPage.accountNewForm
      .fillInPassword('badRequestWithNoDetail!123')
      .submitForm();
    await percySnapshot(this.test.fullTitle() + ' after submitting');
  });

  it('creates an email/password account', async function() {
    await ConnectedAccountsPage.visitConnectedAccounts();
    await ConnectedAccountsPage.panel.clickAddAuth0Identity();
    await ConnectedAccountsPage.accountNewForm.fillInPassword('abcABC123!').submitForm();
    await percySnapshot(this.test.fullTitle() + ' after submitting');
  });
});

describe('Acceptance: ConnectedAccounts when user has Auth0 identity', function() {
  setupAcceptance({authenticate: true});

  setupSession(function(server) {
    server.create('user', 'withAuth0Identity', {
      name: 'Tyrion Lannister',
      email: 'tyrion@lannisters.net',
    });
  });

  it('shows page with a add email/password account button', async function() {
    await ConnectedAccountsPage.visitConnectedAccounts();
    expect(ConnectedAccountsPage.panel.isAddAuth0IdentityVisible).to.equal(false);
    expect(ConnectedAccountsPage.panel.isAddGithubIdentityVisible).to.equal(true);
    expect(ConnectedAccountsPage.isAddAuth0IdentityFormVisible).to.equal(false);

    await percySnapshot(this.test.fullTitle());
  });
});
