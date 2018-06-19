import {create, isVisible} from 'ember-cli-page-object';

const SELECTORS = {
  PROJECT_EDIT_FORM: '[data-test-project-edit-form]',
  AUTO_APPROVE_BRANCHES_HEADER: '[data-test-auto-approve-branches-header]',
};

export const ProjectEdit = {
  scope: SELECTORS.PROJECT_EDIT_FORM,

  isAutoApproveBranchesVisible: isVisible(SELECTORS.AUTO_APPROVE_BRANCHES_HEADER),
};

export default create(ProjectEdit);
