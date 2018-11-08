import setupAcceptance, {setupSession} from '../helpers/setup-acceptance';
import {percySnapshot} from 'ember-percy';
import {visit, currentRouteName} from '@ember/test-helpers';
import {authenticateSession} from 'percy-web/tests/helpers/authenticate-session';

describe('Acceptance: Login', function() {
  setupAcceptance({authenticate: false});

  setupSession(function(server) {
    this.loginUser = false;
    this.server = server;
  });

  it('should login and logout user', async function() {
    await visit('/');
    percySnapshot(this.test.fullTitle() + ' | Logged out');

    this.server.create('user', {_currentLoginInTest: true});
    await authenticateSession(this.owner);
    expect(currentRouteName()).to.equal('organizations.new');

    await percySnapshot(this.test.fullTitle() + ' | Logged in');
  });
});
