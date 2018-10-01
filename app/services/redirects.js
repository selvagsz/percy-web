import Service, {inject as service} from '@ember/service';
import localStorageProxy from 'percy-web/lib/localstorage';
import {readOnly} from '@ember/object/computed';

export default Service.extend({
  session: service(),
  currentUser: readOnly('session.currentUser'),
  router: service(),

  // This method is tested via most-recent-org-test and default-org-test
  redirectToDefaultOrganization({useMostRecentOrg = true} = {}) {
    const currentUser = this.get('currentUser');
    const router = this.get('router');
    if (!currentUser) {
      return router.replaceWith('/login');
    }

    let lastOrganizationSlug = localStorageProxy.get('lastOrganizationSlug');
    if (lastOrganizationSlug && useMostRecentOrg) {
      return router.replaceWith('organization.index', lastOrganizationSlug);
    } else {
      currentUser.get('organizations').then(orgs => {
        let org = orgs.get('firstObject');
        if (org) {
          return router.replaceWith('organization.index', org.get('slug'));
        } else {
          // User has no organizations.
          return router.replaceWith('organizations.new');
        }
      });
    }
  },
});
