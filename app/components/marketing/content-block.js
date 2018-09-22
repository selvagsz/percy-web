import Component from '@ember/component';
import {readOnly} from '@ember/object/computed';
import {computed} from '@ember/object';

export default Component.extend({
  supportingTextSections: readOnly('block.supportingTextSections'),

  numSupportingTextColumns: computed('supportingTextSections.length', function() {
    if (this.get('supportingTextSections.length') % 3 === 0) {
      return 3;
    } else if (this.get('supportingTextSections.length') % 2 === 0) {
      return 2;
    } else {
      return 1;
    }
  }),
});
