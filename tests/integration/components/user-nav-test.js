import {it, describe, beforeEach} from 'mocha';
import {setupRenderingTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import UserMenuLight from 'percy-web/tests/pages/components/user-nav';
import {percySnapshot} from 'ember-percy';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import {make} from 'ember-data-factory-guy';

describe('Integration: UserNav', function() {
  setupRenderingTest('user-nav', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this);
    UserMenuLight.setContext(this);
    const user = make('user');
    this.set('user', user);
  });

  it('displays user menu', async function() {
    await this.render(hbs`{{user-nav
      user=user
    }}`);

    UserMenuLight.clickAvatar();
    await percySnapshot(this.test.fullTitle());
  });
});
