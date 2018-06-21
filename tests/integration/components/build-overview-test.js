/* jshint expr:true */
import {setupComponentTest} from 'ember-mocha';
import {beforeEach, it, describe} from 'mocha';
import {expect} from 'chai';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import {make} from 'ember-data-factory-guy';
import sinon from 'sinon';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';

describe('Integration: BuildOverviewComponent', function() {
  setupComponentTest('build-overview', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this.container);
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

    it(`renders in state: ${testTitle}`, function() {
      let build = make.apply(this, ['build'].concat(state));
      this.set('build', build);

      this.render(hbs`{{build-overview build=build}}`);
      percySnapshot(this.test);
    });
  });

  it('sends showSupport action when clicking "reach out" on timed out build', function() {
    const build = make('build', 'failed', 'renderTimeout');
    const showSupportStub = sinon.stub();
    this.setProperties({
      build,
      showSupport: showSupportStub,
    });
    this.render(hbs`{{build-header build=build showSupport=showSupport}}`);

    this.$('[data-test-build-overview-show-support]').click();
    expect(showSupportStub).to.have.been.called; // eslint-disable-line
  });
});
