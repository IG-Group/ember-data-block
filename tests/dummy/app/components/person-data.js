import DataBlock from 'ember-data-block/components/data-block';

export default DataBlock.extend({
  id: null,
  model() {
    const id = this.get('id');
    return new Promise(function(resolve, reject) {
      if (id === 1) {
        window.setTimeout(resolve, 2000, { name: 'Fred' });
      } else {
        window.setTimeout(reject, 2000, { message: '404' });
      }
    });
  }
});
