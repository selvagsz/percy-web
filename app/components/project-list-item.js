import Component from '@ember/component';
import {computed} from '@ember/object';
import {task} from 'ember-concurrency';
import {inject as service} from '@ember/service';

export default Component.extend({
  store: service(),

  recentBuild: computed.or('localRecentBuild', 'serverRecentBuild'),
  serverRecentBuild: computed.readOnly('_getMostRecentBuild.lastSuccessful.value.firstObject'),

  localRecentBuild: computed('project.builds', function() {
    const allBuilds = this.get('store').peekAll('build');

    const projectBuilds = allBuilds.filter(build => {
      return build.get('project.id') === this.get('project.id');
    });

    const sortedBuilds = projectBuilds.sort((a, b) => {
      return b.get('id') - a.get('id');
    });

    // if no builds are found then need to get a build
    if (sortedBuilds.length > 0) {
      return sortedBuilds.get('firstObject');
    } else {
      this.get('_getMostRecentBuild').perform(this.get('project'));
      return false;
    }
  }),

  _getMostRecentBuild: task(function*(project) {
    const mostRecentBuild = yield this.store.query('build', {project: project, page: {limit: 1}});
    return mostRecentBuild;
  }),
});
