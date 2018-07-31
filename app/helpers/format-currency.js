import {helper} from '@ember/component/helper';
import Formatting from '../lib/formatting';

export default helper(function(value, options) {
  return Formatting.formatCurrency(value, options);
});
