import {setupComponentTest} from 'ember-mocha';
import {it, describe, beforeEach} from 'mocha';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import {make} from 'ember-data-factory-guy';
import BuildHeader from 'percy-web/tests/pages/components/build-header';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import sinon from 'sinon';
import mockIntercomService from 'percy-web/tests/helpers/mock-intercom-service';

describe('Integration: BuildHeader', function() {
  setupComponentTest('build-header', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this.container);
    BuildHeader.setContext(this);
  });

  const states = [
    ['pending', 'withBaseBuild'],
    ['processing', 'withBaseBuild'],
    ['finished', 'withBaseBuild'],
    ['finished', 'withBaseBuild', 'noDiffs'],
    ['finished', 'withBaseBuild', 'withUpgradedBrowser'],
    ['finished', 'withBaseBuild', 'withTwoUpgradedBrowsers'],
    ['failed', 'withBaseBuild', 'missingResources'],
    ['failed', 'withBaseBuild', 'missingParallelBuilds'],
    ['failed', 'withBaseBuild', 'noSnapshots'],
    ['failed', 'withBaseBuild', 'renderTimeout'],
    // This snapshot should not show any browser upgrade notice.
    ['failed', 'withBaseBuild', 'withTwoUpgradedBrowsers'],
    ['expired', 'withBaseBuild'],
  ];

  states.forEach(state => {
    const testTitle = state.join(' ');

    it(`renders in state: ${testTitle}`, function() {
      const build = make.apply(this, ['build'].concat(state));
      this.setProperties({build});

      this.render(hbs`{{
        build-header
        build=build
        isBuildApprovable=true
      }}`);
      percySnapshot(this.test);
    });
  });

  describe('showSupport actions', function() {
    it('sends showSupport action when clicking "reach out" on timed out build', function() {
      const showSupportStub = sinon.stub();
      mockIntercomService(this, showSupportStub);

      const build = make('build', 'withBaseBuild', 'failed', 'renderTimeout');
      this.setProperties({build});
      this.render(hbs`{{build-header
        build=build
        isBuildApprovable=true
      }}`);

      BuildHeader.clickShowSupport();
      expect(showSupportStub).to.have.been.called;
    });

    it('sends showSupport action when clicking "reach out" when missing parallel builds', function() { // eslint-disable-line
      const showSupportStub = sinon.stub();
      mockIntercomService(this, showSupportStub);

      const build = make('build', 'withBaseBuild', 'failed', 'missingParallelBuilds');
      this.setProperties({build});
      this.render(hbs`{{build-header
        build=build
        isBuildApprovable=true
      }}`);

      BuildHeader.clickShowSupport();
      expect(showSupportStub).to.have.been.called;
    });
  });
});
