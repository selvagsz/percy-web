import {on} from '@ember/object/evented';
import {computed, get, trySet} from '@ember/object';
import {inject as service} from '@ember/service';
import Component from '@ember/component';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import timeoutForEnv from 'percy-web/lib/timeout-for-env';
import {later} from '@ember/runloop';
import utils from 'percy-web/lib/utils';

export default Component.extend({
  // To be defined by superclass:
  model: null,
  validator: null,

  isSaving: false,
  isSaveSuccessful: null,
  errorMessage: null,
  confirmationMessage: null,

  store: service(),
  changeset: computed('model', 'validator', function() {
    let model = this.get('model');
    let validator = this.get('validator') || {};

    return new Changeset(model, lookupValidator(validator), validator);
  }),
  focusOnInsert: on('didInsertElement', function() {
    // We can't only use autofocus=true because it apparently only works on first load.
    this.$('[autofocus]').focus();
  }),

  _successIndicatorTimeout: timeoutForEnv(3000),

  actions: {
    saving(promise) {
      this.set('isSaveSuccessful', null);
      this.set('isSaving', true);
      this.set('errorMessage', null);
      promise.then(
        () => {
          this.set('isSaving', false);
          this.set('isSaveSuccessful', true);
          later(() => {
            trySet(this, 'isSaveSuccessful', null);
          }, this.get('_successIndicatorTimeout'));
        },
        errors => {
          this.set('isSaving', false);
          this.set('isSaveSuccessful', false);
          if (errors && errors.errors && errors.errors[0].detail) {
            this.set('errorMessage', errors.errors[0].detail);
          } else {
            this.set('errorMessage', 'An unhandled error occured');
            throw errors;
          }
        },
      );
    },

    validateProperty(changeset, property) {
      return changeset.validate(property);
    },

    save() {
      let model = this.get('model');
      let changeset = this.get('changeset');

      changeset.validate();

      if (get(changeset, 'isValid')) {
        let savingPromise = changeset.save();
        this.send('saving', savingPromise);

        savingPromise
          .then(model => {
            // Bubble the successfully saved model upward, so the route can react to it.
            this.sendAction('saveSuccess', model);
            changeset.rollback();
          })
          .catch(() => {
            // TODO: clean this up when this issue is addressed:
            // https://github.com/DockYard/ember-changeset/issues/100
            let errorData = {};
            this.get('model.errors').forEach(({attribute, message}) => {
              if (!errorData[attribute]) {
                errorData[attribute] = [];
              }
              errorData[attribute].push(message);
            });
            Object.keys(errorData).forEach(key => {
              changeset.addError(key, errorData[key]);
            });
            // Make sure the model dirty attrs are rolled back (not for new, unsaved records).
            // TODO: this causes flashing when page state is bound to a model attribute that is
            // dirtied by the changeset save(), but it's better than leaving the model dirty
            // and having page state be out of date. Better way to handle this?
            if (!model.get('isNew')) {
              model.rollbackAttributes();
            }
          });
      }
    },
    delete(confirmationMessage) {
      let model = this.get('model');
      let store = this.get('store');
      let afterDeleteCallback = this.get('afterDelete');
      // Delete the record on the server
      // and remove the associated record from the store
      if (confirmationMessage && !utils.confirmMessage(confirmationMessage)) {
        return;
      }
      return model.destroyRecord().then(() => {
        store.unloadRecord(model);
        if (afterDeleteCallback) {
          afterDeleteCallback();
        }
      });
    },
  },
});
