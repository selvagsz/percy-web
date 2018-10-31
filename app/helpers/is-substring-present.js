import {helper} from '@ember/component/helper';

export function isSubstringPresent([string, substring]) {
  if (!string || !substring) {
    return false;
  } else {
    // Ensure it is a string, sometimes it is a string-like error.
    return string.toString().includes(substring);
  }
}

export default helper(isSubstringPresent);
