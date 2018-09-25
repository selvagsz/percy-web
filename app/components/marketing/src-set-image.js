import Component from '@ember/component';
import {computed} from '@ember/object';
import {readOnly} from '@ember/object/computed';

export default Component.extend({
  srcSet: null,
  windowSize: 0,

  init() {
    this._super(...arguments);
    this.set('windowSize', window.innerWidth);
    window.addEventListener('resize', () => {
      this.set('windowSize', window.innerWidth);
    });
  },

  defaultImageWidth: readOnly('srcSet.defaultImage.file.details.image.width'),

  imgSrc: computed('windowSize', function() {
    if (this.get('windowSize') > this.get('defaultImageWidth')) {
      return this.get('srcSet.largeImageUrl');
    } else {
      return this.get('srcSet.defaultImage.file.url');
    }
  }),
});
