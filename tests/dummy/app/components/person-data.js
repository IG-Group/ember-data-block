import DataBlock from 'ember-data-block/components/data-block';

export default DataBlock.extend({
  id: null,
  model() {
    const id = this.get('id');
    return new Promise(function(resolve, reject) {
      if (id === 1) {
        window.setTimeout(resolve, 3000, { name: 'Luke' });
      } else {
        window.setTimeout(reject, 3000, { message: '404' });
      }
    });
  }
});
