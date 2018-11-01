// import resolver from './helpers/resolver';
import './helpers/flash-message';

// import {setResolver} from 'ember-mocha';
import {mocha} from 'mocha';
import loadEmberExam from 'ember-exam/test-support/load';

// setResolver(resolver);

import Application from '../app';
import config from '../config/environment';
import {setApplication} from '@ember/test-helpers';

setApplication(Application.create(config.APP));
loadEmberExam();

mocha.setup({
  timeout: 10000,
  slow: 2000,
});
