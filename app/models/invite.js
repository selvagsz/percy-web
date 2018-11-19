import DS from 'ember-data';
import {computed} from '@ember/object';
import {ROLE_ID_TO_TITLE} from './organization-user';

export default DS.Model.extend({
  fromUser: DS.belongsTo('user', {async: false}),
  organization: DS.belongsTo('organization', {async: false}),

  createdAt: DS.attr(),
  email: DS.attr(),
  expiresAt: DS.attr(),
  inviteLink: DS.attr(),
  isExpired: DS.attr('boolean'),
  role: DS.attr(),

  // Only for creation:
  emails: DS.attr(),

  roleTitle: computed('role', function() {
    return ROLE_ID_TO_TITLE[this.get('role')];
  }),
});
