import {it, describe, beforeEach} from 'mocha';
import {setupRenderingTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import QuoteBlock from 'percy-web/tests/pages/components/marketing/customer-quote-block';
import {percySnapshot} from 'ember-percy';

describe('Integration: Marketing/CustomerQuoteBlock', function() {
  setupRenderingTest('marketing/customer-quote-block', {
    integration: true,
  });

  const doloresHeadshot = {file: {url: '/images/test/dolores-headshot.png'}};
  const mazeLogo = {file: {url: '/images/test/maze-logo.png'}};

  const fordHeadshot = {file: {url: '/images/test/ford-headshot.png'}};
  const westworldLogo = {file: {url: '/images/test/westworld-logo.png'}};

  const quoteBlock = {
    customerQuotes: [
      {
        headshot: doloresHeadshot,
        logo: mazeLogo,
        customerQuote: "Quis molestiae tempora eligendi omnis quisquam quisquam quos. Dolor voluptatibus velit nobis culpa deleniti. Reprehenderit in nisi et. Quia odio et inventore eligendi in deserunt id. Sit odio quia vitae provident quo provident molestiae.", // eslint-disable-line
        quoteAttribution: 'Dolores Abernathy, Deathbringer at large.',
      },
      {
        headshot: fordHeadshot,
        logo: westworldLogo,
        customerQuote: 'Pariatur quos est quod laborum. Quisquam esse quia expedita commodi. Tempora ut exercitationem doloribus harum. Sunt omnis et accusantium et quia quos sequi molestiae. Enim necessitatibus molestiae.', // eslint-disable-line
        quoteAttribution: 'Robert Ford, Android captor slash liberator',
      },
    ],
  };

  beforeEach(function() {
    QuoteBlock.setContext(this);
    this.set('quoteBlock', quoteBlock);
  });

  it('switches quotes when dot is clicked', async function() {
    await this.render(hbs`{{marketing/customer-quote-block
      quoteBlock=quoteBlock
    }}`);

    await percySnapshot(`${this.test.fullTitle()} | slide 1`);
    await QuoteBlock.dots(1).click();

    await percySnapshot(`${this.test.fullTitle()} | slide 2`);
  });
});
