import DS from 'ember-data';
import {computed} from '@ember/object';

export default DS.Model.extend({
  userHash: DS.attr(),
  name: DS.attr(),
  email: DS.attr(),
  avatarUrl: DS.attr(),
  unverifiedEmail: DS.attr(),

  identities: DS.hasMany('identities', {async: false}),

  hasGithubIdentity: computed('identities.@each.provider', function() {
    return this.get('identities').findBy('provider', 'github');
  }),

  hasEmailPasswordIdentity: computed('identities.@each.provider', function() {
    return this.get('identities').findBy('provider', 'emailPasswordIdentity');
  }),

  emailPasswordIdentity: computed('identities.@each.provider', function() {
    return this.get('identities').findBy('provider', 'auth0');
  }),

  // These endpoints are only available on the current user and should not be accessed otherwise.
  organizations: DS.hasMany('organizations', {inverse: null}),

  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),

  isVerified: computed.notEmpty('email'),
});
