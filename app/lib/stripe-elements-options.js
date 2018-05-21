// options available https://stripe.com/docs/stripe-js/reference#element-options
export default {
  hidePostalCode: true,
  style: {
    base: {
      color: '#3f3a40',
      fontWeight: 500,
      fontSize: '16px',
      fontSmoothing: 'antialiased',

      ':focus': {
        color: '#3f3a40',
      },

      '::placeholder': {
        color: '#a69fa8',
      },

      ':focus::placeholder': {
        color: '#a69fa8',
      },
    },
    invalid: {
      color: '#da2e1b',
      ':focus': {
        color: '#FA755A',
      },
      '::placeholder': {
        color: '#FFCCA5',
      },
    },
  },
};
