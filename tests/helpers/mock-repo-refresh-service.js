import Service from '@ember/service';
import {resolve} from 'rsvp';

export default function mockRepoRefresh(context, newRepos, newLastSyncedAt) {
  const repoRefreshServiceStub = Service.extend({
    getFreshRepos() {
      let organization = context.get('project.organization');
      if (newLastSyncedAt) {
        organization.set('lastSyncedAt', newLastSyncedAt);
      }
      if (newRepos) {
        organization.set('repos', newRepos);
      }
      return resolve(organization.get('repos'));
    },
  });
  context.register('service:repoRefresh', repoRefreshServiceStub);
  context.inject.service('repoRefresh', {as: 'repoRefresh'});
  return repoRefreshServiceStub;
}
