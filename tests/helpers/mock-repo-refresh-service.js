import Service from '@ember/service';
import {resolve} from 'rsvp';

export default function mockRepoRefresh(context, newRepos, newLastSyncedAt, stub) {
  const repoRefreshServiceStub = Service.extend({
    getFreshRepos() {
      let organization = context.get('project.organization');
      if (newLastSyncedAt) {
        organization.set('lastSyncedAt', newLastSyncedAt);
      }
      if (newRepos) {
        organization.set('repos', newRepos);
      }
      if (stub) {
        stub();
      }
      return resolve(organization.get('repos'));
    },
  });
  context.owner.register('service:repoRefresh', repoRefreshServiceStub, 'repoRefresh');
  return repoRefreshServiceStub;
}
