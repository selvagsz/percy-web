import config from 'percy-web/config/environment';

export default function() {
  if (config.environment === 'test') {
    Math.seedrandom('randomseed');
    return Math.random();
  } else {
    return Math.random();
  }
}
