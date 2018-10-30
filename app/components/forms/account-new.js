import {computed, get} from '@ember/object';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import {inject as service} from '@ember/service';
import EnsureStatefulLogin from 'percy-web/mixins/ensure-stateful-login';
import AccountNewValidations from 'percy-web/validations/account-new';
import $ from 'jquery';
import utils from 'percy-web/lib/utils';
import BaseFormComponent from './base';

export default BaseFormComponent.extend(EnsureStatefulLogin, {
  session: service(),
  store: service(),
  model: null,
  validator: AccountNewValidations,

  changeset: computed('model', 'validator', function() {
    // Model is not actually used as we have a custom save method
    let model = this.get('model');
    let validator = this.get('validator') || {};

    return new Changeset(model, lookupValidator(validator), validator);
  }),

  actions: {
    save() {
      let changeset = this.get('changeset');

      changeset.validate();

      if (get(changeset, 'isValid')) {
        let desiredPassword = changeset.get('changes')[0]['value'];

        this.set('isSaveSuccessful', null);
        this.set('isSaving', true);
        this.set('errorMessage', null);

        $.ajax({
          type: 'POST',
          url: utils.buildApiUrl('identities'),
          data: {data: {attributes: {password: desiredPassword}}},
        })
          .done(() => {
            this.set('isSaveSuccessful', true);
            this.get('saveSuccess')();
          })
          .fail(response => {
            let errorData = response.responseJSON['errors'];

            errorData.forEach(error => {
              if (error['detail']) {
                changeset.addError('password', [error['detail']]);
              }
            });

            this.set('isSaveSuccessful', false);
          })
          .always(() => {
            this.set('isSaving', false);
          });
      }
    },
  },
});
