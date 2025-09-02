class EnemyContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background-color: #ccc;
          grid-row: 1 / 3;
          grid-column: 3 / 7;
        }

        .enemy-content {
          text-align: center;
          padding: 1rem;
          height: 100%;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Tablet Styles */
        @media (max-width: 1024px) and (min-width: 769px) {
          :host {
            grid-row: 1 / 2;
            grid-column: 2 / 5;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          :host {
            grid-row: 1 / 3;
            grid-column: 1 / 6;
          }
        }
      </style>
      <div class="enemy-content">
        <slot>Enemy</slot>
      </div>
    `;
  }
}

customElements.define('enemy-container', EnemyContainer);

export default EnemyContainer;
