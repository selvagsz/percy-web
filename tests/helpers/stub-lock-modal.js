import sinon from 'sinon';

// using ember-simple-auth-auth0 test helper as a template:
// stub a required thing on the auth0 service, which _is_ available from the registry.
// You must pass in the application context
// (in most tests this will look like `stubLockModal(this.application)`)
export default function stubLockModal(application) {
  const {__container__: container} = application;
  const auth0 = container.lookup('service:auth0');
  auth0.set('test_getAuth0LockInstance', auth0.getAuth0LockInstance.bind(auth0));

  auth0.getAuth0LockInstance = function() {
    return {
      on: sinon.stub(),
      show: sinon.stub(),
    };
  }.bind(auth0);
}

// export default function stubLockModal(application) {
//   const {__container__: container} = application;
//   const auth0 = container.lookup('service:auth0');
//   auth0.set('test_getAuth0LockInstance', auth0.getAuth0LockInstance.bind(auth0));

//   auth0.getAuth0LockInstance = function() {
//     return {
//       on: sinon.stub(),
//       show: sinon.stub(),
//     };
//   }.bind(auth0);
// }
