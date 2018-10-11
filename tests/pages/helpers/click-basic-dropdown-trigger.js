import {clickTrigger} from 'ember-basic-dropdown/test-support/helpers';
import Ember from 'ember';

export default function clickDropdownTrigger(selector, styleAttrs) {
  // Dropdown content panel is positioned offscreen due to how the addon
  // calculates its positioning. Move the dropdown to on screen and to approximately
  // the right position so we can take percy snapshots.
  clickTrigger(selector);
  const content = Ember.$('.ember-basic-dropdown-content');
  styleAttrs = styleAttrs || {
    top: '48px',
    right: '60px',
  };
  content.css(styleAttrs);
}
