import DS from 'ember-data';

export default DS.Model.extend({
  externalRepoId: DS.attr('number'),
  name: DS.attr(),
  slug: DS.attr(),
  hostname: DS.attr(),
  source: DS.attr(),
  htmlUrl: DS.attr(),
  isPrivate: DS.attr('boolean'),
  description: DS.attr(),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
});
