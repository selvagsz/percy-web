import setupAcceptance, {setupSession} from '../helpers/setup-acceptance';

describe('Acceptance: Error page', function() {
  setupAcceptance();

  setupSession(function(server) {
    server.create('user', 'withGithubIdentity');
  });

  it('displays 403 error', async function() {
    server.get('/organizations/not-an-org', {message: 'forbidden'}, 403);
    await visit('/organizations/not-an-org');
    click('[data-test-error-toggle]');
    await percySnapshot(this.test);
  });

  it('displays 404 error', async function() {
    server.get('/organizations/not-an-org', {message: 'not authorized'}, 404);
    await visit('/organizations/not-an-org');
    click('[data-test-error-toggle]');
    await percySnapshot(this.test);
  });

  it('displays catch-all error', async function() {
    server.get('/organizations/not-an-org', {message: 'bad things happened'}, 500);
    await visit('/organizations/not-an-org');
    click('[data-test-error-toggle]');
    await percySnapshot(this.test);
  });
});
