import {it, describe, beforeEach} from 'mocha';
import {setupRenderingTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import {make} from 'ember-data-factory-guy';
import sinon from 'sinon';
import BrowserFamilySelector from 'percy-web/tests/pages/components/projects/browser-family-selector'; // eslint-disable-line

describe('Integration: BrowserFamilySelector', function() {
  setupRenderingTest('projects/browser-family-selector', {
    integration: true,
  });

  let chromeBrowserTarget;
  let firefoxBrowserTarget;
  let project;

  describe('browser active behavior', function() {
    beforeEach(function() {
      setupFactoryGuy(this);
      BrowserFamilySelector.setContext(this);

      const firefoxBrowserFamily = make('browser-family');
      const chromeBrowserFamily = make('browser-family', 'chrome');
      project = make('project');
      chromeBrowserTarget = make('browser-target', {browserFamily: chromeBrowserFamily});
      firefoxBrowserTarget = make('browser-target', {browserFamily: firefoxBrowserFamily});

      const allBrowserFamilies = [chromeBrowserFamily, firefoxBrowserFamily];
      const stub = sinon.stub();

      this.setProperties({
        project,
        allBrowserFamilies,
        stub,
      });
    });

    it('shows chrome as selected when project has chrome browser_target', async function() {
      make('project-browser-target', {
        project,
        browserTarget: chromeBrowserTarget,
      });

      await this.render(hbs`{{projects/browser-family-selector
        allBrowserFamilies=allBrowserFamilies
        project=project
        removeProjectBrowserTargetForFamily=stub
        addProjectBrowserTargetForFamily=stub
      }}`);

      expect(BrowserFamilySelector.chromeButton.isActive).to.equal(true);
      expect(BrowserFamilySelector.firefoxButton.isActive).to.equal(false);
    });

    it('shows firefox as selected when project has firefox browser target', async function() {
      make('project-browser-target', {
        project,
        browserTarget: firefoxBrowserTarget,
      });

      await this.render(hbs`{{projects/browser-family-selector
        allBrowserFamilies=allBrowserFamilies
        project=project
        removeProjectBrowserTargetForFamily=stub
        addProjectBrowserTargetForFamily=stub
      }}`);

      expect(BrowserFamilySelector.chromeButton.isActive).to.equal(false);
      expect(BrowserFamilySelector.firefoxButton.isActive).to.equal(true);
    });

    it('shows both browsers as selected when project has both browser targets', async function() {
      make('project-browser-target', {
        project,
        browserTarget: chromeBrowserTarget,
      });
      make('project-browser-target', {
        project,
        browserTarget: firefoxBrowserTarget,
      });
      await this.render(hbs`{{projects/browser-family-selector
        allBrowserFamilies=allBrowserFamilies
        project=project
        removeProjectBrowserTargetForFamily=stub
        addProjectBrowserTargetForFamily=stub
      }}`);

      expect(BrowserFamilySelector.chromeButton.isActive).to.equal(true);
      expect(BrowserFamilySelector.firefoxButton.isActive).to.equal(true);
    });
  });

  // These tests don't wait on the add/remove browser action to finish.
  describe.skip('updating project browser families', function() {
    let project;
    let removeProjectBrowserTargetForFamilyStub;
    let addProjectBrowserTargetForFamilyStub;
    let chromeBrowserTarget;
    let firefoxBrowserTarget;
    let chromeBrowserFamily;
    let firefoxBrowserFamily;

    beforeEach(function() {
      setupFactoryGuy(this);
      BrowserFamilySelector.setContext(this);

      firefoxBrowserFamily = make('browser-family');
      chromeBrowserFamily = make('browser-family', 'chrome');
      project = make('project');
      chromeBrowserTarget = make('browser-target', {browserFamily: chromeBrowserFamily});
      firefoxBrowserTarget = make('browser-target', {browserFamily: firefoxBrowserFamily});

      const allBrowserFamilies = [chromeBrowserFamily, firefoxBrowserFamily];
      removeProjectBrowserTargetForFamilyStub = sinon.stub();
      addProjectBrowserTargetForFamilyStub = sinon.stub();

      this.setProperties({
        project,
        allBrowserFamilies,
        removeProjectBrowserTargetForFamilyStub,
        addProjectBrowserTargetForFamilyStub,
      });
    });

    it('sends "removeProjectBrowserTargetForFamily" when adding a browser', async function() {
      make('project-browser-target', {
        project,
        browserTarget: chromeBrowserTarget,
      });
      make('project-browser-target', {
        project,
        browserTarget: firefoxBrowserTarget,
      });

      await this.render(hbs`{{projects/browser-family-selector
        allBrowserFamilies=allBrowserFamilies
        project=project
        removeProjectBrowserTargetForFamily=removeProjectBrowserTargetForFamilyStub
        addProjectBrowserTargetForFamily=addProjectBrowserTargetForFamilyStub
      }}`);

      await BrowserFamilySelector.clickChrome();

      expect(removeProjectBrowserTargetForFamilyStub).to.have.been.calledWith(
        chromeBrowserFamily,
        project,
      );
    });

    it('sends "addProjectBrowserTargetForFamily" when adding a browser', async function() {
      make('project-browser-target', {
        project,
        browserTarget: chromeBrowserTarget,
      });

      await this.render(hbs`{{projects/browser-family-selector
        allBrowserFamilies=allBrowserFamilies
        project=project
        removeProjectBrowserTargetForFamily=removeProjectBrowserTargetForFamilyStub
        addProjectBrowserTargetForFamily=addProjectBrowserTargetForFamilyStub
      }}`);

      await BrowserFamilySelector.clickFirefox();

      expect(addProjectBrowserTargetForFamilyStub).to.have.been.calledWith(
        firefoxBrowserFamily,
        project,
      );
    });

    it('shows a flash message when trying to remove the last browser family', async function() {
      const flashMessageService = this.owner
        .lookup('service:flash-messages')
        .registerTypes(['info']);
      sinon.stub(flashMessageService, 'info');

      make('project-browser-target', {
        project,
        browserTarget: firefoxBrowserTarget,
      });

      await this.render(hbs`{{projects/browser-family-selector
        allBrowserFamilies=allBrowserFamilies
        project=project
        removeProjectBrowserTargetForFamily=removeProjectBrowserTargetForFamilyStub
        addProjectBrowserTargetForFamily=addProjectBrowserTargetForFamilyStub
      }}`);

      await BrowserFamilySelector.clickFirefox();

      expect(flashMessageService.info).to.have.been.calledWith(
        'A project must have at least one browser',
      );
      expect(removeProjectBrowserTargetForFamilyStub).to.not.have.been.called;
    });
  });
});
