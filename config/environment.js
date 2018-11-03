/* eslint-env node */

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'percy-web',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },
    pageTitle: {
      separator: ' - ',
      prepend: true,
    },

    flashMessageDefaults: {
      timeout: 10000,
      extendedTimeout: 500,
      preventDuplicates: true,
    },

    launchDarkly: {
      clientSideId: '5b453a435b18c32c7440a5bd',
      local: true,
      localFeatureFlags: {
        webhooks: true,
        'public-project-switch': true,
      },
    },

    APP: {
      // Don't use these directly; use utils.buildApiUrl instead.
      apiUrls: {
        logout: '/api/auth/logout',

        builds: '/api/v1/builds',
        githubIntegrationRequest: '/api/v1/organizations/%@/github-integration-request',
        passwordChangeRequest: '/api/v1/user/identities/%@/password-change-request',
        identities: '/api/v1/user/identities',
        projectsCollection: '/api/v1/organizations/%@/projects',
        projectBuilds: '/api/v1/projects/%@/builds',
        organizationUsers: '/api/v1/organizations/%@/organization-users',
        organizationVersionControlIntegrations:
          '/api/v1/organizations/%@/version-control-integrations',
        subscription: '/api/v1/organizations/%@/subscription',
        invites: '/api/v1/organizations/%@/invites',
        user: '/api/v1/user',
        userIdentity: '/api/v1/user/identities/%@',
        userOrganizations: '/api/v1/user/organizations',
        emailVerifications: '/api/v1/email-verifications/%@',
        baseAsset: '/api/v1/snapshots/%@/assets/base.html',
        headAsset: '/api/v1/snapshots/%@/assets/head.html',
        buildSnapshots: '/api/v1/builds/%@/snapshots',
        snapshotSourceDiff: '/api/v1/comparisons/%@/diffs/source.diff',
      },
      githubUrls: {
        integration: 'https://github.com/apps/percy/installations/new',
      },
    },

    'ember-simple-auth': {
      auth0: {
        logoutReturnToURL: '/',
        silentAuth: {
          // Automatically renew token every 30 minutes:
          renewSeconds: 1800,

          // Automatically renew token when trying to restore an expired session (on app load):
          onSessionRestore: true,

          // Automatically renew token when token expiration time is hit (during app use):
          onSessionExpire: true,

          // Options to pass to checkSession when doing automatic silent auth.
          options: {
            redirectPath: '/api/auth/auth0/callback',
            responseType: 'token id_token',
            // scope: 'openid profile email',
            timeout: 5000,
          },
        },
      },
    },
  };

  ENV.stripe = {
    publishableKey: 'pk_test_N5PmOTEMBIbsZMjbxnaWthNy',
    lazyLoad: true,
  };
  ENV.APP.INTERCOM_APP_ID = 'itdwmqct';
  ENV.APP.GOOGLE_ANALYTICS_ID = 'UA-63384548-3';
  ENV.contentful = {
    space: 'k62me4xboi1l',
    accessToken: '0965344a7250891b26c8f458a57060b5dcf28b145a240db9cfb2df9f61cf3acb',
    previewAccessToken: '21021245f13ddfac6efe72acab3e5fa52b929f1d4c03f4b95f6ace3bacbde87e',
    usePreviewApi: false,
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    if (process.env.PERCY_DEV_MIRAGE === 'yes') {
      ENV['ember-cli-mirage'] = {
        enabled: true,
        discoverEmberDataModels: true,
      };
    }
    ENV.APP.githubUrls = {
      integration: 'https://github.com/apps/percy-dev/installations/new',
    };

    ENV.APP.percyWebApiHost = process.env.PERCY_WEB_API_HOST;
    ENV.APP.percyWebAuthToken = process.env.PERCY_WEB_AUTH_TOKEN;

    ENV.APP.AMPLITUDE_USERS_INSTANCE_NAME = 'Users';
    ENV.APP.AMPLITUDE_USERS_PROJECT_ID = '5a8c0499760103fcd2754fe7d5756214';
    ENV.APP.AMPLITUDE_ORGANIZATIONS_INSTANCE_NAME = 'Organizations';
    ENV.APP.AMPLITUDE_ORGANIZATIONS_PROJECT_ID = '89f8fae9aab3fccc0740237f17e43745';
    ENV.APP.SEGMENT_WRITE_KEY = 'ypNsNdxRnWaHy0WsIbOa8koEZxBRTvA5';

    ENV.sentry = {
      dsn: 'https://9745b9952dd74a14bf9ff4fd2cf154a3@sentry.io/1216596',
      development: true,
    };

    ENV['ember-simple-auth'].auth0.clientID = '1W3CbZu2iYnvJsilsVV2QG3DCTAcUpp3';
    ENV['ember-simple-auth'].auth0.domain = 'login-dev.percy.io';

    ENV.contentful.usePreviewApi = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    // TODO: false is the default, but ember-mocha compatibility currently requires
    // this to be true.
    ENV.APP.autoboot = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV['ember-tether'] = {bodyElementId: 'ember-testing'};

    ENV.percy = {
      defaultWidths: [375, 1280],
    };
    ENV['ember-simple-auth'].auth0.clientID = 'foo';
    ENV['ember-simple-auth'].auth0.domain = 'percy-io-test.auth0.com';

    ENV.sentry = {
      dsn: 'https://1234567890@sentry.io/123456789',
      development: true,
    };

    ENV.contentful = {
      // There's no way to specify the environment currently in ember-contentful,
      // so to hit the test environment compose the correct API url here.
      space: 'k62me4xboi1l/environments/test',
      accessToken: '483582fe6383c4a834784cf70006eeaf0cb0d0ec44bb37d6f5250182c9cd77b8',
      previewAccessToken: '54994b3af44e1943a0ce65bd5557bf5699f180efe3443d286630faf8318570d9',
      usePreviewApi: true,
    };

    ENV.moment = {
      allowEmpty: true,
    };
  }

  if (environment === 'production') {
    ENV.stripe.publishableKey = 'pk_live_cmaeNcmPuMihdT3Q7QDBDMDr';
    ENV.APP.INTERCOM_APP_ID = 'm37fs4zj';
    ENV.APP.GOOGLE_ANALYTICS_ID = 'UA-63384548-1';

    ENV.APP.AMPLITUDE_USERS_INSTANCE_NAME = 'Users';
    ENV.APP.AMPLITUDE_USERS_PROJECT_ID = 'bdf4d18bc5e905549e63455b54ab40f2';
    ENV.APP.AMPLITUDE_ORGANIZATIONS_INSTANCE_NAME = 'Organizations';
    ENV.APP.AMPLITUDE_ORGANIZATIONS_PROJECT_ID = '43ed24c6891251bbbdddc310a5371afd';
    ENV.APP.SEGMENT_WRITE_KEY = 'E4wLYeCSYiNWdIGEbLPwMHkQataZAe4j';

    ENV.sentry = {
      dsn: 'https://4c28a8c59c934d729d261b988d6187c3@sentry.io/235025',
      development: false,
    };

    ENV['ember-simple-auth'].auth0.clientID = '9oRqSsl0iEbVK4Zh5AGHeC7pu3ACmnN3';
    ENV['ember-simple-auth'].auth0.domain = 'login.percy.io';

    if (process.env.VERSION) {
      ENV.APP.VERSION = process.env.VERSION;
    }
  }

  return ENV;
};
