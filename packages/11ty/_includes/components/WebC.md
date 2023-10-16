See https://www.11ty.dev/docs/languages/webc/

## `<script webc:setup>`
**`my-form-component.webc`**
```html
<form>
  <template webc:nokeep webc:for="field $data.formFields">
    <label for="field.id" @html="humanize(field.name)">
	<input id="field.id" :value="field.defaultValue" />
  </template>
</form>
<script webc:setup>
const humanize = (string) => {
   //...
}
</script>
```
**`webc:setup`** blocks are used alongside component templates. They:
- have access to `11ty` context / all registered shortcodes
- provide a place to define static data and helper functions
- do *not* have access to WebC properties or `$data` (global or front matter data). This data is only available in the component template or in **`webc:type="js"`** blocks.

## `<script webc:type="js">`
**`my-hello-component.webc`**
```html
<script webc:type="js">
console.log('hello') // > 'hello' in build console
`<div class="my-hello-component">hello</div>`
</script>
```
**`webc:type="js"`** blocks are render functions that *replace* component templates. The final line gets rendered to the DOM -- no `return` statement required

## `<script webc:keep type="text/javascript">`
**`my-interactive-component.webc`**
```html
<div>
  <button data-alert-button>Click Me</button>
</div>
<script webc:keep type="text/javascript">
const button = this.querySelectorAll('[data-alert-button]');
window.customElements.define('my-interactive-component', class extends HTMLElement {
  connectedCallback() {
    const button = this.querySelector('[data-alert-button]');
	button.addEventListener('click', () => {
      alert('CLICKED!');
	});
  }
</script>
```
**`type="text/javascript"`** blocks are regular client-side `<script>` tags.
- they need to be `webc:keep`'d if WebC's bundler is not being used
- setup event listeners and client-side functionality

## Using a WebC component
The most straightforward way to render a WebC component is in a WebC layout:
**`layout.webc`**
```html
---
layout: base
---
<section class="my-component-section">
  <my-component gradoo="Gradoo" />
</section>
```
**`my-component.webc`**
```html
<div class="my-component" @text="gradoo"></div>
```

Alternatively, you can use `renderTemplate()` when calling it from a different layout context:

**`layout.liquid`**
```html
---
layout: base.liquid
---
{% renderTemplate "webc" %}
<my-component gradoo="Gradoo"></my-component>
{% endrenderTemplate %}
```

**`layout.11ty.js`**
```js
module.exports = {
  data: {
    layout: "base.11ty.js",
  },
  async render() {
    return await this.renderTemplate(
      '<my-component gradoo="Gradoo"></my-component',
      'webc'
    );
  }
}
```

## Bundling styles + scripts
See https://www.11ty.dev/docs/languages/webc/#css-and-js-(bundler-mode)
**`my-component.webc`**
```html
<div class="my-component" @text="gradoo"></div>
<style webc:keep>
.my-component {
  background: lemonchiffon;
}
</style>
```
Like `<script>` tags, `<style>` tags need `webc:keep` to add them to the DOM. To avoid this, add the bundled assets to a layout:
**`base-layout.webc`**
```html
<!doctype html>
<html lang="$data.publication.language">
  <head>
    <meta charset="UTF-8"/>
    <title @text="$data.publication.title"></title>
    <style webc:keep @raw="getBundle('css')"></style>
    <script webc:keep @raw="getBundle('js')"></script>
  </head>
  <body>
    <main @raw="content"></main>
  </body>
</html>
```
**`my-component.webc`**
```html
<div class="my-component" @text="gradoo"></div>
<style>
/* these styles are now part of the bundle */
.my-component {
  background: lemonchiffon;
}
</style>
```

## Properties + dynamic attributes
See https://www.11ty.dev/docs/languages/webc/#dynamic-attributes-and-properties
Regular text attributes work as expected:
**`my-component.webc`**
```html
<div class="my-component" @text="gradoo"></div>
```
**`layout.webc`**
```html
---
layout: base
---
<section class="my-component-section">
  <my-component gradoo="Gradoo" />
</section>
```
rendered DOM:
```html
<section class="my-component-section">
  <my-component gradoo="Gradoo">
    <div class="my-component">Gradoo</div>
  </my-component>
</section>
```

Dynamic attributes are prefixed with a `:`.
**`layout.webc`**
```html
---
layout: base
---
<section class="my-component-section">
  <my-component :gradoo="gradoo" />
</section>
<script webc:setup>
const gradoo = "Gradoo!!"
</script>
```
rendered DOM:
```html
<section class="my-component-section">
  <my-component gradoo="Gradoo!!">
    <div class="my-component">Gradoo!!</div>
  </my-component>
</section>
```

Dynamic properties are prefixed with a `:@`. Use a dynamic property when you need "private" component properties:
**`layout.webc`**
```html
---
layout: base
---
<section class="my-component-section">
  <my-component :@gradoo="gradoo" />
</section>
<script webc:setup>
const gradoo = "Gradoo!!"
</script>
```
rendered DOM:
```html
<section class="my-component-section">
  <my-component>
    <div class="my-component">Gradoo</div>
  </my-component>
</section>
```
## Passing data from server to client

When we need to pass server-side data (11ty context) to the client, we do so by embedding it as JSON in a `<script type="application/json">` tag:

**`component-data.webc`**
```html
<script data-component webc:keep type="application/json" @raw="JSON.stringify(data)">
</script>
```

Then we can have access to it via `querySelector`:

**`my-component.webc`**
```html
<template webc:nokeep>
  <component-data :data="$data.my_component"></component-data>
  <button data-button>Show me the data</button>
</template>
<script webc:setup>
const data = {} // something from the 11ty context
</script>
<script webc:keep type="text/javascript">
// Use component data in client-side logic
window.customElements.define('my-component', class extends HTMLElement {
  connectedCallback() {
    const button = this.querySelector('[data-button]');
	button.addEventListener('click', () => {
	  console.log('DATA', this.data);
	});
  }

  // get the data from the `<script type="application/json">` block
  get data() {
    const componentDataElement = this.querySelector('[data-component]');
    return JSON.parse(componentDataElement.textContent);
  }
});
</script>
```
