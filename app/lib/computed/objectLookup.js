import {computed} from '@ember/object';

export function lookup(keyName, lookupObject, subKeyName) {
  return computed(keyName, function() {
    return lookupObject[this.get(keyName)][subKeyName];
  });
}
