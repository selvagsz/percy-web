import {visitable, create} from 'ember-cli-page-object';
import {SettingsNavWrapper} from 'percy-web/tests/pages/components/organizations/settings-nav-wrapper'; // eslint-disable-line
import {ProjectEdit} from 'percy-web/tests/pages/components/forms/project-edit';
import {alias} from 'ember-cli-page-object/macros';

export const ProjectSettingsPage = {
  visitProjectSettings: visitable('/:orgSlug/:projectSlug/settings'),

  sideNav: SettingsNavWrapper,
  projectLinks: alias('sideNav.projectLinks'),

  projectEditForm: ProjectEdit,

  isAutoApproveBranchesVisible: alias('projectEditForm.isAutoApproveBranchesVisible'),
};

export default create(ProjectSettingsPage);
