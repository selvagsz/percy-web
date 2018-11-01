export default function withVariation(app, key, value = true) {
  const {__container__: container} = app;
  let client = container.lookup('service:launch-darkly-client');
  client.setVariation(key, value);
}
