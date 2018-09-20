import {clickTrigger} from 'ember-basic-dropdown/test-support/helpers';
import Ember from 'ember';

// This will probably have to be adapted to work with acceptance tests eventually
export default function clickDropdownTrigger(selector) {
  // Dropdown content panel is positioned offscreen due to how the addon
  // calculates its positioning. Move the dropdown to on screen and to approximately
  // the right position so we can take percy snapshots.
  clickTrigger(selector);
  const content = Ember.$('.ember-basic-dropdown-content');
  content.css({
    top: '48px',
    right: '60px',
  });
}
