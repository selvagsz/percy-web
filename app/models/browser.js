import DS from 'ember-data';
import {alias} from '@ember/object/computed';

export default DS.Model.extend({
  browserFamily: DS.belongsTo('browserFamily', {async: false, inverse: null}),
  familyName: alias('browserFamily.name'),
  familySlug: alias('browserFamily.slug'),
  version: DS.attr(),
});
