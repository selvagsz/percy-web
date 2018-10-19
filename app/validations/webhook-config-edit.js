import {
  validatePresence,
  validateLength,
  validateFormat,
} from 'ember-changeset-validations/validators';

export default {
  url: [validatePresence(true), validateFormat({type: 'url'})],
  subscribedEvents: [validatePresence(true)],
  description: [validateLength({max: 64})],
  authToken: [validateLength({max: 64})],
};
