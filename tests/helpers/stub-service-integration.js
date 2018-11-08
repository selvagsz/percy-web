import Service from '@ember/service';

export default function(context, serviceFileName, serviceComponentName, serviceContent) {
  const serviceStub = Service.extend(serviceContent);
  context.owner.register(`service:${serviceFileName}`, serviceStub, serviceComponentName);
}
