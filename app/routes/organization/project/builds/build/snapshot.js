import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ResetScrollMixin from 'percy-web/mixins/reset-scroll';

export default Route.extend(AuthenticatedRouteMixin, ResetScrollMixin, {
  params: {},
  queryParams: {
    comparisonMode: {as: 'mode'},
  },
  model(params /*transition*/) {
    this.set('params', params);
    return this.store.findRecord('snapshot', params.snapshot_id);
  },

  setupController(controller) {
    this._super(...arguments);

    let params = this.get('params');
    let build = this.modelFor('organization.project.builds.build');

    controller.setProperties({
      build,
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
    updateComparisonMode(value) {
      this.controllerFor(this.routeName).set('comparisonMode', value.toString());
    },
    transitionRouteToWidth(snapshot, width, comparisonMode) {
      this.transitionTo('organization.project.builds.build.snapshot', snapshot.id, width, {
        queryParams: {mode: comparisonMode},
      });
    },
  },
});
