# percy-web

[![Build status](https://badge.buildkite.com/c5a2ecb69c413ef1b2709d9c256edb4a17c1922b23f38bbefe.svg)](https://buildkite.com/percy/test-web)

[Percy](https://percy.io)'s frontend web application, built with Ember.

## Setup

First, install [yarn](https://yarnpkg.com).

Then, run:

```bash
yarn
```

## Run server

```bash
PERCY_DEV_MIRAGE=yes yarn run start
```

Then, access [http://localhost:4200](http://localhost:4200)

### Using local API server

Edit `/etc/hosts` to add a local hostname (required):

```bash
# Add this to /etc/hosts:
127.0.0.1  dev.percy.local
```

Then, run:

```bash
yarn run start
```

### Using the production API

First, add the `dev.percy.local` hostname above. Then, two environment variables must be set:

```bash
export PERCY_WEB_AUTH_TOKEN=...
export PERCY_WEB_API_HOST=https://percy.io

yarn run start
```

`PERCY_WEB_AUTH_TOKEN` is a full-access user token, different than the normal project `PERCY_TOKEN`.

Then, access [http://dev.percy.local:4200](http://dev.percy.local:4200)

## Run tests

```bash
yarn test
````

Or, visit [http://dev.percy.local:4200/tests](http://dev.percy.local:4200/tests).

Or, to run in `ember test --server` mode:

```bash
yarn run test:server
```

## Run tests locally with Percy enabled

```bash
PERCY_TOKEN=... PERCY_BRANCH=local yarn test
```

## Update to a new ember.js version
- Determine the version of Ember Percy's is currently using from the `ember-cli` package version in yarn.lock.

- Determine the [latest Ember release](https://github.com/ember-cli/ember-cli/releases/latest).

- Read the [changelog](https://github.com/emberjs/ember.js/blob/master/CHANGELOG.md) to review changes between the source version and target version.

- View the [release notes](https://github.com/ember-cli/ember-cli/releases) for each version between the source and target.  If there are any unusual notes for an upgrade step, follow them.

- Update using the Setup and Project Update notes for the [current release](https://github.com/ember-cli/ember-cli/releases/latest).

- When running the `ember-init`, use `d` to do a diff on each file.  Most changes can be ignored (`n`).  The package.json will have a few packages that need to have version numbers updated.  Do these manually one by one.  ember-cli-qunit doesn't need to be added.

- Run `yarn install`.

- Run `yarn run test` and make sure all tests pass.  There might be deprecation warnings and breakages to fix.

- After a CI build, ensure that the same number of screenshots have been taken, and that no unexpected visual diffs are present.
