import Service from '@ember/service';

export default function mockStripeService(context) {
  context.owner.register('service:stripev3', Service.extend({load: () => {}}), 'stripe');
}
