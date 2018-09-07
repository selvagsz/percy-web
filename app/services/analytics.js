import {alias} from '@ember/object/computed';
import Service, {inject as service} from '@ember/service';
import config from '../config/environment';
import AdminMode from 'percy-web/lib/admin-mode';

export default Service.extend({
  session: service(),
  currentUser: alias('session.currentUser'),

  userInstance: null,
  organizationInstance: null,

  init() {
    if (!this.isEnabled()) {
      return;
    }

    let amplitudeConfigurationOptions = {
      includeUtm: true,
      includeReferrer: true,
      includeGclid: true,
    };

    this.userInstance = window.amplitude.getInstance(config.APP.AMPLITUDE_USERS_INSTANCE_NAME);
    this.userInstance.init(
      config.APP.AMPLITUDE_USERS_PROJECT_ID,
      null,
      amplitudeConfigurationOptions,
    );

    this.organizationInstance = window.amplitude.getInstance(
      config.APP.AMPLITUDE_ORGANIZATIONS_INSTANCE_NAME,
    );
    this.organizationInstance.init(
      config.APP.AMPLITUDE_ORGANIZATIONS_PROJECT_ID,
      null,
      amplitudeConfigurationOptions,
    );

    window.analytics.load(config.APP.SEGMENT_WRITE_KEY);
  },

  isEnabled() {
    return window.amplitude && !AdminMode.excludeFromAnalytics();
  },

  invalidate() {
    if (!this.isEnabled()) {
      return;
    }

    this.userInstance.setUserId(null);
    this.userInstance.regenerateDeviceId();

    this.organizationInstance.setUserId(null);
    this.organizationInstance.regenerateDeviceId();

    window.analytics.reset();
  },

  identifyUser(user) {
    if (!this.isEnabled()) {
      return;
    }

    let userProperties = {
      email: user.get('email'),
      name: user.get('name'),
    };

    this.userInstance.setUserId(user.get('id'));
    this.userInstance.setUserProperties(userProperties);

    window.analytics.identify(user.get('id'), userProperties);
  },

  track(eventName, organization, eventProperties = {}) {
    // window.console.log('Analytics track called:', eventName, organization, eventProperties);

    if (!this.isEnabled()) {
      return;
    }

    let userEventProperties = eventProperties;
    let groups = {};
    if (organization) {
      userEventProperties = Object.assign(
        {
          organization_id: organization.get('id'),
          organization_slug: organization.get('slug'),
        },
        eventProperties,
      );

      groups['organization_id'] = organization.get('id');
    }

    this.userInstance.logEventWithGroups(eventName, userEventProperties, groups);

    if (organization) {
      this.organizationInstance.setUserId(organization.get('id'));
      let organizationEventProperties = Object.assign(
        {user_id: this.get('currentUser.id')},
        eventProperties,
      );
      this.organizationInstance.logEvent(eventName, organizationEventProperties);
    }

    if (organization) {
      window.analytics.group(organization.get('id'), {
        name: organization.get('name'),
        slug: organization.get('slug'),
      });
    }

    window.analytics.track(eventName, userEventProperties);
  },
});
