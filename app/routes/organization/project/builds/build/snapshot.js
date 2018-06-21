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

  activate() {
    this._track('Snapshot Fullscreen Viewed');
  },

  _track(actionName, extraProps) {
    let build = this.modelFor('organization.project.builds.build');
    const genericProps = {
      project_id: build.get('project.id'),
      project_slug: build.get('project.slug'),
      build_id: build.get('id'),
      snapshot_id: this.get('params').snapshot_id,
    };
    const organization = build.get('project.organization');

    const props = Object.assign({}, extraProps, genericProps);
    this.analytics.track(actionName, organization, props);
  },

  actions: {
    didTransition() {
      this._super(...arguments);
      this.send('updateIsHidingBuildContainer', true);
    },
    updateComparisonMode(mode) {
      this._updateQueryParams({comparisonMode: mode});
      this._track('Fullscreen: Comparison Mode Switched', {mode});
    },
    updateActiveBrowser(newBrowser) {
      this._updateActiveBrowser(newBrowser);
      this._track('Fullscreen: Browser Switched', {
        browser_id: newBrowser.get('id'),
        browser_family_slug: newBrowser.get('browserFamily.slug'),
      });
    },
    transitionRouteToWidth(width) {
      this._updateQueryParams({newWidth: width});
      this._track('Fullscreen: Width Switched', {width});
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
