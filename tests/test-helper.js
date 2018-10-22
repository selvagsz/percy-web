// import resolver from './helpers/resolver';
// import './helpers/flash-message';

// import {setResolver} from 'ember-mocha';
import {mocha} from 'mocha';
// import loadEmberExam from 'ember-exam/test-support/load';

// setResolver(resolver);
// loadEmberExam();

import Application from '../app';
import config from '../config/environment';
import {setApplication} from '@ember/test-helpers';

setApplication(Application.create(config.APP));

mocha.setup({
  timeout: 10000,
  slow: 2000,
});
