/* global define:true */
(function() {
  function vendorModule() {
    'use strict';

    return {
      default: self['raven.js'],
      __esModule: true,
    };
  }

  define('raven.js', [], vendorModule);
})();
