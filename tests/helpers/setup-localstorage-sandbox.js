import {before, after} from 'mocha';

export default function setupLocalStorageSandbox() {
  let prevLocalStorage;
  before(function() {
    prevLocalStorage = _serializeLocalStorage();
  });

  after(function() {
    _restoreLocalStorage(prevLocalStorage);
  });
}

function _serializeLocalStorage() {
  const serializedLocalStorage = {};
  const localStorageItems = Object.keys(window.localStorage);
  localStorageItems.forEach(key => {
    serializedLocalStorage[key] = JSON.stringify(localStorage.getItem(key));
  });
  return serializedLocalStorage;
}

function _restoreLocalStorage(serializedLocalStorageData) {
  const keys = Object.keys(serializedLocalStorageData);
  keys.forEach(key => {
    localStorage.setItem(key, JSON.parse(serializedLocalStorageData[key]));
  });
}
