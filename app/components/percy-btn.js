import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  actions: {
    onTap() {
      if (this.get('onTap')) {
        this.get('onTap')();
      }
    },
  },
});
