import {alias} from '@ember/object/computed';
import Component from '@ember/component';
import {inject as service} from '@ember/service';

export default Component.extend({
  flashMessages: service(),
  build: null,
  approve: null,
  approvableSnapshots: null,
  isApproved: alias('build.isApproved'),
  isLoading: false,
  isDisabled: false,
  tagName: 'button',
  classNames: ['build-approval-button btn btn-md btn-success ml-2 px-2 flex items-center'],
  classNameBindings: ['isLoading:is-loading', 'isApproved:is-approved'],
  attributeBindings: ['data-test-build-approval-button', 'isDisabled:disabled'],
  'data-test-build-approval-button': true,

  click() {
    if (this.get('build.isApproved')) {
      this.get('flashMessages').info('This build was already approved');
      return;
    }

    if (this.get('approvableSnapshots.length') === 0) {
      return;
    }

    this.set('isLoading', true);
    this.get('createReview')(this.get('approvableSnapshots')).finally(() => {
      this.set('isLoading', false);
    });
  },
});
