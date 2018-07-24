import {it, describe, beforeEach} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import {make} from 'ember-data-factory-guy';
import StripeMock from 'ember-stripe-elements/utils/stripe-mock';
import SubscriptionListItem from 'percy-web/tests/pages/components/organizations/subscription-list-item'; // eslint-disable-line
import sinon from 'sinon';
import stubServiceIntegration from 'percy-web/tests/helpers/stub-service-integration';

describe('Integration: SubscriptionListItem', function() {
  setupComponentTest('organizations/subscription-list-item', {
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

  const customPlanData = {
    id: 'fake-plan',
    name: 'Best plan',
    monthlyPrice: 950,
    numDiffs: 9876543,
    extraDiffPrice: 0.333,
    numTeamMembersTitle: 'All the members',
    numWorkersTitle: 'So many renderers',
    historyLimitTitle: '1 billion years',
  };

  beforeEach(function() {
    window.Stripe = StripeMock;
    setupFactoryGuy(this.container);
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
      beforeEach(function() {
        this.set('buttonText', null);
        this.render(hbs`{{organizations/subscription-list-item
          planData=planData
          organization=organization
          isActivePlan=isActivePlan
          buttonText=buttonText
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

      it('displays passed in text when text is passed in', function() {
        this.set('isActivePlan', true);
        const text = 'I passed this text in';
        this.set('buttonText', text);

        expect(SubscriptionListItem.selectPlanButtonText).to.equal(text);
      });
    });

    describe('interacting with button', function() {
      it('Select plan button is disabled when isActivePlan is true', function() {
        this.render(hbs`{{organizations/subscription-list-item
          planData=planData
          organization=organization
          isActivePlan=true
        }}`);

        expect(SubscriptionListItem.isSelectPlanButtonDisabled).to.equal(true);
      });

      it('Select plan button is enabled when isActivePlan is false', function() {
        this.render(hbs`{{organizations/subscription-list-item
          planData=planData
          organization=organization
          isActivePlan=false
        }}`);

        expect(SubscriptionListItem.isSelectPlanButtonDisabled).to.equal(false);
      });

      it('fires transitionToEnterpriseForm if plan is custom', async function() {
        const transitionToEnterpriseStub = sinon.stub();
        this.set('transitionToEnterpriseStub', transitionToEnterpriseStub);
        this.set('planData', customPlanData);
        this.render(hbs`{{organizations/subscription-list-item
          planData=planData
          organization=organization
          isActivePlan=false
          transitionToEnterpriseForm=transitionToEnterpriseStub
        }}`);

        await SubscriptionListItem.clickSelectPlanButton();

        expect(transitionToEnterpriseStub).to.have.been.called;
      });

      describe('when org is not a customer', function() {
        beforeEach(function() {
          this.render(hbs`{{organizations/subscription-list-item
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
        beforeEach(function() {
          changeSubscriptionStub = sinon.stub();
          stubServiceIntegration(this, 'subscriptions', 'subscriptionService', {
            changeSubscription: changeSubscriptionStub,
          });

          const subscription = make('subscription', 'withBusinessPlan', {isCustomer: true});
          organization.set('subscription', subscription);
          this.set('organization', organization);

          this.render(hbs`{{organizations/subscription-list-item
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
