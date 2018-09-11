import Contentful from 'ember-data-contentful/models/contentful';
import attr from 'ember-data/attr';
import DS from 'ember-data';
import {equal, and, notEmpty, readOnly} from '@ember/object/computed';

export default Contentful.extend({
  contentType: 'contentBlock',

  page: attr(),
  order: attr(),
  mainImage: DS.belongsTo('contentful-asset'), // model here: https://bit.ly/2MoN7fD
  imagePosition: attr(),
  superheader: attr(),
  header: attr(),
  subheader: attr(),
  bodyText: attr(),
  bodyImages: attr(),
  supportingTextSections: DS.hasMany('supporting-content'),
  callToActionText: attr(),
  callToActionLink: attr(),

  imageUrl: readOnly('mainImage.file.url'),
  imageDescription: readOnly('mainImage.description'),
  isImagePresent: notEmpty('imageUrl'),

  isImageCentered: equal('imagePosition', 'Center'),
  isImageLeftAligned: equal('imagePosition', 'Left'),
  isImageRightAligned: equal('imagePosition', 'Right'),

  isRightAlignedImagePresent: and('isImagePresent', 'isImageRightAligned'),
  isLeftAlignedImagePresent: and('isImagePresent', 'isImageLeftAligned'),
  isCenterAlignedImagePresent: and('isImagePresent', 'isImageCentered'),

  isFullCTAPresent: and('callToActionText', 'callToActionLink'),
});
