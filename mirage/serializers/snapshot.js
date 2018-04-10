import {JSONAPISerializer} from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  include: [
    'comparisons',
    'comparisons.baseScreenshot',
    'comparisons.baseScreenshot.image',
    'comparisons.baseScreenshot.lossyImage',
    'comparisons.headScreenshot',
    'comparisons.headScreenshot.image',
    'comparisons.headScreenshot.lossyImage',
    'comparisons.baseSnapshot',
    'comparisons.headSnapshot',
    'comparisons.diffImage',
    // Builds are not fully included by API, but it does send the resource linkage info,
    // and this is the best way to mimick that in Mirage for now.
    'build',
  ],
});
