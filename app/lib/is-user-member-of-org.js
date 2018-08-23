import {resolve} from 'rsvp';
import DS from 'ember-data';

// This method _always_ returns a promise.
// Wherever you use this, you must not make any decisions based on the final value
// until the promise is resolved.
export default function isUserMemberPromise(org) {
  return DS.PromiseObject.create({
    promise: _getOrganizationUsers(org).then(orgUsers => {
      return orgUsers && !!orgUsers.get('firstObject');
    }),
  });
}

async function _getOrganizationUsers(org) {
  try {
    return await org.get('_filteredOrganizationUsers');
  } catch (e) {
    return resolve(false);
  }
}
