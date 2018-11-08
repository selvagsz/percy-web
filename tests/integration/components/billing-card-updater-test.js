import {it, describe, beforeEach} from 'mocha';
import {setupRenderingTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import {make} from 'ember-data-factory-guy';
import BillingCardUpdater from 'percy-web/tests/pages/components/organizations/billing-card-updater'; // eslint-disable-line
import mockStripeService from 'percy-web/tests/helpers/mock-stripe-service';

describe('Integration: BillingCardUpdater', function() {
  setupRenderingTest('organizations/billing-card-updater', {
    integration: true,
  });

  let organization;
  beforeEach(function() {
    setupFactoryGuy(this);
    mockStripeService(this);
    BillingCardUpdater.setContext(this);
    organization = make('organization');
    this.setProperties({organization});
  });

  it('shows credit card form', async function() {
    await this.render(hbs`{{
      organizations/billing-card-updater
      organization=organization
    }}`);
    await BillingCardUpdater.clickUpdateCard();

    expect(BillingCardUpdater.isStripeCardComponentVisible).to.equal(true);
  });

  it('disables "Update Credit Card" button when card is not complete', async function() {
    await this.render(hbs`{{
      organizations/billing-card-updater
      organization=organization
      _isCardComplete=false
    }}`);
    await BillingCardUpdater.clickUpdateCard();

    expect(BillingCardUpdater.isSubmitCardButtonDisabled).to.equal(true);
  });

  it('enables "Update Credit Card" button when card is complete', async function() {
    await this.render(hbs`{{
      organizations/billing-card-updater
      organization=organization
      _isCardComplete=true
    }}`);
    await BillingCardUpdater.clickUpdateCard();

    expect(BillingCardUpdater.isSubmitCardButtonDisabled).to.equal(false);
  });
});
