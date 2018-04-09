import DataBlock from 'ember-data-block/components/data-block';
import { run } from '@ember/runloop';
import Object from '@ember/object';

export default DataBlock.extend({
  model() {
    const model = Object.create({ name: '...' });

    window.setTimeout(() => {
      run(function() {
        model.set('name', 'Fred');
      });
    }, 2000);

    return model;
  }
});
