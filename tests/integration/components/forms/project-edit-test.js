import {it, describe, beforeEach} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import {make} from 'ember-data-factory-guy';
import ProjectEditForm from 'percy-web/tests/pages/components/forms/project-edit';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import {percySnapshot} from 'ember-percy';
import StubClient from 'ember-launch-darkly/test-support/helpers/launch-darkly-client-test';

describe('Integration: ProjectEditForm', function() {
  setupComponentTest('forms/project-edit', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this.container);
    ProjectEditForm.setContext(this);
  });

  describe('publicly viewable checkbox', function() {
    let project;
    beforeEach(function() {
      this.register('service:launch-darkly-client', StubClient);
      this.inject.service('launch-darkly-client', {as: 'launchDarklyClient'});
      this.get('launchDarklyClient').enable('public-project-switch');

      project = make('project');
      this.setProperties({project});
      this.render(hbs`{{forms/project-edit
        project=project
      }}`);
    });

    it('shows as not-checked when publiclyReadable is false', function() {
      expect(ProjectEditForm.isPublicCheckboxChecked).to.equal(false);
      expect(ProjectEditForm.isPublicCheckboxDisabled).to.equal(false);
      percySnapshot(this.test.fullTitle());
    });

    it('shows as checked when publiclyReadable is true', function() {
      const project = make('project', 'public');
      this.set('project', project);

      expect(ProjectEditForm.isPublicCheckboxChecked).to.equal(true);
      expect(ProjectEditForm.isPublicCheckboxDisabled).to.equal(false);
      percySnapshot(this.test.fullTitle());
    });

    it('toggles switch when clicked', function() {
      expect(ProjectEditForm.isPublicCheckboxChecked).to.equal(false);
      ProjectEditForm.togglePublicCheckbox();
      expect(ProjectEditForm.isPublicCheckboxChecked).to.equal(true);
      ProjectEditForm.togglePublicCheckbox();
      expect(ProjectEditForm.isPublicCheckboxChecked).to.equal(false);
    });

    describe('when project belongs to an organization with a sponsored plan', function() {
      beforeEach(function() {
        const organization = make('organization', 'withSponsoredSubscription');
        const project = make('project', 'public', {organization});
        this.set('project', project);
      });

      it('is disabled', function() {
        expect(ProjectEditForm.isPublicCheckboxChecked).to.equal(true);
        expect(ProjectEditForm.isPublicCheckboxDisabled).to.equal(true);
        percySnapshot(this.test.fullTitle());
      });

      it('does not toggle switch when clicked', function() {
        expect(ProjectEditForm.isPublicCheckboxChecked).to.equal(true);
        ProjectEditForm.togglePublicCheckbox();
        expect(ProjectEditForm.isPublicCheckboxChecked).to.equal(true);
      });
    });
  });
});
