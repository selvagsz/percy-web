import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';

export default Route.extend({
  redirects: service(),
  session: service(),
  beforeModel() {
    if (this.get('session.isAuthenticated')) {
      return this.get('redirects').redirectToDefaultOrganization();
    } else {
      return this._super(...arguments);
    }
  },
});
