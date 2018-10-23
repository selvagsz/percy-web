import {expect} from 'chai';
import {describe, it} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | organizations/invites-list', function() {
  setupComponentTest('organizations/invites-list', {
    integration: true,
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#organizations/invites-list}}
    //     template content
    //   {{/organizations/invites-list}}
    // `);

    this.render(hbs`{{organizations/invites-list}}`);
    expect(this.$()).to.have.length(1);
  });
});
