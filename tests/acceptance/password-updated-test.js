import setupAcceptance, {setupSession} from '../helpers/setup-acceptance';
import stubLockModal from 'percy-web/tests/helpers/stub-lock-modal';
import PasswordUpdatedPageObject from 'percy-web/tests/pages/password-updated';
import {currentURL} from '@ember/test-helpers';
import {percySnapshot} from 'ember-percy';

describe('Acceptance: PasswordUpdated when user is not logged in', function() {
  setupAcceptance({authenticate: false});

  it('displays password update message and login button when success is true', async function() {
    stubLockModal(this.owner);

    await PasswordUpdatedPageObject.visitSuccessfulPasswordReset();
    await percySnapshot(this.test.fullTitle());
    await PasswordUpdatedPageObject.PasswordUpdatedStatusPanel.clickSignin();
    expect(currentURL()).to.equal('/login');
  });
});

describe('Acceptance: PasswordUpdated when user is logged in', function() {
  setupAcceptance({authenticate: true});

  setupSession(function(server) {
    server.create('user');
  });

  it('displays failure message and continue to profile button when success is false', async function() { // eslint-disable-line
    stubLockModal(this.owner);

    await PasswordUpdatedPageObject.visitFailedPasswordReset();
    await percySnapshot(this.test.fullTitle());
    await PasswordUpdatedPageObject.PasswordUpdatedStatusPanel.clickSettings();
    expect(currentURL()).to.equal('/settings/profile');
  });
});
