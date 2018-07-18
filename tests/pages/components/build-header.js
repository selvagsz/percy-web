import {create} from 'ember-cli-page-object';

const SELECTORS = {
  BUILD_HEADER: '[data-test-build-header]',
};

export const BuildHeader = {
  scope: SELECTORS.BUILD_HEADER,
};

export default create(BuildHeader);
