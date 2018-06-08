import setupAcceptance, {
  setupSession,
  renderAdapterErrorsAsPage,
} from '../helpers/setup-acceptance';
import freezeMoment from '../helpers/freeze-moment';

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
      await click('.FormsOrganizationNew input[type=submit]');
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
      await click('.FormsBillingEdit input[type=submit]');
      expect(
        find('.FormsBillingEdit .FormFieldsSubmit .SavingIndicator i.fa-check-circle').length,
      ).to.equal(1);
      expect(server.schema.subscriptions.first().billingEmail).to.equal('a_valid_email@gmail.com');

      await percySnapshot(this.test.fullTitle() + ' | ok modification');
      await renderAdapterErrorsAsPage(async () => {
        await fillIn(
          '.FormsBillingEdit span:contains("Billing email") + input',
          'an invalid email@gmail.com',
        );
        await click('.FormsBillingEdit input[type=submit]');
        expect(
          find('.FormsBillingEdit .FormFieldsSubmit .SavingIndicator i.fa-check-circle').length,
        ).to.equal(0);
        expect(
          find('.FormsBillingEdit .FormFieldsSubmit .SavingIndicator i.fa-times-circle').length,
        ).to.equal(1);
        expect(find('.FormsBillingEdit .FormFieldsInput ul.Form-errors li').text()).to.equal(
          'Billing email is invalid',
        );
        expect(server.schema.subscriptions.first().billingEmail).to.equal(
          'a_valid_email@gmail.com',
        );
        return percySnapshot(this.test.fullTitle() + ' | invalid modification');
      });
    });

    it('can select pricing', async function() {
      await visit('/login');
      await visit('/pricing');
      expect(currentPath()).to.equal('pricing');

      await percySnapshot(this.test);
      await click('a:contains("Jump to organization for billing")');
      expect(currentPath()).to.equal('pricing');

      await percySnapshot(this.test.fullTitle() + '| select organization');
    });

    describe('organization is on trial account', function() {
      setupSession(function(server) {
        this.organization = server.create('organization', 'withAdminUser', 'withTrial');
      });

      it('can view billing page', async function() {
        await visit(`/organizations/${this.organization.slug}/billing`);
        expect(currentPath()).to.equal('organizations.organization.billing');

        await percySnapshot(this.test);
      });
    });
  });
});
