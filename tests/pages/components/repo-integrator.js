import {create, text, isVisible, collection} from 'ember-cli-page-object';

const SELECTORS = {
  POWER_SELECT_DROPDOWN: '.ember-power-select-dropdown',
  POWER_SELECT_ALL_OPTIONS: '.ember-power-select-dropdown > ul.ember-power-select-options',
  POWER_SELECT_GROUPS: 'li.ember-power-select-group',
  POWER_SELECT_FIRST_GROUP: 'li.ember-power-select-group:first-of-type',
  POWER_SELECT_LAST_GROUP: 'li.ember-power-select-group:last-of-type',
  POWER_SELECT_GROUP_NAME: '.ember-power-select-group-name',
};

export const RepoIntegrator = {
  scope: SELECTORS.POWER_SELECT_DROPDOWN,
  isSelectorOpen: isVisible(SELECTORS.POWER_SELECT_GROUPS, {multiple: true}),

  groups: collection({
    itemScope: SELECTORS.POWER_SELECT_GROUPS,
    item: {
      name: text(SELECTORS.POWER_SELECT_GROUP_NAME),
    },
  }),

  lastGroup: {
    scope: SELECTORS.POWER_SELECT_LAST_GROUP,
    name: text(SELECTORS.POWER_SELECT_GROUP_NAME),
  },
};

export default create(RepoIntegrator);
