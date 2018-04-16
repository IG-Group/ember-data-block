import Component from '@ember/component';
import layout from '../templates/components/data-block';
import { assert } from '@ember/debug';
import { run } from '@ember/runloop';
import { get } from '@ember/object';

export default Component.extend({
  layout,
  tagName: '',
  loading: null,
  isLoading: false,
  error: null,
  errorObj: null,
  results: null,

  model() {
    assert('When extending {{data-block}} the model hook should be implemented.');
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this._main();
  },

  _main() {
    this.set('result', null);
    this.set('errorObj', null);
    this.set('isLoading', true);

    let result = this.model();

    if (result && result.then) {
      result
        .then(
          (result) => {
            run(this, function() {
              if (!get(this, 'isDestroying') && !get(this, 'isDestroyed')) {
                this.set('result', result);
                this.set('isLoading', false);
              }
            });
          },
          (error) => {
            run(this, function() {
              if (!get(this, 'isDestroying') && !get(this, 'isDestroyed')) {
                this.set('errorObj', error);
              }
            });
          }
        );
    } else {
      this.set('result', result);
      this.set('isLoading', false);
    }
  }

});
