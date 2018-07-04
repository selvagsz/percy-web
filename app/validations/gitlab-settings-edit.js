import {validateLength} from 'ember-changeset-validations/validators';

export default {
  gitlabPersonalAccessToken: validateLength({
    is: 20,
    message: 'Personal access token must be 20 characters',
  }),
};
