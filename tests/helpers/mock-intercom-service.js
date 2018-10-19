import Service from '@ember/service';

export default function mockRepoRefresh(context, stub) {
  const intercomServiceStub = Service.extend({
    showIntercom() {
      stub();
    },
  });

  context.register('service:intercom', intercomServiceStub);
  context.inject.service('intercom', {as: 'intercomService'});
  return stub;
}
