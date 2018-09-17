import Component from '@ember/component';

export default Component.extend({
  carosel: null,
  currentSlide: 0,

  didInsertElement() {
    // Siema is imported in ember-cli-build.js
    const carosel = new Siema({ // eslint-disable-line
      loop: true,
      onChange: this._setCurrentSlide.bind(this),
    });

    this.set('carosel', carosel);
  },

  actions: {
    switchToSlide(index) {
      this.get('carosel').goTo(index);
      this._setCurrentSlide();
    },
  },

  _setCurrentSlide() {
    this.set('currentSlide', this.get('carosel').currentSlide);
  },
});
