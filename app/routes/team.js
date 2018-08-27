import Route from '@ember/routing/route';
import ResetScrollMixin from '../mixins/reset-scroll';
import metaTagLookup from 'percy-web/lib/meta-tags';

export default Route.extend(ResetScrollMixin, {
  headTags: metaTagLookup('team'),
});
