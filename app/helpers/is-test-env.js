import {helper} from '@ember/component/helper';
import config from '../config/environment';

export default helper(function() {
  return config.environment === 'test';
});
