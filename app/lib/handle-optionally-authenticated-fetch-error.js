export default function handleOptionallyAuthenticatedFetchError(e, currentUser, router) {
  // If we get a 403 or other error it is probably because the org/project is not public
  // (or it doesn't exist)
  if (currentUser) {
    // If there's a user and they are asking for a project they don't have access to AND
    // it's not public, show the error state.
    const errorString = e.toString();
    throw errorString.includes('401') ? {errors: [{status: 'forbidden'}]} : new Error(e);
  } else {
    // If there's no user, maybe the logged in user has access to the project.
    router.transitionTo('login');
  }
}
