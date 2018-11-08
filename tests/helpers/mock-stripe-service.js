import Service from '@ember/service';

export default function mockStripeService(context) {
  context.owner.register(
    'service:stripev3',
    Service.extend({
      load: () => {},
      elements() {
        return {
          create: function() {
            return {
              mount: function() {},
              on: function() {},
              unmount: function() {},
            };
          },
        };
      },
      createToken: () => {},
      createSource: () => {},
      retrieveSource: () => {},
      paymentRequest: () => {},
    }),
    'stripe',
  );
}
