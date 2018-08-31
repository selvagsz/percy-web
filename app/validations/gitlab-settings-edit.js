import {validateFormat, validateLength} from 'ember-changeset-validations/validators';

export default {
  gitlabPersonalAccessToken: [
    function(key, newValue, oldValue, changes, content) {
      if (content.get('isGitlabPersonalAccessTokenPresent') && !newValue) {
        return true;
      } else {
        return validateLength({
          is: 20,
          message: 'Personal access token must be 20 characters',
        })(...arguments);
      }
    },
  ],
  gitlabHost: [
    function(key, newValue, oldValue, changes, content) {
      if (content.get('integrationType') === 'gitlab_self_hosted') {
        return validateFormat({type: 'url'})(...arguments);
      } else {
        return true;
      }
    },
  ],
};
