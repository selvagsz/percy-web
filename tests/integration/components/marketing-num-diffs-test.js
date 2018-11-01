import {it, describe} from 'mocha';
import {setupRenderingTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import {percySnapshot} from 'ember-percy';
import {getRootElement} from '@ember/test-helpers';

describe('Integration: MarketingNumDiffsComponent', function() {
  setupRenderingTest('marketing-num-diffs', {
    integration: true,
  });

  it('renders', async function() {
    await this.render(hbs`{{marketing-num-diffs}}`);
    await percySnapshot(this.test.fullTitle(), getRootElement());
  });
});
