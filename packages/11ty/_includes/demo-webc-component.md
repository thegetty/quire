# A WebC component template

``` html
<script>
if (!window.customElements.get('demo-component')) {
  window.customElements.define('demo-component', class extends HTMLElement {
    constructor() {
      super();
      /* init component data */
      this.index = 0;
    }

    connectedCallback() {
      /* data is passed through attributes */
      /* <demo-component start-index="0"></demo-component> */
      this.index = this.getAttribute('start-index');

      /* Set up shadow DOM with a root element */
      this.innerHTML = `<div class="demo-component"></div>`;
      this.firstElementChild.attachShadow({ mode: 'open' });
      this.root = this.firstElementChild.shadowRoot;

      this.root.innerHTML = `<h1>Demo</h1><p :@text="${this.index}"></p>`;

      /* Set up event listeners */
      this.addEventListener('click', this.handleClick);

      /* have to style shadow DOM elements like this 😓 */
      const shadowStyles = `
:host {
  position: relative;
  background: black;
}

h1, p {
  font-family: monospace;
  color: white;
}
      `;
      this.root.innerHTML += `<style>${shadowStyles}</style>`;
    }

    handleClick() {
      this.index++;
    }
  });
}
</script>
<style>
/* a custom element can only be selected/styled in the global scope */
demo-component {}
</style>
<style webc:scoped>
/* non-shadow DOM child elements can be styled here */
</style>
```
