import {JSONAPISerializer} from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  include: [
    'headBuild',
    'baseScreenshot',
    'headScreenshot',
    'baseSnapshot',
    'headSnapshot',
    'diffImage',
    'browser',
  ],
});
