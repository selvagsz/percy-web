import {alias} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import utils from 'percy-web/lib/utils';
import Component from '@ember/component';

export default Component.extend({
  organization: null,

  store: service(),
  session: service(),
  currentUser: alias('session.currentUser'),
  isGitlabIntegrated: alias('organization.isGitlabIntegrated'),

  actions: {
    redirectToGitlabAuthorization(organization) {
      let slug = organization.get('slug');
      if (slug) {
        utils.setWindowLocation(`/api/auth/gitlab/redirect/${slug}`);
      }
    },
  },
});
