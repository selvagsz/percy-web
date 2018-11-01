import Service from '@ember/service';

export default function mockRepoRefresh(context, stub) {
  const intercomServiceStub = Service.extend({
    showIntercom() {
      stub();
    },
  });

  context.owner.register('service:intercom', intercomServiceStub, 'intercom');
  return stub;
}
