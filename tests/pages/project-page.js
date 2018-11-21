import {ProjectContainer} from 'percy-web/tests/pages/components/project-container';
import {visitable, clickable, create} from 'ember-cli-page-object';
import {alias} from 'ember-cli-page-object/macros';

const SELECTORS = {
  PROJECT_PAGE: '[data-test-project-page]',
  TOGGLE_PROJECT_SIDEBAR: '[data-test-toggle-project-sidebar]',
  TOGGLE_ARCHIVED_PROJECTS: '[data-test-toggle-archived-projects]',
};

const ProjectPage = {
  scope: SELECTORS.PROJECT_PAGE,

  visitOrg: visitable('/:orgSlug'),
  visitProject: visitable('/:orgSlug/:projectSlug'),

  projectContainer: ProjectContainer,

  builds: alias('projectContainer.builds'),
  finishedBuilds: alias('projectContainer.finishedBuilds'),
  infinityLoader: alias('projectContainer.infinityLoader'),

  clickQuickstartButton: alias('projectContainer.clickQuickstartButton'),

  isNoBuildsPanelVisible: alias('projectContainer.isNoBuildsPanelVisible'),
  isPublicProjectNoticeVisible: alias('projectContainer.isPublicProjectNoticeVisible'),

  isPublicProjectIconVisible: alias('projectContainer.isPublicProjectIconVisible'),
  clickProjectSettings: alias('projectContainer.clickProjectSettings'),

  toggleProjectSidebar: clickable(SELECTORS.TOGGLE_PROJECT_SIDEBAR),
  toggleArchivedProjects: clickable(SELECTORS.TOGGLE_ARCHIVED_PROJECTS),
};

export default create(ProjectPage);
