import Component from '@ember/component';
import {computed} from '@ember/object';
import {inject as service} from '@ember/service';

const FOOTER_HEADER_ORDER = ['Product', 'Resources', 'Developers', 'Company'];

export default Component.extend({
  store: service(),
  footerGroups: computed(async function() {
    const itemsGroupedByCategory = await this.store.findAll('footer-item').then(items => {
      return this._groupItemsByCategory(items);
    });

    // Sort them by FOOTER_HEADER_ORDER
    return FOOTER_HEADER_ORDER.map(header => {
      return {
        category: header,
        items: itemsGroupedByCategory[header],
      };
    });
  }),

  _groupItemsByCategory(items) {
    return items.reduce((acc, item) => {
      const category = item.get('category');
      if (acc[category]) {
        acc[category].push(item);
      } else {
        acc[category] = [item];
      }
      return acc;
    }, {});
  },
});
