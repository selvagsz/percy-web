import Component from '@ember/component';
import {computed} from '@ember/object';
import seededRandom from 'percy-web/lib/random';
import {htmlSafe} from '@ember/string';

export default Component.extend({
  tagName: '',

  setGridItemOrder: computed(function() {
    return htmlSafe('order: ' + Math.floor(seededRandom() * 100 + 1));
  }),
});
