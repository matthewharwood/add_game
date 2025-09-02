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
        @import url('/css/variables.css');

        :host {
          display: block;
          grid-row: 1 / 3;
          grid-column: 3 / 7;
          padding: 24px 0 0 0;
          box-sizing: border-box;
        }

        .enemy-wrapper {
          width: 100%;
          height: 100%;
          border: 2px solid var(--color-border-default);
          border-radius: 8px;
          background-color: var(--color-bg-secondary);
          box-shadow: var(--shadow-md);
          box-sizing: border-box;
        }


        .flex-top-grid {
            flex-direction: row;
            display: flex;
            width: 100%;
            height: 90%;
        }
        .enemy-portrait {
            width: 50%;
        }
        .enemy-info {
            width: 50%;
        }
        .enemy-health {
            height: 10%;
            background-color: var(--color-bg-secondary);
            width: 100%;
            display: flex;
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
      <div class="enemy-wrapper">

            <div class="flex-top-grid">
              <div class="enemy-portrait">

              </div>
              <div class="enemy-info">

              </div>
            </div>

            <div class="enemy-health">
                
            </div>

      </div>
    `;
  }
}

customElements.define('enemy-container', EnemyContainer);

export default EnemyContainer;
