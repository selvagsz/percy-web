import setupAcceptance, {setupSession} from '../helpers/setup-acceptance';
import PasswordChangeRequest from '../pages/components/password-change-request';
import {percySnapshot} from 'ember-percy';

describe('Acceptance: PasswordChangeRequest', function() {
  setupAcceptance({authenticate: true});

  setupSession(function(server) {
    const user = server.create('user', 'withAuth0Identity');
    this.user = user;
  });

  it('shows page with change password button', async function() {
    await PasswordChangeRequest.visitUserSettingsPage();
    expect(PasswordChangeRequest.isPasswordChangeMessagePresent).to.equal(false);
    expect(PasswordChangeRequest.isPasswordChangeButtonPresent).to.equal(true);

    await percySnapshot(this.test.fullTitle());
  });

  it('shows page with change password sent message', async function() {
    await PasswordChangeRequest.visitUserSettingsPage();
    await PasswordChangeRequest.submitRequest();
    expect(PasswordChangeRequest.isPasswordChangeMessagePresent).to.equal(true);
    expect(PasswordChangeRequest.changePasswordMessageContains(this.user.email)).to.equal(true);

    await percySnapshot(this.test.fullTitle());
  });
});
