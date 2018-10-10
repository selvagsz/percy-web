import {computed, get} from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  changeset: null,
  title: null,
  property: null,

  // key-value map of the attribute name => description.
  // This might have to change to an array of {title, value, description} later.
  allValues: {},

  classes: null,
  classNames: ['FormFieldsCheckbox'],
  classNameBindings: ['classes'],

  propertyValue: computed('changeset.isPristine', function() {
    return this.get(`changeset.${this.get('property')}`);
  }),

  fieldErrors: computed('changeset.error', function() {
    return get(this.get('changeset.error'), this.get('property'));
  }),

  actions: {
    updateValue(event) {
      let property = `changeset.${this.get('property')}`;
      let oldValue = this.changeset.get(this.get('property'));
      let newValue;

      if (event.target.checked) {
        // If we're enabling the target, add it to the array
        newValue = oldValue.concat([event.target.name]);
      } else {
        // If we're disabling the target, remove it from the array
        newValue = oldValue.filter(v => v != event.target.name);
      }

      // Remove duplicates and save.
      this.set(property, [...new Set(newValue)]);
    },
  },
});
