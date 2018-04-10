import DS from 'ember-data';

export default DS.Model.extend({
  build: DS.belongsTo('build'),
  snapshots: DS.hasMany('snapshot'),
  action: DS.attr(),
});
