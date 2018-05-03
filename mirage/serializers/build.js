import {JSONAPISerializer} from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  include: ['project', 'repo', 'approvedBy', 'commit', 'baseBuild', 'browsers'],
  links(build) {
    return {
      snapshots: {
        related: `/api/v1/builds/${build.id}/snapshots`,
      },
      comparisons: {
        related: `/api/v1/builds/${build.id}/comparisons`,
      },
    };
  },
});
