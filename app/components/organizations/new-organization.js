import Component from '@ember/component';
import EnsureStatefulLogin from 'percy-web/mixins/ensure-stateful-login';
import {computed} from '@ember/object';
import {inject as service} from '@ember/service';

export default Component.extend(EnsureStatefulLogin, {
  session: service(),

  githubMarketplacePlanId: null,

  currentUser: computed.alias('session.currentUser'),
  githubIdentity: computed.alias('currentUser.hasGithubIdentity'),
  hasGithubIdentity: computed.alias('currentUser.hasGithubIdentity.isTruthy'),
  isGithubPurchase: computed.notEmpty('githubMarketplacePlanId'),

  needsGithubIdentity: computed('isGithubPurchase', 'hasGithubIdentity', function() {
    // false if not guthub purchase or github purchase without connected github account
    return this.get('isGithubPurchase') && !this.get('hasGithubIdentity');
  }),

  actions: {
    connectGithub() {
      this.showConnectToGithubPurchaseModal(this.get('githubMarketplacePlanId'));
    },
  },
});
