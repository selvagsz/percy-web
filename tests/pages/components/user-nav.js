import {create} from 'ember-cli-page-object';
import clickDropdownTrigger from 'percy-web/tests/pages/helpers/click-basic-dropdown-trigger';

const UserMenuLight = {
  clickAvatar() {
    clickDropdownTrigger();
  },
};

export default create(UserMenuLight);
