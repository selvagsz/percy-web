import {it, describe, beforeEach} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import {make} from 'ember-data-factory-guy';
import SubscriptionList from 'percy-web/tests/pages/components/organizations/subscription-list';
import sinon from 'sinon';
import mockIntercomService from 'percy-web/tests/helpers/mock-intercom-service';

describe('Integration: SubscriptionList', function() {
  setupComponentTest('organizations/subscription-list', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this.container);
    SubscriptionList.setContext(this);
  });

  function testShowSupportCalled(context, organization, actionName) {
    context.setProperties({organization});
    context.render(hbs`{{organizations/subscription-list
      organization=organization
    }}`);

    const showSupportStub = sinon.stub();
    mockIntercomService(context, showSupportStub);

    SubscriptionList[actionName]();
    expect(showSupportStub).to.have.been.called;
  }

  describe('showing support', function() {
    let organization;

    beforeEach(function() {
      const user = make('user');
      organization = make('organization');
      const organizationUser = make('organization-user', 'adminUser', {organization, user});
      organization.set('_filteredOrganizationUsers', [organizationUser]);
    });

    it('calls intercom service when clicking create subscription support', function() {
      organization.set('subscription', make('subscription', 'withTrialPlan'));
      testShowSupportCalled(this, organization, 'clickCreateSubscriptionSupport');
    });

    it('calls intercom service when clicking free plan support', function() {
      organization.set('subscription', make('subscription'));
      testShowSupportCalled(this, organization, 'clickFreePlanSupport');
    });

    it('calls intercom service when clicking custom plan support', function() {
      organization.set('subscription', make('subscription', 'withCustomPlan'));
      testShowSupportCalled(this, organization, 'clickCustomPlanSupport');
    });

    it('calls intercom service when clicking more info support', function() {
      testShowSupportCalled(this, organization, 'clickMoreInformationSupport');
    });

    it('calls intercom service when clicking "Need More" support', function() {
      organization.set('subscription', make('subscription', 'withBusinessPlan'));
      testShowSupportCalled(this, organization, 'clickEnterpriseButton');
    });
  });
});
