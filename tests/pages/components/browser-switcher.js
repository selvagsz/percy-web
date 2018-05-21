import {text, create, collection, hasClass, isPresent} from 'ember-cli-page-object';

const SELECTORS = {
  BROWSER_SWITCHER: '[data-test-browser-switcher]',
  BUTTON: '[data-test-browser-switcher-button]',
  DIFF_COUNT: '[data-test-browser-switcher-diff-count]',
};

export const BrowserSwitcher = {
  scope: SELECTORS.BROWSER_SWITCHER,

  buttons: collection({
    itemScope: SELECTORS.BUTTON,
    item: {
      isActive: hasClass('is-browser-active'),
      diffCount: text(SELECTORS.DIFF_COUNT),
      isDiffCountPresent: isPresent(SELECTORS.DIFF_COUNT),
      isChrome: hasClass('data-test-browser-switcher-chrome'),
      isFirefox: hasClass('data-test-browser-switcher-firefox'),
    },
  }),

  chromeButton: {
    isDescriptor: true,
    get() {
      return this.buttons()
        .toArray()
        .findBy('isChrome');
    },
  },

  firefoxButton: {
    isDescriptor: true,
    get() {
      return this.buttons()
        .toArray()
        .findBy('isFirefox');
    },
  },

  switchBrowser() {
    const activeBrowser = this.buttons()
      .toArray()
      .findBy('isActive');
    if (activeBrowser.isChrome) {
      return this.firefoxButton.click();
    } else {
      return this.chromeButton.click();
    }
  },
};

export default create(BrowserSwitcher);
