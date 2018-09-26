import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';

export default Route.extend({
  session: service(),
  beforeModel(transition) {
    if (this.get('session.isAuthenticated')) {
      return transition.send('redirectToDefaultOrganization');
    } else {
      return this._super(...arguments);
    }
  },
});
