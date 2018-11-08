import setupAcceptance, {setupSession} from '../helpers/setup-acceptance';
import UserSettingsPageObject from '../pages/user-settings-page';
import {percySnapshot} from 'ember-percy';

describe('Acceptance: User Settings', function() {
  setupAcceptance();

  setupSession(function(server) {
    const user = server.create('user', {name: 'Tyrion Lannister', email: 'tyrion@lannisters.net'});
    server.create('identity', 'githubIdentity', {user});
  });

  it('displays profile info page', async function() {
    await UserSettingsPageObject.visitUserSettingsPage();

    await percySnapshot(this.test.fullTitle() + ' before submitting');

    await UserSettingsPageObject.profileForm
      .fillInName('Tyrion Targaryen')
      .fillInEmail('tyrion@motherofdragons.biz')
      .submitForm();
    await percySnapshot(this.test.fullTitle() + ' after submitting');
  });
});
