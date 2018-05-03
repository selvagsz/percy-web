import FactoryGuy from 'ember-data-factory-guy';
import moment from 'moment';

export const TEST_COMPARISON_WIDTHS = [375, 550, 1024];

FactoryGuy.define('comparison', {
  default: {
    startedProcessingAt: () => moment().subtract(65, 'seconds'),
    finishedProcessingAt: () => moment().subtract(23, 'seconds'),
    diffRatio: 0.23,
    browser: () => {
      return FactoryGuy.make('browser');
    },

    headScreenshot: f => {
      // TODO: make the screenshot and image a real FactoryGuy model instead of POJO
      return {
        id: f.id,
        image: {id: f.id, url: '/images/test/v2.png', width: 375, height: 500},
        lossyImage: {id: f.id, url: '/images/test/v2-lossy.png', width: 375, height: 500},
      };
    },
    baseScreenshot: f => {
      // TODO: make the screenshot and image a real FactoryGuy model instead of POJO
      return {
        id: f.id,
        image: {id: f.id, url: '/images/test/v1.png', width: 375, height: 500},
        lossyImage: {id: f.id, url: '/images/test/v1-lossy.png', width: 375, height: 500},
      };
    },
    diffImage: f => {
      // TODO: make the screenshot and image a real FactoryGuy model instead of POJO
      return {id: f.id, image: {id: f.id, url: '/images/test/diff.png', width: 375, height: 500}};
    },
  },

  traits: {
    new: {
      baseScreenshot: null,
    },
  },
});
