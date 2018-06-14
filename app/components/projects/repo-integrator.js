import {computed} from '@ember/object';
import {alias, or} from '@ember/object/computed';
import PollingMixin from 'percy-web/mixins/polling';
import {inject as service} from '@ember/service';
import Component from '@ember/component';
import moment from 'moment';

export default Component.extend(PollingMixin, {
  project: null,

  isSaving: null,
  isSaveSuccessful: null,

  selectedRepo: alias('project.repo'),
  organization: alias('project.organization'),

  MAX_UPDATE_POLLING_REQUESTS: 10,
  repoRefresh: service(),
  isRepoRefreshInProgress: false,
  isSyncing: alias('organization.isSyncing'),
  groupedRepos: alias('organization.groupedRepos'),
  lastSyncedAt: alias('organization.lastSyncedAt'),
  isRepoDataStale: computed('lastSyncedAt', function() {
    if (!this.get('organization.isVersionControlIntegrated')) {
      return false;
    }

    const isSyncing = this.get('isSyncing');
    const lastSyncedAt = this.get('lastSyncedAt');
    if (!lastSyncedAt || isSyncing) {
      return true;
    } else {
      return moment(lastSyncedAt).isBefore(10, 'minutes');
    }
  }),
  shouldPollForUpdates: or('isRepoDataStale', 'isSyncing'),
  pollRefresh() {
    this.triggerRepoRefresh();
  },
  triggerRepoRefresh() {
    let self = this;
    let organization = this.get('organization');
    this.set('isRepoRefreshInProgress', true);
    this.get('repoRefresh')
      .getFreshRepos(organization)
      .finally(() => {
        self.set('isRepoRefreshInProgress', false);
      });
  },

  triggerSavingIndicator(promise) {
    this.set('isSaveSuccessful', null);
    this.set('isSaving', true);
    promise.then(
      () => {
        this.set('isSaving', false);
        this.set('isSaveSuccessful', true);
      },
      () => {
        this.set('isSaveSuccessful', false);
      },
    );
  },

  classNames: ['ProjectsRepoIntegrator'],
  classNameBindings: ['classes'],
  actions: {
    chooseRepo(repo) {
      let project = this.get('project');
      project.set('repo', repo);

      // If the project is not saved (ie. we're on the new project screen), don't trigger saving,
      // just set the property above and it will be saved when the user creates the project.
      if (!project.get('isNew')) {
        this.triggerSavingIndicator(project.save());
      }
    },
    refreshRepos() {
      this.triggerRepoRefresh();
    },
  },
});
