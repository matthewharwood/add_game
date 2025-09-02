class BottomNavContainer extends HTMLElement {
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

          color: white;
          grid-row: 5 / 6;
          grid-column: 3 / 7;
        }

        .nav-content {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 1rem;
          height: 100%;
          box-sizing: border-box;
        }

        .nav-item {
          padding: 0.5rem 1rem;
          cursor: pointer;
          transition: background-color 0.3s;
          border-radius: 4px;
        }

        .nav-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        /* Tablet Styles */
        @media (max-width: 1024px) and (min-width: 769px) {
          :host {
            grid-row: 4 / 5;
            grid-column: 2 / 5;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          :host {
            grid-row: 6 / 7;
            grid-column: 2 / 5;
          }
        }
      </style>
      <nav class="nav-content">
        <slot>Nav</slot>
      </nav>
    `;
  }
}

customElements.define('bottom-nav-container', BottomNavContainer);

export default BottomNavContainer;
