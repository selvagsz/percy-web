import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ResetScrollMixin from 'percy-web/mixins/reset-scroll';
import {inject as service} from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, ResetScrollMixin, {
  store: service(),
  flashMessages: service(),
  params: {},
  queryParams: {
    comparisonMode: {as: 'mode'},
    activeBrowserFamilySlug: {as: 'browser', refreshModel: true},
  },
  model(params /*transition*/) {
    this.set('params', params);
    return this.store.findRecord('snapshot', params.snapshot_id);
  },

  setupController(controller) {
    this._super(...arguments);
    const params = this.get('params');
    const build = this.modelFor('organization.project.builds.build');
    const activeBrowser = this.get('store')
      .peekAll('browser')
      .findBy('familySlug', params.activeBrowserFamilySlug);

    const validatedBrowser = this._validateBrowser(activeBrowser, build);

    if (validatedBrowser) {
      controller.setProperties({
        build,
        activeBrowser,
        snapshotId: params.snapshot_id,
        snapshotSelectedWidth: params.width,
        comparisonMode: params.comparisonMode,
      });
    }
  },

  _validateBrowser(browser, build) {
    const buildBrowserIds = build.get('browsers').mapBy('id');
    const isBrowserForBuild = browser && buildBrowserIds.includes(browser.get('id'));
    if (!browser || !isBrowserForBuild) {
      const allowedBrowser = build.get('browsers.firstObject');
      this._updateActiveBrowser(allowedBrowser);
      this.get('flashMessages').danger(
        `There are no comparisons for "${
          this.get('params').activeBrowserFamilySlug
        }" browser. Displaying comparisons for ${allowedBrowser.get('familyName')}.`,
      );
    } else {
      return browser;
    }
  },

  _updateActiveBrowser(newBrowser) {
    this.controllerFor(this.routeName).set('activeBrowser', newBrowser);
    this._updateQueryParams({newBrowserSlug: newBrowser.get('familySlug')});
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
      this._updateActiveBrowser(newBrowser);
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
    const width = params.newWidth || controller.get('snapshotSelectedWidth') || this.params.width;

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
