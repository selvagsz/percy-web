import {computed} from '@ember/object';
import {alias} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import Component from '@ember/component';
import {htmlSafe} from '@ember/string';

export default Component.extend({
  organization: null,

  store: service(),
  session: service(),
  currentUser: alias('session.currentUser'),
  showWhenIntegrationEnabled: computed('isGithubEnterpriseIntegrated', function() {
    return htmlSafe(!this.get('isGithubEnterpriseIntegrated') ? '' : 'display: none');
  }),
  isGithubEnterpriseIntegrated: alias('organization.isGithubEnterpriseIntegrated'),
});
