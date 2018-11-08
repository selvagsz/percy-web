/* jshint expr:true */
import {setupRenderingTest} from 'ember-mocha';
import {beforeEach, it, describe} from 'mocha';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import {make} from 'ember-data-factory-guy';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';

describe('Integration: BuildStateBadgeComponent', function() {
  setupRenderingTest('build-state-badge', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this);
  });

  let states = [
    ['pending'],
    ['processing'],
    ['finished'],
    ['finished', 'noDiffs'],
    ['failed', 'missingResources'],
    ['failed', 'noSnapshots'],
    ['failed', 'renderTimeout'],
    ['expired'],
  ];

  states.forEach(state => {
    let testTitle = state.join(' ');

    it(`renders in state: ${testTitle}`, async function() {
      let build = make.apply(this, ['build'].concat(state));
      this.set('build', build);

      await this.render(hbs`{{build-state-badge build=build}}`);
      await percySnapshot(this.test);
    });
  });
});
