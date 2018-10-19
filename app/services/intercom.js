import Service from '@ember/service';
import AdminMode from 'percy-web/lib/admin-mode';

export default Service.extend({
  associateWithCompany(user, organization) {
    if (AdminMode.excludeFromAnalytics()) {
      return;
    }

    if (window.Intercom && user && user.get('id')) {
      window.Intercom('update', {
        user_id: user.get('id'),
        user_hash: user.get('userHash'),
        company: {
          id: organization.get('id'),
          name: organization.get('name'),
        },
      });
    }
  },

  showIntercom(...args) {
    if (window.Intercom) {
      if (args.length) {
        window.Intercom(...args);
      } else {
        window.Intercom('show');
      }
    }
  },
});
