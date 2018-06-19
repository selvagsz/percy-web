import {visitable, collection, clickable, create, isVisible} from 'ember-cli-page-object';
import {BuildCard} from 'percy-web/tests/pages/components/build-card';

const SELECTORS = {
  PROJECT_CONTAINER: '[data-test-project-container]',
  REPO_LINKED: '[data-test-project-container-project-repo-linked]',
  GITHUB_LOGO: 'svg[data-test-github-icon]',
  GITLAB_LOGO: 'svg[data-test-gitlab-icon]',
  QUICKSTART_BUTTON: '[data-test-quickstart-button]',
};

const ProjectPage = {
  scope: SELECTORS.PROJECT_CONTAINER,

  visitProject: visitable('/:orgSlug/:projectSlug'),

  builds: collection({
    itemScope: BuildCard.scope,
    item: BuildCard,
  }),

  repoLinked: {
    scope: SELECTORS.REPO_LINKED,
    githubLogo: {
      scope: SELECTORS.GITHUB_LOGO,
      isVisible: isVisible(),
    },
    gitlabLogo: {
      scope: SELECTORS.GITLAB_LOGO,
      isVisible: isVisible(),
    },
  },

  finishedBuilds: {
    isDescriptor: true,
    get() {
      return this.builds().filter(build => !!build.isFinished);
    },
  },

  clickQuickstartButton: clickable(SELECTORS.QUICKSTART_BUTTON),
};

export default create(ProjectPage);
