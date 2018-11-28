import {it, describe, beforeEach} from 'mocha';
import {setupRenderingTest} from 'ember-mocha';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import UsersHeader from 'percy-web/tests/pages/components/organizations/users-header';
import {make} from 'ember-data-factory-guy';
import hbs from 'htmlbars-inline-precompile';

describe('Integration: UsersHeader', function() {
  setupRenderingTest('organizations/users-header-test', {
    integration: true,
  });

  const organizationName = 'Meow Mediaworks';
  let seatsUsed;
  let seatLimit;

  beforeEach(async function() {
    setupFactoryGuy(this);
    UsersHeader.setContext(this);

    seatsUsed = 3;
    seatLimit = 10;
    const organization = make('organization', {
      name: organizationName,
      seatsUsed,
      seatLimit,
    });
    const user = make('user');
    const organizationUser = make('organization-user', 'adminUser', {
      organization: organization,
      user: user,
    });
    organization.set('_filteredOrganizationUsers', [organizationUser]);

    this.setProperties({
      organization,
      isInvitePath: true,
    });
    this.set('organization', organization);

    await this.render(hbs`{{organizations/users-header
      organization=organization
    }}`);
  });

  it('displays organization information', function() {
    const expectedSeatCountText = `You’ve used ${seatsUsed} of ${seatLimit} seats available.`;

    expect(UsersHeader.organizationName).to.equal(organizationName);
    expect(UsersHeader.seatCountText).to.equal(expectedSeatCountText);
    expect(UsersHeader.isBillingLinkVisible).to.equal(true);
    expect(UsersHeader.isSupportLinkVisible).to.equal(true);
  });

  describe('is running', function() {
    it('checks truthiness', function() {
      expect(true).to.equal(true);
    });
  });
});
