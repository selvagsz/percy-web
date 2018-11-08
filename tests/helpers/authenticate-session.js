import Test from 'ember-simple-auth/authenticators/test';
import wait from 'ember-test-helpers/wait';

// Copied from here:
// github.com/simplabs/ember-simple-auth/blob/master/test-support/helpers/ember-simple-auth.js
// but having it locally/replacing `wait` helper prevents a circular JSON reference
const TEST_CONTAINER_KEY = 'authenticator:test';

export function authenticateSession(app, sessionData) {
  const {__container__: container} = app;
  const session = container.lookup('service:session');
  ensureAuthenticator(app, container);
  session.authenticate(TEST_CONTAINER_KEY, sessionData);
  return wait();
}

function ensureAuthenticator(app, container) {
  const authenticator = container.lookup(TEST_CONTAINER_KEY);
  if (!authenticator) {
    app.register(TEST_CONTAINER_KEY, Test);
  }
}
