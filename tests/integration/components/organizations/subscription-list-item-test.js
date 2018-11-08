import {it, describe, beforeEach} from 'mocha';
import {setupRenderingTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import {make} from 'ember-data-factory-guy';
import SubscriptionListItem from 'percy-web/tests/pages/components/organizations/subscription-list-item'; // eslint-disable-line
import sinon from 'sinon';
import stubServiceIntegration from 'percy-web/tests/helpers/stub-service-integration';
import mockStripeService from 'percy-web/tests/helpers/mock-stripe-service';

// Stripe is breaking this
describe('Integration: SubscriptionListItem', function() {
  setupRenderingTest('organizations/subscription-list-item', {
    integration: true,
  });

  const realPlanData = {
    id: 'v2-large',
    name: 'Business',
    monthlyPrice: 849,
    numDiffs: 200000,
    extraDiffPrice: 0.006,
    numTeamMembersTitle: '20 team members',
    numWorkersTitle: '40 concurrent renderers',
    historyLimitTitle: '1 year history',
  };

  beforeEach(function() {
    mockStripeService(this);
    setupFactoryGuy(this);
    SubscriptionListItem.setContext(this);
  });

  describe('selecting a subscription', function() {
    let organization;
    beforeEach(function() {
      // Setup admin user for org
      const user = make('user');
      organization = make('organization');
      const organizationUser = make('organization-user', 'adminUser', {organization, user});
      organization.set('_filteredOrganizationUsers', [organizationUser]);

      this.set('planData', realPlanData);
      this.set('organization', organization);
      this.set('isActivePlan', false);
    });

    describe('Button text', function() {
      beforeEach(async function() {
        await this.render(hbs`{{organizations/subscription-list-item
          planData=planData
          organization=organization
          isActivePlan=isActivePlan
        }}`);
      });

      it('displays "Select Plan" if no text is passed in and isActivePlan is false', function() {
        this.set('isActivePlan', false);

        expect(SubscriptionListItem.selectPlanButtonText).to.equal('Select Plan');
      });

      it('displays "Selected Plan" when isActivePlan is true', function() {
        this.set('isActivePlan', true);

        expect(SubscriptionListItem.selectPlanButtonText).to.equal('Selected Plan');
      });
    });

    describe('interacting with button', function() {
      it('Select plan button is disabled when isActivePlan is true', async function() {
        await this.render(hbs`{{organizations/subscription-list-item
          planData=planData
          organization=organization
          isActivePlan=true
        }}`);

        expect(SubscriptionListItem.isSelectPlanButtonDisabled).to.equal(true);
      });

      it('Select plan button is enabled when isActivePlan is false', async function() {
        await this.render(hbs`{{organizations/subscription-list-item
          planData=planData
          organization=organization
          isActivePlan=false
        }}`);

        expect(SubscriptionListItem.isSelectPlanButtonDisabled).to.equal(false);
      });

      describe('when org is not a customer', function() {
        beforeEach(async function() {
          await this.render(hbs`{{organizations/subscription-list-item
            planData=planData
            organization=organization
            isActivePlan=false
            transitionToEnterpriseForm=transitionToEnterpriseStub
          }}`);
        });

        it('shows stripe card component after clicking button', async function() {
          expect(SubscriptionListItem.isStripeCardComponentVisible).to.equal(false);

          await SubscriptionListItem.clickSelectPlanButton();
          expect(SubscriptionListItem.isStripeCardComponentVisible).to.equal(true);
        });
      });

      describe('when org is a customer', function() {
        let changeSubscriptionStub;
        beforeEach(async function() {
          changeSubscriptionStub = sinon.stub();
          stubServiceIntegration(this, 'subscriptions', 'subscriptionService', {
            changeSubscription: changeSubscriptionStub,
          });

          const subscription = make('subscription', 'withBusinessPlan', {isCustomer: true});
          organization.set('subscription', subscription);
          this.set('organization', organization);

          await this.render(hbs`{{organizations/subscription-list-item
            planData=planData
            organization=organization
            isActivePlan=false
            transitionToEnterpriseForm=transitionToEnterpriseStub
          }}`);
        });

        it('calls changeSubscription on subscriptions service', async function() {
          await SubscriptionListItem.clickSelectPlanButton();

          expect(SubscriptionListItem.isStripeCardComponentVisible).to.equal(false);
          expect(changeSubscriptionStub).to.have.been.calledWith(organization, realPlanData.id);
        });
      });
    });
  });
});
