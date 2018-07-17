// This restores an older behavior of ember-simple-auth-auth0.
// TODO: remove this file when this issue is fixed and silent auth is available:
// https://github.com/auth0-community/ember-simple-auth-auth0/issues/120

import Ember from 'ember';
import Auth0UrlHash from 'ember-simple-auth-auth0/authenticators/auth0-url-hash';

const {RSVP} = Ember;

export default Auth0UrlHash.extend({
  restore(data) {
    return RSVP.resolve(data);
  },
});
