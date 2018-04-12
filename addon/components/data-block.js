import Component from '@ember/component';
import layout from '../templates/components/data-block';
import { assert } from '@ember/debug';
import { join } from '@ember/runloop';
import { get } from '@ember/object';

export default Component.extend({
  layout,
  tagName: '',
  loading: null,
  isLoading: false,
  error: null,
  errorObj: null,

  model() {
    assert('When extending {{data-block}} the model hook should be implemented.');
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this._model = this.model;
    this._main();
  },

  _main() {
    this.set('model', null);
    this.set('errorObj', null);
    this.set('isLoading', true);

    let model = this._model();

    if (model.then) {
      model
        .then(
          (model) => {
            join(this, function() {
              if (!get(this, 'isDestroying') && !get(this, 'isDestroyed')) {
                this.set('model', model);
                this.set('isLoading', false);
              }
            });
          },
          (error) => {
            join(this, function() {
              if (!get(this, 'isDestroying') && !get(this, 'isDestroyed')) {
                this.set('errorObj', error);
              }
            });
          }
        );
    } else {
      this.set('model', model);
      this.set('isLoading', false);
    }
  }

});
