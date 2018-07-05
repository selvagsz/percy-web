import config from 'percy-web/config/environment';

export default function timeoutForEnv(timeout, timeoutForTestEnv = 0) {
  if (config.environment === 'test') {
    return timeoutForTestEnv;
  } else {
    return timeout;
  }
}
