import Route from '@ember/routing/route';
import ResetScrollMixin from '../mixins/reset-scroll';
import {inject as service} from '@ember/service';

export default Route.extend(ResetScrollMixin, {
  launchDarkly: service(),
});
