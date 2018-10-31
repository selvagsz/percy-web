import Component from '@ember/component';
import {inject as service} from '@ember/service';

export default Component.extend({
  router: service(),

  build: null,
  classes: null,
  tagName: '',

  actions: {
    navigateToBuild() {
      const organizationSlug = this.get('project.organization.slug');
      const projectSlug = this.get('project.slug');

      // VERY IMPORTANT: pass the build id rather than the build object
      // in order to always activate the model hook in org.project.builds.build route
      this.get('router').transitionTo(
        'organization.project.builds.build',
        organizationSlug,
        projectSlug,
        this.get('build.id'),
      );
    },

    stopPropagation(e) {
      e.stopPropagation();
    },
  },
});
