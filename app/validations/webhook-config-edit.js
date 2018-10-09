import {validatePresence} from 'ember-changeset-validations/validators';

export default {
  description: [validatePresence(true)],
  url: [validatePresence(true)],
  subscribedEvents: [validatePresence(true)],
};
