import {helper} from '@ember/component/helper';

export function contains([haystack, needle]) {
  return haystack.includes(needle);
}

export default helper(contains);
