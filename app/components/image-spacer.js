import {htmlSafe} from '@ember/string';
import {computed} from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  image: null,
  imageClass: '',

  action: null,
  bubbles: true,

  classNames: ['ImageSpacer'],
  attributeBindings: ['style'],
  style: computed('image.width', 'image.height', function() {
    let scale = (this.get('image.height') * 100.0) / this.get('image.width');
    return htmlSafe(`padding-top: ${scale}%`);
  }),

  click(e) {
    let action = this.get('action');
    if (action) {
      action();
    }
    if (!this.get('bubbles')) {
      e.stopPropagation();
    }
  },
});
