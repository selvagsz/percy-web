import {attribute, create, text} from 'ember-cli-page-object';

const SELECTORS = {
  COMMIT_TABLE: '[data-test-commit-table]',
  BRANCH_URL: '[data-test-commit-table-branch-url]',
  COMMIT_URL: '[data-test-commit-table-commit-url]',
};

export const CommitTable = {
  scope: SELECTORS.COMMIT_TABLE,
  commitUrl: {
    scope: SELECTORS.COMMIT_URL,
    href: attribute('href'),
    text: text(),
  },
  branchUrl: {
    scope: SELECTORS.BRANCH_URL,
    href: attribute('href'),
    text: text(),
  },
};

export default create(CommitTable);
