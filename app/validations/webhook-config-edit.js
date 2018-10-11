import {validatePresence, validateLength} from 'ember-changeset-validations/validators';

export default {
  url: [validatePresence(true)],
  subscribedEvents: [validatePresence(true)],
  description: [validateLength({max: 64})],
  authToken: [validateLength({max: 64})],
};
