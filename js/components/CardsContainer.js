class CardsContainer extends HTMLElement {
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
          grid-row: 3 / 5;
          grid-column: 1 / 9;
        }

        .cards-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          padding: 1rem;
          height: 100%;
          box-sizing: border-box;
        }

        .card {
          aspect-ratio: 3/4;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.3s;
        }

        .card:hover {
          transform: translateY(-4px);
        }

        /* Tablet Styles */
        @media (max-width: 1024px) and (min-width: 769px) {
          :host {
            grid-row: 2 / 4;
            grid-column: 1 / 6;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          :host {
            grid-row: 3 / 6;
            grid-column: 1 / 6;
          }
        }
      </style>
      <div class="cards-content">
        <slot>Cards</slot>
      </div>
    `;
  }
}

customElements.define('cards-container', CardsContainer);

export default CardsContainer;
