import {mapBy} from '@ember/object/computed';
import {computed, get} from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  family: null,
  existingBrowserFamilies: null,

  existingBrowserFamilyIds: mapBy('existingBrowserFamilies', 'id'),
  isBrowserEnabled: computed('existingBrowserFamilyIds.[]', 'family.id', function() {
    return get(this, 'existingBrowserFamilyIds').includes(get(this, 'family.id'));
  }),
});
