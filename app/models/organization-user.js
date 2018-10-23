import {computed} from '@ember/object';
import DS from 'ember-data';

export const ROLE_ID_TO_TITLE = {
  admin: 'Administrator',
  member: 'Member',
  billing_admin: 'Billing Admin',
};

export default DS.Model.extend({
  organization: DS.belongsTo('organization', {async: false}),
  user: DS.belongsTo('user', {async: false, inverse: null}),

  createdAt: DS.attr(),
  role: DS.attr(),

  roleTitle: computed('role', function() {
    return ROLE_ID_TO_TITLE[this.get('role')];
  }),
});
