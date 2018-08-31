import Route from '@ember/routing/route';
import ResetScrollMixin from '../mixins/reset-scroll';
import {variation} from 'ember-launch-darkly';

export default Route.extend(ResetScrollMixin, {
  beforeModel() {
    if (!variation('updated-marketing-site')) {
      this.transitionTo('/');
    }
  },
});
