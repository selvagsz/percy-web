import {expect} from 'chai';
import {describe, beforeEach, it} from 'mocha';
import AdminMode, {ADMIN_MODE_KEY, ADMIN_MODE_VALUE} from 'percy-web/lib/admin-mode';
import localStorageProxy from 'percy-web/lib/localstorage';
import SetupLocalStorageSandbox from 'percy-web/tests/helpers/setup-localstorage-sandbox';

describe('admin-mode', function() {
  SetupLocalStorageSandbox();
  beforeEach(() => {
    localStorage.clear();
  });

  describe(`when ${ADMIN_MODE_KEY} is ${ADMIN_MODE_VALUE}`, function() {
    beforeEach(() => {
      localStorageProxy.set(ADMIN_MODE_KEY, ADMIN_MODE_VALUE);
    });

    it('returns true when isAdmin is called', function() {
      expect(AdminMode.isAdmin()).to.equal(true);
    });

    it('returns value of key when getAdminMode is called', function() {
      expect(AdminMode.getAdminMode()).to.equal(ADMIN_MODE_VALUE);
    });

    it('returns true when excludeFromAnalytics is called', function() {
      expect(AdminMode.excludeFromAnalytics()).to.equal(true);
    });

    it(`clears ${ADMIN_MODE_KEY} from localStorage when clear is called`, function() {
      localStorageProxy.set('this', 'should not be removed');
      AdminMode.clear();
      expect(localStorageProxy.get('this')).to.equal('should not be removed');
      expect(localStorageProxy.get(ADMIN_MODE_KEY)).to.equal(undefined);
    });
  });

  describe(`when ${ADMIN_MODE_KEY} is not ${ADMIN_MODE_VALUE}`, function() {
    it('returns false when isAdmin is called', function() {
      expect(AdminMode.isAdmin()).to.equal(false);
    });

    it('returns undefined when getAdminMode is called', function() {
      expect(AdminMode.getAdminMode()).to.equal(undefined);
    });

    it('returns ${ADMIN_MODE_VALUE} when setAdminMode is called', function() {
      const val = AdminMode.setAdminMode();
      expect(val).to.equal(ADMIN_MODE_VALUE);
      expect(localStorageProxy.get(ADMIN_MODE_KEY)).to.equal(ADMIN_MODE_VALUE);
    });

    it('returns false when excludeFromAnalytics is called', function() {
      expect(AdminMode.excludeFromAnalytics()).to.equal(false);
    });
  });
});
