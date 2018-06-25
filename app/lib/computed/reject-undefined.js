import {computed} from '@ember/object';

export function rejectUndefined(keyName) {
  return computed(keyName, function() {
    return this.get(keyName).filter(item => {
      return !!item;
    });
  });
}
