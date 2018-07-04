import Route from '@ember/routing/route';
import $ from 'jquery';
import utils from 'percy-web/lib/utils';

export default Route.extend({
  queryParams: {
    code: '',
  },
  model(params) {
    return $.ajax({
      type: 'PATCH',
      url: utils.buildApiUrl('emailVerifications', params.code),
    })
      .then(() => {
        return {success: true};
      })
      .catch(e => {
        try {
          return e.responseJSON.errors[0].detail;
        } catch (_) {
          // no-op
        }
      });
  },
});
