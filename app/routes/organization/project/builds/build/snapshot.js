import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ResetScrollMixin from 'percy-web/mixins/reset-scroll';
import {inject as service} from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, ResetScrollMixin, {
  store: service(),
  params: {},
  queryParams: {
    comparisonMode: {as: 'mode'},
    activeBrowserFamilySlug: {as: 'browser'},
  },
  model(params /*transition*/) {
    this.set('params', params);
    return this.store.findRecord('snapshot', params.snapshot_id);
  },

  setupController(controller) {
    this._super(...arguments);
    let params = this.get('params');
    let build = this.modelFor('organization.project.builds.build');
    let activeBrowser = this.get('store')
      .peekAll('browser')
      .findBy('familySlug', params.activeBrowserFamilySlug);

    controller.setProperties({
      build,
      activeBrowser,
      snapshotId: params.snapshot_id,
      snapshotSelectedWidth: params.width,
      comparisonMode: params.comparisonMode,
    });
  },
  actions: {
    didTransition() {
      this._super(...arguments);
      this.send('updateIsHidingBuildContainer', true);

      let build = this.modelFor('organization.project.builds.build');
      let organization = build.get('project.organization');
      let eventProperties = {
        project_id: build.get('project.id'),
        project_slug: build.get('project.slug'),
        build_id: build.get('id'),
        snapshot_id: this.get('params').snapshot_id,
      };
      this.analytics.track('Snapshot Fullscreen Viewed', organization, eventProperties);
    },
    updateComparisonMode(mode) {
      this._updateQueryParams({comparisonMode: mode});
    },
    updateActiveBrowser(newBrowser) {
      this.controllerFor(this.routeName).set('activeBrowser', newBrowser);
      this._updateQueryParams({newBrowserSlug: newBrowser.get('familySlug')});
    },
    transitionRouteToWidth(width) {
      this._updateQueryParams({newWidth: width});
    },
  },

  _updateQueryParams(params) {
    const controller = this.controllerFor(this.routeName);
    const snapshot = this.modelFor(this.routeName);
    const comparisonMode = params.comparisonMode || controller.get('comparisonMode');
    const browser = params.newBrowserSlug || controller.get('activeBrowser.familySlug');
    const width = params.newWidth || controller.get('snapshotSelectedWidth');

    this.transitionTo(
      'organization.project.builds.build.snapshot',
      snapshot.get('build.id'),
      snapshot.get('id'),
      width,
      {
        queryParams: {
          mode: comparisonMode,
          activeBrowserFamilySlug: browser,
        },
      },
    );
  },
});
