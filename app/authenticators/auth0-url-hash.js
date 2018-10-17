import Auth0UrlHash from 'ember-simple-auth-auth0/authenticators/auth0-url-hash';
import {inject as service} from '@ember/service';
import {reject} from 'rsvp';
import utils from 'percy-web/lib/utils';

export default Auth0UrlHash.extend({
  session: service(),
  flashMessages: service(),

  restore() {
    // Special case: if a user has third-party cookies disabled, restoring an expired session with
    // Silent Auth will fail and reject auth0's restore promise below. To make sure that backend
    // and frontend sessions stay in sync, we explicitly logout to prevent viewing a page in a mixed
    // state where the frontend ember-simple-auth session has expired but the API session has not.
    return this._super(...arguments).catch(() => {
      this.get('flashMessages').createPersistentFlashMessage(
        {
          type: 'danger',
          message:
            'You have been logged out. If this happens frequently, you may need to enable \
            third-party cookies.',
          sticky: true,
        },
        {persistentReloads: 2},
      );

      // replace the default code with duplicate code that adds query params for logging
      // this.get('session').invalidateAndLogout()
      this.invalidate().then(() => {
        this._clearThirdPartyUserContext();
        utils.replaceWindowLocation('/api/auth/logout?inconsistent-auth-state=true');
      });

      return reject();
    });
  },
});
