import {computed, get} from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  changeset: null,
  title: null,
  property: null,
  type: 'text',
  autofocus: false,
  autocomplete: null,
  classes: null,
  disabled: false,

  classNames: ['FormFieldsInput'],
  classNameBindings: ['classes'],

  fieldErrors: computed('changeset.error', function() {
    return get(this.get('changeset.error'), this.get('property'));
  }),

  didUpdateAttrs() {
    // if autofocus changes and is true then the input needs to be manually focused
    if (this.get('autofocus')) {
      document.getElementsByClassName('form-control')[0].focus();
    }
  },
});
