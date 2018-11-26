import Component from '@ember/component';
import {readOnly} from '@ember/object/computed';

export default Component.extend({
  tableHeader: readOnly('table.pricingTableRows.firstObject'),
});
