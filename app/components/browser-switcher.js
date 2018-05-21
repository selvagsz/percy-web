import Component from '@ember/component';
import {alias} from '@ember/object/computed';

export default Component.extend({
  attributeBindings: ['data-test-browser-switcher'],
  'data-test-browser-switcher': true,
  browsers: null,

  build: null,
  updateActiveBrowser() {},
  unapprovedSnapshotsWithDiffForBrowsers: alias('build.unapprovedSnapshotsWithDiffForBrowsers'),
});
