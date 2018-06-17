import {computed} from '@ember/object';
import {alias} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import Component from '@ember/component';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

export default Component.extend({
  organization: null,
  classes: null,

  store: service(),
  session: service(),
  currentUser: alias('session.currentUser'),

  changeset: computed('organization', function() {
    let validator = this.get('validator') || {};
    return new Changeset(this.get('organization'), lookupValidator(validator), validator);
  }),
  disableSave: computed(
    'changeset.githubAuthMechanism',
    'changeset.isPristine',
    'changeset.isInvalid',
    'organization.githubIntegration',
    function() {
      let mechanism = this.get('changeset.githubAuthMechanism');

      // Special case: disable save if on "Official GitHub Integration" is selected at all.
      if (mechanism === 'github-integration') {
        return true;
      }

      return this.get('changeset.isPristine') || this.get('changeset.isInvalid');
    },
  ),

  isEligibleForGithubIntegration: alias('currentUser.hasGithubIdentity'),
  githubAuthMechanism: alias('changeset.githubAuthMechanism'),

  isSaveSuccessful: null,
  isSaving: null,

  classNames: ['OrganizationsGithubSettings'],
  classNameBindings: ['classes'],
  actions: {
    showSupport() {
      this.sendAction('showSupport');
    },
    changeSelection(newSelection) {
      this.get('changeset').rollback();

      // If selecting the same as the currently active auth mechanism, don't dirty the changeset.
      if (newSelection === this.get('organization.githubAuthMechanism')) {
        return;
      }

      this.get('changeset').set('githubAuthMechanism', newSelection);
    },
    saveSelection() {
      let organization = this.get('organization');
      let currentSelection = this.get('changeset.githubAuthMechanism');
      let changeset = this.get('changeset');

      // Some custom validations, these require state outside of the attributes themselves so
      // we don't use a standard validations object.
      let currentIntegration = organization.get('githubIntegration');
      if (currentSelection !== 'github-integration' && currentIntegration) {
        changeset.addError('base', [
          'The official Percy GitHub App must be uninstalled in GitHub ' +
            'before you can switch to a different integration type.',
        ]);
      }

      changeset.validate().then(() => {
        if (changeset.get('isInvalid')) {
          return;
        }
        this.set('isSaveSuccessful', null);
        this.set('isSaving', true);
        changeset.save().then(
          () => {
            this.set('isSaving', false);
            this.set('isSaveSuccessful', true);
          },
          () => {
            this.set('isSaving', false);
            this.set('isSaveSuccessful', false);
          },
        );
      });
    },
  },
});
