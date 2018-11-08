/* jshint expr:true */
import {setupRenderingTest} from 'ember-mocha';
import {beforeEach, it, describe} from 'mocha';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import {make} from 'ember-data-factory-guy';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';

describe('Integration: UserMenuComponent', function() {
  setupRenderingTest('user-menu', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this);
    const user = make('user');
    this.set('user', user);
  });

  it('renders', async function() {
    await this.render(hbs`{{user-menu user=user}}`);
    await percySnapshot(this.test);
  });

  it('toggles menu', async function() {
    await this.render(hbs`{{user-menu user=user showMenu=true}}`);
    await percySnapshot(this.test.fullTitle() + ' | Menu is visible');
  });
});
