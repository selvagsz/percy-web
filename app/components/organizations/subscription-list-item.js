import Component from '@ember/component';
import {computed} from '@ember/object';
import {inject as service} from '@ember/service';

export default Component.extend({
  tagName: '',
  subscriptionData: service(),
  isCustom: computed(function() {
    return this.get('subscriptionData.PLAN_IDS').indexOf(this.get('planData.id')) === -1;
  }),
  isSelected: computed('plan.id', 'planData.id', function() {
    return this.get('plan.id') === this.get('planData.id');
  }),

  selectButtonText: computed('buttonText', 'isSelected', function() {
    if (this.get('buttonText')) {
      return this.get('buttonText');
    } else if (this.get('isSelected')) {
      return 'Selected Plan';
    } else {
      return 'Select Plan';
    }
  }),

  actions: {
    handleSelection() {
      console.log('choosing one');
    },
  },
});
