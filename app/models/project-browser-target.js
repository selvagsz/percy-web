import DS from 'ember-data';

// This model is for the join table present in the API. It is an object that represents the
// many to many relationship between project and browser_target. Ember would normally handle
// many to many relationships for us, but we need to trigger updates to this relatioship from FE,
// so we're mimicking the structure of the API join table here.
export default DS.Model.extend({
  browserTarget: DS.belongsTo('browserTarget', {async: false}),
  project: DS.belongsTo('project', {async: false}),
  // browserFamily relationship does not exist in the API and is therefore not populated,
  // but is used for creating new project-browser-target objects for a browser family.
  browserFamily: DS.belongsTo('browserFamily', {async: false, inverse: null}),
});
