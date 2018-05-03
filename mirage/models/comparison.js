import {Model, belongsTo} from 'ember-cli-mirage';

export default Model.extend({
  headBuild: belongsTo('build'),
  headSnapshot: belongsTo('snapshot'),
  baseSnapshot: belongsTo('snapshot', {inverse: null}),
  headScreenshot: belongsTo('screenshot', {inverse: null}),
  baseScreenshot: belongsTo('screenshot', {inverse: null}),
  diffImage: belongsTo('image', {inverse: null}),
  browser: belongsTo('browser'),
});
