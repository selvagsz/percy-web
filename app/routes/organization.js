import {inject as service} from '@ember/service';
import {alias} from '@ember/object/computed';
import Route from '@ember/routing/route';
import localStorageProxy from 'percy-web/lib/localstorage';
import {task} from 'ember-concurrency';
import handleOptionalAuthGetError from 'percy-web/lib/handle-optionally-authenticated-fetch-error';
import isUserMemberPromise from 'percy-web/lib/is-user-member-of-org';

export default Route.extend({
  intercom: service(),
  session: service(),
  store: service(),
  currentUser: alias('session.currentUser'),

  async beforeModel(transition) {
    const currentUser = this.get('currentUser');

    // If we get an organization, it is accessible to whoever's asking for it. Keep going.
    try {
      const org = await this.get('_getOrganization').perform(transition.params);
      this.set('_organization', org);
      return this._super(...arguments);
    } catch (e) {
      return handleOptionalAuthGetError(e, currentUser, this);
    }
  },

  model() {
    // set by beforeModel, if successful.
    return this.get('_organization');
  },

  afterModel(model) {
    this._setupIntercom(model);
    this._setLastOrganizationSlug(model);
  },

  async _setupIntercom(organization) {
    if (await isUserMemberPromise(organization)) {
      this.get('intercom').associateWithCompany(this.get('currentUser'), organization);
    }
  },

  _setLastOrganizationSlug(organization) {
    localStorageProxy.set('lastOrganizationSlug', organization.get('slug'));
  },

  _getOrganization: task(function*(params) {
    const orgSlug = params['organization'].organization_id;
    const preloadedOrg = this.get('store')
      .peekAll('organization')
      .findBy('slug', orgSlug);
    if (preloadedOrg) {
      return preloadedOrg;
    } else {
      return yield this.get('store').findRecord('organization', orgSlug);
    }
  }),
});
