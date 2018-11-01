import {setupComponentTest} from 'ember-mocha';
import {expect} from 'chai';
import {it, describe, beforeEach} from 'mocha';
import hbs from 'htmlbars-inline-precompile';
import {make} from 'ember-data-factory-guy';
import BuildPage from 'percy-web/tests/pages/build-page';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';

describe('Integration: BuildToolbar', function() {
  setupComponentTest('build-toolbar', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this.container);
    BuildPage.setContext(this);
  });

  describe('when the project is public', function() {
    beforeEach(function() {
      const organization = make('organization', 'withProjects', 'withSponsoredSubscription');
      const project = organization.get('projects.firstObject');
      const build = make('build', {project});
      this.setProperties({
        build,
        project,
        organization,
      });

      this.render(hbs`{{build-toolbar
        build=build
        project=project
        organization=organization
      }}`);
    });

    it('displays public project icon', function() {
      expect(BuildPage.isPublicProjectIconVisible).to.equal(true);
    });
  });
});
