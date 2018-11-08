/* jshint expr:true */
import {setupRenderingTest} from 'ember-mocha';
import {beforeEach, it, describe} from 'mocha';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import {make} from 'ember-data-factory-guy';

describe('Integration: QuickstartButtonComponent', function() {
  setupRenderingTest('quickstart-button', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this);
    const organization = make('organization');
    const project = make('project', {organization});
    this.set('project', project);
  });

  it('renders', async function() {
    await this.render(hbs`{{quickstart-button}}`);
    await percySnapshot(this.test);
  });
});
