ember-data-block
==============================================================================

**ember-data-block** is an Ember Addon that provides a base class that can be
extended by components that want to load data with a similar API to Ember's
Route. This can be useful for building dashboards where the user can configure
their own UI comprising multiple views that in a conventional app would likely
be organised into multiple routes.

Installation
------------------------------------------------------------------------------

Install this addon into your Ember app by running the following command from
your project's directory.
```
ember install ember-data-block
```


Usage
------------------------------------------------------------------------------
Here we create a PersonData component by extending DataBlock. Just like when we extend a **Route** in a conventional app we need to implement the `model` hook.

```
// ../components/person-data.js
import DataBlock from 'ember-data-block/components/data-block';

export default DataBlock.extend({

  model() {
    return new Promise(function(resolve, reject) {
      window.setTimeout(resolve, 2000, { name: 'Luke' });
    });
  }

});
```
We can then use person data in our app where we need it.
```
{{person-data as | model |}}
  <p>Hi {{model.name}}</p>
{{/person-data}}
```
**Note:** Using this approach it's surprisingly easy to move data owning components around in your app templates which makes it easy to refactor to support *data down actions up* without being tempted to cheat.

### Loading states

Just like when using Ember's routing we can tell the route what to display while it's loading. However, we specify this as the name of the component to use.

```
{{person-data loading="person-spinner" as | model |}}
  <p>Hi {{model.name}}</p>
{{/person-data}}
```
The above code will attempt to render a `person-spinner` component using the **component helper** behind the scenes.

When a loading component is not provided, the component will render nothing whilst the model promise resolves.

### Error states

Just like when using Ember's routing we can tell the route what to display when there's an error. However, we specify this as the name of the component to use.

```
{{person-data error="person-error" as | model |}}
  <p>Hi {{model.name}}</p>
{{/person-data}}
```

The above code will attempt to render a `person-error` component using the **component helper** behind the scenes.

When an error component is not provided, the component will render nothing in the case of an error.

### Showing the contents during loading

There may be cases where you want the UI to load before the data is available. In this case you should return an object as the model and then update the model once the data has loaded.
```
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
```

Contributing
------------------------------------------------------------------------------

### Installation

* `git clone https://github.com/IG-Group/ember-data-block.git`
* `cd ember-data-block`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `npm test` – Runs `ember try:each` to test your addon against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
