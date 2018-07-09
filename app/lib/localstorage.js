// Use this if you want to store something locally on a user's client.
// Use localStorage -- no third argument or, useSessionStorage: false -- if you want to
// persist information across page loads AND accross tabs.
// Use sessionstorage -- useSessionStorage: true -- if you want to persist information for a
// single tab only.
export default {
  get(key, defaultValue, {useSessionStorage = false} = {}) {
    let item;
    const storageSystem = useSessionStorage ? sessionStorage : localStorage;
    try {
      item = JSON.parse(storageSystem.getItem(key));
    } catch (_) {
      // Safari throws errors while accessing localStorage in private mode.
    } finally {
      return item || defaultValue; // eslint-disable-line no-unsafe-finally
    }
  },

  set(key, value, {useSessionStorage = false} = {}) {
    const storageSystem = useSessionStorage ? sessionStorage : localStorage;
    try {
      storageSystem.setItem(key, JSON.stringify(value));
    } catch (_) {
      // Safari throws errors while accessing localStorage in private mode.
    } finally {
      return value; // eslint-disable-line no-unsafe-finally
    }
  },

  removeItem(key, {useSessionStorage = false} = {}) {
    const storageSystem = useSessionStorage ? sessionStorage : localStorage;
    try {
      storageSystem.removeItem(key);
    } catch (_) {
      // Safari throws errors while accessing localStorage in private mode.
    }
  },

  _keys({useSessionStorage = false} = {}) {
    const storageSystem = useSessionStorage ? sessionStorage : localStorage;

    try {
      const ret = [];
      for (var i = 0; i < storageSystem.length; i++) {
        ret.push(storageSystem.key(i));
      }
      return ret;
    } catch (_) {
      // Safari throws errors while accessing localStorage in private mode.
      return [];
    }
  },

  keysWithString(string, {useSessionStorage = false} = {}) {
    return this._keys(useSessionStorage).filter(key => {
      return new RegExp(string).test(key);
    });
  },

  removeKeysWithString(string, {useSessionStorage = false} = {}) {
    this.keysWithString(string, useSessionStorage).forEach(key => {
      this.removeItem(key);
    });
  },
};
