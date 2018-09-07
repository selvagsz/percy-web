import setupAcceptance, {
  setupSession,
  renderAdapterErrorsAsPage,
} from '../helpers/setup-acceptance';
import freezeMoment from '../helpers/freeze-moment';
import AdminMode from 'percy-web/lib/admin-mode';
import {beforeEach, afterEach} from 'mocha';
import moment from 'moment';

describe('Acceptance: Organization', function() {
  setupAcceptance();
  freezeMoment('2020-01-30');

  describe('user is member', function() {
    setupSession(function(server) {
      let organization = server.create('organization', 'withUser');
      let project = server.create('project', {organization});
      this.organization = organization;
      this.project = project;
    });

    it('denies billing settings', async function() {
      await visit(`/${this.organization.slug}`);
      expect(currentPath()).to.equal('organization.project.index');

      await click('[data-test-settings-icon]');
      expect(currentPath()).to.equal('organization.project.settings');

      await click('[data-test-sidenav] a:contains("Billing")');
      expect(currentPath()).to.equal('organizations.organization.billing');

      await percySnapshot(this.test);
    });

    it('can create new organization', async function() {
      await visit(`/${this.organization.slug}`);
      await click('.OrganizationsSwitcherNav-item');
      await click('a:contains("Create new organization")');
      expect(currentPath()).to.equal('organizations.new');

      await percySnapshot(this.test.fullTitle() + ' | new');
      await fillIn('.FormsOrganizationNew input[type=text]', 'New organization');
      await click('.FormsOrganizationNew [data-test-form-submit-button]');
      expect(currentPath()).to.equal('organization.index');

      await percySnapshot(this.test.fullTitle() + ' | setup');
    });
  });

  describe('user is admin', function() {
    setupSession(function(server) {
      this.organization = server.create('organization', 'withAdminUser');
    });

    it('can edit organization settings', async function() {
      await visit(`/${this.organization.slug}`);
      expect(currentPath()).to.equal('organization.index');

      await click('[data-test-settings-link]:contains("Settings")');
      expect(currentPath()).to.equal('organizations.organization.settings');

      await percySnapshot(this.test);
      await renderAdapterErrorsAsPage(async () => {
        await fillIn('.FormsOrganizationEdit span:contains("Slug") + input', 'invalid/slug');
        await click('.FormsOrganizationEdit input[type=submit]');
        return percySnapshot(this.test.fullTitle() + ' | Error when invalid slug');
      });

      await click('[data-test-sidenav] a:contains("Users")');
      expect(currentPath()).to.equal('organizations.organization.users.index');
      await percySnapshot(this.test.fullTitle() + ' | Users settings');
      await click('[data-test-user-card]');
      expect(currentPath()).to.equal('organizations.organization.users.index');

      await percySnapshot(this.test.fullTitle() + ' | Users settings expanded');
      await click('[data-test-sidenav] a:contains("Billing")');
      expect(currentPath()).to.equal('organizations.organization.billing');

      await percySnapshot(this.test.fullTitle() + ' | Billing settings');
    });

    it('can update billing email', async function() {
      await visit(`/organizations/${this.organization.slug}/billing`);
      expect(currentPath()).to.equal('organizations.organization.billing');

      await percySnapshot(this.test);
      await fillIn(
        '.FormsBillingEdit span:contains("Billing email") + input',
        'a_valid_email@gmail.com',
      );
      await click('.FormsBillingEdit [data-test-form-submit-button]');
      expect(server.schema.subscriptions.first().billingEmail).to.equal('a_valid_email@gmail.com');

      await percySnapshot(this.test.fullTitle() + ' | ok modification');
      await renderAdapterErrorsAsPage(async () => {
        await fillIn(
          '.FormsBillingEdit span:contains("Billing email") + input',
          'an invalid email@gmail.com',
        );
        await click('.FormsBillingEdit [data-test-form-submit-button]');
        expect(find('.FormsBillingEdit .FormFieldsInput ul.Form-errors li').text()).to.equal(
          'Billing email is invalid',
        );
        expect(server.schema.subscriptions.first().billingEmail).to.equal(
          'a_valid_email@gmail.com',
        );
        return percySnapshot(this.test.fullTitle() + ' | invalid modification');
      });
    });

    it('displays users page', async function() {
      const users = server.createList('user', 5);
      users.map(user => {
        return server.create('organizationUser', {user, organization: this.organization});
      });

      await visit(`/organizations/${this.organization.slug}/users`);
      await percySnapshot(this.test.fullTitle());
    });

    describe('organization is on trial plan', function() {
      setupSession(function(server) {
        server.create('subscription', 'withTrialPlan', {
          organization: this.organization,
          trialStart: moment(),
          trialEnd: moment()
            .add(14, 'days')
            .add(1, 'hour'),
        });
      });

      it('can view billing page', async function() {
        await visit(`/organizations/${this.organization.slug}/billing`);
        expect(currentPath()).to.equal('organizations.organization.billing');
        await percySnapshot(this.test);
      });
    });

    describe('organization is on trial expired plan', function() {
      setupSession(function(server) {
        server.create('subscription', {organization: this.organization});
      });

      it('can view billing page', async function() {
        await visit(`/organizations/${this.organization.slug}/billing`);
        expect(currentPath()).to.equal('organizations.organization.billing');
        await percySnapshot(this.test);
      });
    });

    describe('organization is on a standard plan', function() {
      setupSession(function(server) {
        server.create('subscription', 'withStandardPlan', {organization: this.organization});
      });

      it('can view billing page', async function() {
        await visit(`/organizations/${this.organization.slug}/billing`);
        expect(currentPath()).to.equal('organizations.organization.billing');
        await percySnapshot(this.test);
      });
    });

    describe('organization is on custom plan', function() {
      setupSession(function(server) {
        server.create('subscription', 'withCustomPlan', {organization: this.organization});
      });

      it('can view billing page', async function() {
        await visit(`/organizations/${this.organization.slug}/billing`);
        expect(currentPath()).to.equal('organizations.organization.billing');
        await percySnapshot(this.test);
      });
    });
  });

  describe('user is not member of organization but is in admin-mode', function() {
    let organization;
    setupSession(function(server) {
      organization = server.create('organization');
      server.create('project', {organization});
      server.create('user');
    });

    beforeEach(() => {
      AdminMode.setAdminMode();
    });

    afterEach(() => {
      AdminMode.clear();
    });

    it('shows billing page with warning message', async function() {
      await visit(`/organizations/${organization.slug}/billing`);
      expect(currentPath()).to.equal('organizations.organization.billing');
      await percySnapshot(this.test.fullTitle() + ' | setup');
    });
  });
});
