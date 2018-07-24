import Service from '@ember/service';

export default function(context, serviceFileName, serviceComponentName, serviceContent) {
  const serviceStub = Service.extend(serviceContent);
  context.register(`service:${serviceFileName}`, serviceStub);
  context.inject.service(serviceFileName, {as: serviceComponentName});
}
