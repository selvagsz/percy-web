import {create, collection} from 'ember-cli-page-object';

const SELECTORS = {
  DOT: '[data-test-quote-block-dot]',
};

const QuoteBlock = {
  dots: collection({
    itemScope: SELECTORS.DOT,
  }),
};

export default create(QuoteBlock);
