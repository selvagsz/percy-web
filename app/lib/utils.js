import $ from 'jquery';
import Ember from 'ember';
import config from '../config/environment';
import AdminMode from 'percy-web/lib/admin-mode';

export default {
  // Example Usage:
  //
  // buildApiUrl('identities');
  // buildApiUrl('userIdentity', 1);
  // buildApiUrl('userIdentity', 1, {includePercyMode: true});
  //
  // keys that can be used to build a URL are located in /config/environment.js
  buildApiUrl() {
    var key = arguments[0];
    var otherArgs = Array.prototype.slice.call(arguments, 1);

    // Options, if given, must be the last arg and must be a hash.
    var options = otherArgs.slice(-1)[0];
    if (typeof options === 'object') {
      otherArgs = otherArgs.slice(0, -1);
    } else {
      options = {};
    }
    var params = options.params || {};

    if (options['includePercyMode'] && this.percyMode()) {
      params['percy-mode'] = this.percyMode();
    }

    var queryParams = params ? '?' + $.param(params) : '';

    var path = config.APP.apiUrls[key];
    if (!path) {
      Ember.Logger.error('API path not found for key: ' + key);
      return;
    }

    // If the path requires formatting, make sure the right number of args have been given.
    var numFormatsRequired = (path.match(/%@/g) || []).length;
    if (numFormatsRequired !== otherArgs.length) {
      Ember.Logger.error(
        'Mismatched number of formatting args for: ' + path + '\nGot: ' + otherArgs,
      );
      return;
    } else {
      otherArgs.forEach(function(arg) {
        path = path.replace('%@', arg);
      });
    }

    return window.location.origin + path + queryParams;
  },

  percyMode() {
    if (AdminMode.isAdmin()) {
      return AdminMode.getAdminMode();
    }
  },

  setWindowLocation(url) {
    window.location.replace(url);
  },

  confirmMessage(message) {
    return confirm(message);
  },

  getQueryParam(param) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (pair[0] === param) {
        return pair[1];
      }
    }
    return false;
  },
};
