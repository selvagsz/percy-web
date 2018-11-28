import Mirage from 'ember-cli-mirage';

export default function() {
  // Enable this to see verbose request logging from mirage:
  // this.logging = true;

  this.passthrough('http://api.amplitude.com');
  this.passthrough('https://api.lever.co/v0/postings/percy');

  this.passthrough('https://preview.contentful.com/spaces/:space_id/environments/test/entries');
  this.passthrough('https://preview.contentful.com/spaces/:space_id/environments/test/entries/**');

  this.get('/api/auth/session', function() {
    return {state: 'foo'};
  });

  this.get('/api/auth/logout', function(schema) {
    let user = schema.users.findBy({_currentLoginInTest: true});
    if (user) {
      user.update({_currentLoginInTest: false});
    }
    return new Mirage.Response(200, {}, {success: true});
  });

  this.namespace = '/api/v1';

  this.get('/user', function(schema) {
    let user = schema.users.findBy({_currentLoginInTest: true});
    if (user) {
      return user;
    } else {
      return _error401;
    }
  });

  this.patch('/user', function(schema) {
    let user = schema.users.findBy({_currentLoginInTest: true});
    let attrs = this.normalizedRequestAttrs();

    user.update({name: attrs.name, unverifiedEmail: attrs.email});
    return user;
  });

  this.get('/user/identities', function(schema) {
    let user = schema.users.findBy({_currentLoginInTest: true});
    if (!user) {
      return _error401;
    }
    return schema.identities.where({userId: user.id});
  });

  this.get('/user/identities/:id', function(schema, request) {
    return schema.identities.findBy({id: request.params.id});
  });

  this.post('/user/identities/:id/password-change-request', function() {
    return new Mirage.Response(204, {}, {success: true});
  });

  this.post('/user/identities', function(schema, request) {
    if (request.requestBody.match(/password%5D=passwordStrengthError!123$/)) {
      return _error400({statusDetail: 'PasswordStrengthError: Password is too weak'});
    } else if (request.requestBody.match(/password%5D=badRequestWithNoDetail!123$/)) {
      return _error400();
    } else {
      return new Mirage.Response(201, {}, {success: true});
    }
  });

  this.get('/user/organizations', function(schema) {
    let user = schema.users.findBy({_currentLoginInTest: true});
    if (!user) {
      return {errors: [{status: '403', title: 'unauthorized'}]};
    }
    let organizationUsers = schema.organizationUsers.where({userId: user.id});
    let organizationIds = organizationUsers.models.map(obj => obj.organizationId);
    return schema.organizations.find(organizationIds);
  });

  this.patch('/email-verifications/**', function(schema, request) {
    if (request.params['*'] === 'goodCode') {
      return new Mirage.Response(200, {}, {success: true});
    } else {
      return _error400({statusDetail: 'it did not work'});
    }
  });

  this.get('/organizations/:slug', function(schema, request) {
    const org = schema.organizations.findBy({slug: request.params.slug});
    return org ? org : _error401;
  });

  this.patch('/organizations/:slug', function(schema, request) {
    let attrs = this.normalizedRequestAttrs();
    if (!attrs.slug.match(/^[a-zA-Z][a-zA-Z_]*[a-zA-Z]$/)) {
      return _error400({
        pointer: '/data/attributes/slug',
        sourceDetail:
          'Slug must only contain letters, numbers, dashes, and cannot begin or end with a dash.',
      });
    }

    let organization = schema.organizations.findBy({slug: request.params.slug});
    organization.update(attrs);
    return organization;
  });

  this.post('/organizations', function(schema) {
    let attrs = this.normalizedRequestAttrs();
    let currentUser = schema.users.findBy({_currentLoginInTest: true});
    attrs.slug = attrs.name.underscore();
    let result = schema.organizations.create(attrs);
    schema.organizationUsers.create({
      userId: currentUser.id,
      organizationId: result.id,
    });
    return result;
  });

  this.post('/organizations/:id/projects', function(schema, request) {
    let attrs = this.normalizedRequestAttrs();
    schema.organizations.findBy({slug: request.params.slug});
    let project = schema.projects.create(attrs);
    return project;
  });

  this.patch('/organizations/:slug/subscription', function(schema, request) {
    let attrs = this.normalizedRequestAttrs();
    let organization = schema.organizations.findBy({slug: request.params.slug});
    let subscription = organization.subscription;

    // Mimic backend email validation.
    if (!attrs.billingEmail.match(/^[a-zA-Z0-9_]+@[a-zA-Z0-9_.]+$/)) {
      return _error400({
        pointer: '/data/attributes/billing-email',
        sourceDetail: 'Billing email is invalid',
      });
    }
    subscription.update(attrs);
    return subscription;
  });

  this.get('/organizations/:slug/organization-users', function(schema, request) {
    // TODO handle ?filter=current-user-only
    let organization = schema.organizations.findBy({slug: request.params.slug});
    return schema.organizationUsers.where({organizationId: organization.id});
  });

  this.get('/organizations/:slug/projects', function(schema, request) {
    let organization = schema.organizations.findBy({slug: request.params.slug});
    return schema.projects.where({organizationId: organization.id});
  });

  this.post('/organizations/:org_id/version-control-integrations/', function(schema, request) {
    if (request.requestBody.match(/"integration-type":"gitlab"/)) {
      let attrs = this.normalizedRequestAttrs();
      let newAttrs = Object.assign({}, attrs, {gitlabIntegrationId: 1234});
      let versionControlIntegration = schema.versionControlIntegrations.create(newAttrs);
      return versionControlIntegration;
    } else if (request.requestBody.match(/"integration-type":"gitlab_self_hosted"/)) {
      let attrs = this.normalizedRequestAttrs();
      let versionControlIntegration = schema.versionControlIntegrations.create(attrs);
      return versionControlIntegration;
    } else {
      return new Mirage.Response(422, {}, {});
    }
  });

  this.patch('/version-control-integrations/:id', function(schema, request) {
    if (request.requestBody.match(/"integration-type":"gitlab"/)) {
      let attrs = this.normalizedRequestAttrs();
      let newAttrs = Object.assign({}, attrs, {
        gitlabIntegrationId: 1234,
        isGitlabPersonalAccessTokenPresent: true,
      });
      let versionControlIntegration = schema.versionControlIntegrations.findBy({
        id: request.params.id,
      });
      versionControlIntegration.update(newAttrs);
      return versionControlIntegration;
    } else if (request.requestBody.match(/"integration-type":"gitlab_self_hosted"/)) {
      let attrs = this.normalizedRequestAttrs();
      let newAttrs = Object.assign({}, attrs, {
        gitlabHost: attrs['gitlabHost'],
        isGitlabPersonalAccessTokenPresent: true,
      });
      let versionControlIntegration = schema.versionControlIntegrations.findBy({
        id: request.params.id,
      });
      versionControlIntegration.update(newAttrs);
      return versionControlIntegration;
    } else {
      return new Mirage.Response(422, {}, {});
    }
  });

  this.delete('/version-control-integrations/:id', function() {
    return new Mirage.Response(204, {}, {});
  });

  this.get('/projects/:full_slug/', function(schema, request) {
    const fullSlug = decodeURIComponent(request.params.full_slug);
    const project = schema.projects.findBy({fullSlug: fullSlug});
    return project ? project : _error401;
  });

  this.get('/projects/:organization_slug/:project_slug/tokens', function(schema, request) {
    let fullSlug = `${request.params.organization_slug}/${request.params.project_slug}`;
    let project = schema.projects.findBy({fullSlug: fullSlug});
    return schema.tokens.where({projectId: project.id});
  });

  this.get('/projects/:organization_slug/:project_slug/builds', function(schema, request) {
    let limitString = request.queryParams['page[limit]'] || '50';
    let limit = parseInt(limitString);

    let fullSlug = `${request.params.organization_slug}/${request.params.project_slug}`;
    let project = schema.projects.findBy({fullSlug: fullSlug});

    let projectBuilds = schema.builds.where({projectId: project.id});
    let limitedProjectBuilds = projectBuilds.slice(0, limit);

    return limitedProjectBuilds;
  });

  this.get('/invites/:id');

  this.patch('/invites/:id', function(schema, request) {
    let invite = schema.invites.find(request.params.id);
    let attrs = this.normalizedRequestAttrs();
    invite.update(attrs);

    const currentUser = schema.users.findBy({_currentLoginInTest: true});
    schema.organizationUsers.create({userId: currentUser.id, organizationId: attrs.organizationId});

    return invite;
  });

  this.get('/organizations/:organization_slug/invites');

  this.get('/builds/:build_id/snapshots', function(schema, request) {
    const build = schema.builds.findBy({id: request.params.build_id});
    const queryParams = request.queryParams;
    if (queryParams['filter[review-state-reason]']) {
      const reasons = queryParams['filter[review-state-reason]'].split(',');
      return schema.snapshots.where(snapshot => {
        return snapshot.buildId === build.id && reasons.includes(snapshot.reviewStateReason);
      });
    } else {
      return schema.snapshots.where({buildId: build.id});
    }
  });

  this.get('/browser-families', function(schema) {
    schema.browserFamilies.create({
      id: '1',
      slug: 'firefox',
      name: 'Firefox',
    });
    schema.browserFamilies.create({
      id: '2',
      slug: 'chrome',
      name: 'Chrome',
    });

    return schema.browserFamilies.find(['1', '2']);
  });

  this.get('/snapshots/:id');
  this.get('/builds/:id');
  this.get('/builds/:build_id/comparisons');
  this.get('/repos/:id');
  this.post('/reviews');
}

const _error401 = new Mirage.Response(
  401,
  {},
  {
    errors: [
      {
        status: 'unauthorized',
        detail: 'Authentication required.',
      },
    ],
  },
);

function _error400({statusDetail = '', pointer = ' ', sourceDetail = ''} = {}) {
  const errorsStatus = {status: 'bad_request'};
  const errorsSource = {};
  if (status) {
    errorsStatus.status = status;
  }
  if (statusDetail) {
    errorsStatus.detail = statusDetail;
  }
  if (pointer) {
    errorsStatus.source = {pointer};
  }
  if (sourceDetail) {
    errorsStatus.detail = sourceDetail;
  }

  return new Mirage.Response(
    400,
    {},
    {
      errors: [errorsStatus, errorsSource],
    },
  );
}
