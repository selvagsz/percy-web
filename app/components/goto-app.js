import {inject as service} from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  session: service(),
  tagName: 'button',
  attributeBindings: ['tabindex'],
  tabindex: 0,

  redirectToDefaultOrganization: null,

  classNames: ['btn btn-md py-1 px-4 btn-app-access text-base cursor-pointer text-white'],
  classNameBindings: ['classes'],

  click() {
    this.sendAction('redirectToDefaultOrganization');
  },

  keyDown(event) {
    // 13 = return key
    if (event.keyCode == 13) {
      this.click();
    }
  },
});
