import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { find } from 'ember-native-dom-helpers';
import Component from '@ember/component';

module('Integration | Component | data-block', function(hooks) {
  setupRenderingTest(hooks);

  // test('it throws an error.', async function(assert) {
  //   try {
  //     await render(hbs`{{data-block}}`);
  //   } catch (e) {
  //     assert.ok(true)
  //   }
  // });

  test('it does not introduce markup into the dom structure (is tagless)', async function(assert) {
    this.set('model', function() {return {}});
    await render(hbs`
      <section class="test-parent">
        {{#data-block model=model}}
          <p class="test-child"></p>
        {{/data-block}}
      </section>
    `);
    assert.equal(find('.test-child').parentNode, find('.test-parent'));
  });

  module('Given an object is returned from the model hook', function(hooks) {
    hooks.beforeEach(async function() {
      this.setProperties({
        modelFn: function() { return { name: 'fake-name' } },
        error: 'error-component',
      });
      await render(hbs`
          {{#data-block model=modelFn as |model|}}
            <p class="test-child">{{model.name}}</p>
          {{/data-block}}
      `);
    });
    test('it renders the provided block', function(assert) {
      assert.ok(find('.test-child'));
    });
    test('it exposes the result to its inner block', function(assert) {
      assert.equal(find('.test-child').textContent, 'fake-name');
    });
  });

  module('Given a thenable (a promise-like object) is returned from the model hook', function() {
    test('it renders blank then renders content with data', async function(assert) {
      let resolvePromise;
      this.set('modelFn', () => {
        return new Promise(function(resolve) {
          resolvePromise = resolve;
        });
      });

      await render(hbs`
        {{#data-block model=modelFn as |model|}}
          <p class="test-child">{{model.name}}</p>
        {{/data-block}}
      `);
      assert.equal(this.element.textContent.trim(), '');

      await resolvePromise({name: 'fake-name'});

      assert.ok(find('.test-child'));
      assert.equal(find('.test-child').textContent, 'fake-name');
    });

    module('Given a thenable and a loading template', function() {
      test('it renders a loading component then renders content with data', async function(assert) {
        let resolvePromise;
        this.set('modelFn', () => {
          return new Promise(function(resolve) {
            resolvePromise = resolve;
          });
        });

        this.owner.register('component:loading-component', Component.extend({ layout: hbs`loading` }));
        this.set('loading', 'loading-component');

        await render(hbs`
          {{#data-block model=modelFn loading=loading as |model|}}
            <p class="test-child">{{model.name}}</p>
          {{/data-block}}
        `);
        assert.equal(this.element.textContent.trim(), 'loading');

        await resolvePromise({name: 'fake-name'});

        assert.ok(find('.test-child'));
        assert.equal(find('.test-child').textContent, 'fake-name');
      });
    });

    module('Given a thenable rejection and an error component', function() {
      test('it renders a blank then renders the error component', async function(assert) {
        let rejectPromise;
        this.set('modelFn', () => {
          return new Promise(function(resolve, reject) {
            rejectPromise = reject;
          });
        });

        this.owner.register('component:error-component', Component.extend({ layout: hbs`error` }));
        this.set('error', 'error-component');

        await render(hbs`
          {{#data-block model=modelFn error=error as |model|}}
            <p class="test-child">{{model.name}}</p>
          {{/data-block}}
        `);
        assert.equal(this.element.textContent.trim(), '');

        await rejectPromise({name: 'fake-name'});

        assert.notOk(find('.test-child'));
        assert.equal(this.element.textContent.trim(), 'error');
      });
    });
  });
});
