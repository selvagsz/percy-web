import {it, describe, beforeEach} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import {make} from 'ember-data-factory-guy';
import StripeMock from 'ember-stripe-elements/utils/stripe-mock';
import BillingCardUpdater from 'percy-web/tests/pages/components/organizations/billing-card-updater'; // eslint-disable-line

describe('Integration: BillingCardUpdater', function() {
  setupComponentTest('organizations/billing-card-updater', {
    integration: true,
  });

  let organization;
  beforeEach(function() {
    window.Stripe = StripeMock;
    setupFactoryGuy(this.container);
    BillingCardUpdater.setContext(this);
    organization = make('organization');
    this.setProperties({organization});
  });

  it('shows credit card form', async function() {
    this.render(hbs`{{
      organizations/billing-card-updater
      organization=organization
    }}`);
    await BillingCardUpdater.clickUpdateCard();

    expect(BillingCardUpdater.isStripeCardComponentVisible).to.equal(true);
  });

  it('disables "Update Credit Card" button when card is not complete', async function() {
    this.render(hbs`{{
      organizations/billing-card-updater
      organization=organization
      _isCardComplete=false
    }}`);
    await BillingCardUpdater.clickUpdateCard();

    expect(BillingCardUpdater.isSubmitCardButtonDisabled).to.equal(true);
  });

  it('enables "Update Credit Card" button when card is complete', async function() {
    this.render(hbs`{{
      organizations/billing-card-updater
      organization=organization
      _isCardComplete=true
    }}`);
    await BillingCardUpdater.clickUpdateCard();

    expect(BillingCardUpdater.isSubmitCardButtonDisabled).to.equal(false);
  });
});
