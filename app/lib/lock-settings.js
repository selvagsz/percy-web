export default {
  configurationBaseUrl: 'https://cdn.auth0.com',
  auth: {
    redirect: true,
    redirectUrl: `${window.location.origin}/api/auth/auth0/callback`,
    responseType: 'code',
    params: {},
  },
  languageDictionary: {
    title: 'Percy',
    emailInputPlaceholder: 'Email',
    passwordInputPlaceholder: 'Password',
    enterpriseLoginIntructions: 'Sign in with your corporate credentials.',
    lastLoginInstructions: 'Last time you signed in with',
    loginAtLabel: 'Sign in at %s',
    loginLabel: 'Sign In',
    loginSubmitLabel: 'Sign In',
    loginWithLabel: 'Sign in with %s',
    login: {
      password_change_required:
        'You need to update your password because this is the first time you are signing in, or because your password has expired.', // eslint-disable-line
      password_leaked:
        'We have detected a potential security issue with this account. To protect your account, we have blocked this signin. An email was sent with instruction on how to unblock your account.', // eslint-disable-line
      too_many_attempts:
        'Your account has been blocked after multiple consecutive sign in attempts.',
      'lock.fallback': "We're sorry, something went wrong when attempting to sign in.",
      'hrd.not_matching_email': 'Please, use your corporate email to sign in.',
    },
    success: {
      logIn: 'Thanks for signing in.',
      magicLink: 'We sent you a link to sign in<br />to %s.',
    },
  },
  theme: {
    logo: 'https://percy.io/static/images/percy-1f98595db6111fe2e1c86f8fbae815bc.svg',
    primaryColor: '#5c007b',
  },
  additionalSignUpFields: [
    {
      name: 'name',
      placeholder: 'Name',
      validator: function(name) {
        return {
          valid: name.length >= 1,
          hint: "Can't be blank",
        };
      },
    },
  ],
  socialButtonStyle: 'big',
  autoclose: true,
  autofocus: true,
  closable: true,
};
