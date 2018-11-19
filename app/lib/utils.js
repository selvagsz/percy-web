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

  /**
   * Add to the current window location with the URL passed. This
   * will add to the browser history.
   *
   * @param {string} url
   */
  setWindowLocation(url) {
    window.location = url;
  },

  /**
   * Replace the current window location with the URL passed. This
   * will not add to the browser history.
   *
   * @param {string} url
   */
  replaceWindowLocation(url) {
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

  generateRandomToken(length = 32) {
    let arr = new Uint8Array(length);

    window.crypto.getRandomValues(arr);

    return Array.from(arr, function(dec) {
      return Math.floor(dec / 16).toString(16);
    }).join('');
  },

  /**
   * Sort the builds for a project and make sure we only show the user
   * build numbers that are continuous. Finding all the builds in the store
   * sometimes includes random builds that have been returned from the api
   * via the 'included' payload. We don't want to show these non-continuous
   * builds to the user when they are looking at an ordered list of all
   * their builds.
   */
  sortAndCleanBuilds(builds) {
    // sort the builds in decending order
    const sortedBuilds = builds.sortBy('buildNumber').reverse();

    // make sure all the buildNumbers are continuous
    let continuousBuilds = [];
    for (let i = 0; i < sortedBuilds.length; i++) {
      if (i === 0) {
        continuousBuilds.push(sortedBuilds[i]);
      } else if (this._isNextBuildNumberOneLess(sortedBuilds, i)) {
        continuousBuilds.push(sortedBuilds[i]);
      } else {
        break;
      }
    }

    return continuousBuilds;
  },

  _isNextBuildNumberOneLess(sortedBuilds, i) {
    const currentBuildNumber = sortedBuilds[i].get('buildNumber');
    const previousBuildNumber = sortedBuilds[i - 1].get('buildNumber');
    return previousBuildNumber - currentBuildNumber === 1;
  },
};
