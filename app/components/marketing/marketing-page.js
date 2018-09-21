import Component from '@ember/component';

export default Component.extend({
  click(event) {
    // Support third-party links that Ember doesn't know about. This emulates the behavior of
    // link-to for smooth in-app transitions, but for links that come from Contenful and rendered
    // Markdown. This prevents full-page refreshes on links that we know we can transition to.
    let matchingLinksHostname = 'https://percy.io';
    if (event.target.tagName === 'A' && event.target.href.indexOf(matchingLinksHostname) === 0) {
      // The target link is part of this app. Hijack the transition and stop bubbling.
      let path = event.target.href
        .split(matchingLinksHostname)[1]
        .split('#')[0]
        .slice(1);
      this.send('navigate', path);
      return false;
    }
  },

  actions: {
    navigate(path) {
      this.get('transitionTo')(path);
    },
  },
});
