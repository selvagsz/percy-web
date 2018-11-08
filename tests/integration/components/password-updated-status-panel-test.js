import {it, describe, beforeEach} from 'mocha';
import {setupRenderingTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import {percySnapshot} from 'ember-percy';
import PasswordStatusPanel from 'percy-web/tests/pages/components/password-updated-status-panel';
import {getRootElement} from '@ember/test-helpers';

describe('Integration: PasswordUpdatedStatusPanel;', function() {
  setupRenderingTest('password-updated-status-panel', {
    integration: true,
  });

  beforeEach(function() {
    PasswordStatusPanel.setContext(this);
  });

  describe('when success is true', function() {
    it('renders success panel', async function() {
      this.set('success', 'true');
      await this.render(hbs`{{password-updated-status-panel
        success=success
      }}`);

      expect(PasswordStatusPanel.isSuccessIconPresent, 'success icon should be visible').to.equal(
        true,
      );
      expect(PasswordStatusPanel.isFailIconPresent, 'failure icon should not be visible').to.equal(
        false,
      );

      await percySnapshot(this.test.fullTitle(), getRootElement());
    });

    it('renders "Continue to Profile" button when user is logged in', async function() {
      this.set('success', 'true');
      this.set('currentUser', 'something is present');
      await this.render(hbs`{{password-updated-status-panel
        success=success
        currentUser=currentUser
      }}`);

      expect(PasswordStatusPanel.isSettingsButtonVisible).to.equal(true);
      expect(PasswordStatusPanel.isSigninButtonVisible).to.equal(false);

      await percySnapshot(this.test.fullTitle(), getRootElement());
    });

    it('renders "Sign in" button when user is not logged in', async function() {
      this.set('success', 'true');
      this.set('currentUser', null);
      await this.render(hbs`{{password-updated-status-panel
        success=success
        currentUser=currentUser
      }}`);

      expect(PasswordStatusPanel.isSigninButtonVisible).to.equal(true);
      expect(PasswordStatusPanel.isSettingsButtonVisible).to.equal(false);

      await percySnapshot(this.test.fullTitle(), getRootElement());
    });
  });
  describe('when success is false', function() {
    it('renders failure panel', async function() {
      this.set('success', 'false');
      await this.render(hbs`{{password-updated-status-panel success=success}}`);

      expect(
        PasswordStatusPanel.isSuccessIconPresent,
        'expect success icon to be visible',
      ).to.equal(false);
      expect(PasswordStatusPanel.isFailIconPresent, 'expect failure to not be visible').to.equal(
        true,
      );

      await percySnapshot(this.test.fullTitle(), getRootElement());
    });

    it('renders "Continue to Profile" button when user is logged in', async function() {
      this.set('success', 'false');
      this.set('currentUser', 'something is present');
      await this.render(hbs`{{password-updated-status-panel
        success=success
        currentUser=currentUser
      }}`);

      expect(PasswordStatusPanel.isSettingsButtonVisible).to.equal(true);
      expect(PasswordStatusPanel.isSigninButtonVisible).to.equal(false);

      await percySnapshot(this.test.fullTitle(), getRootElement());
    });

    it('renders "Sign in" button when user is not logged in', async function() {
      this.set('success', 'false');
      this.set('currentUser', null);
      await this.render(hbs`{{password-updated-status-panel
        success=success
        currentUser=currentUser
      }}`);

      expect(PasswordStatusPanel.isSigninButtonVisible).to.equal(true);
      expect(PasswordStatusPanel.isSettingsButtonVisible).to.equal(false);

      await percySnapshot(this.test.fullTitle(), getRootElement());
    });
  });
});
