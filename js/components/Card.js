class Card extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const isOperator = this.classList.contains('operator-card');
    const operatorType = this.getAttribute('data-operator');
    const content = this.textContent || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
        }

        .card {
          width: 100%;
          height: 100%;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
          position: relative;
          overflow: hidden;
        }

        /* Regular card styles */
        .card:not(.operator) {
          background: var(--gradient-primary);
          color: var(--color-text-inverse);
          border: 2px solid var(--color-border-default);
        }

        .card:not(.operator):hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        /* Operator card styles */
        .card.operator {
          background: var(--color-bg-tertiary);
          border: 2px solid var(--color-accent-primary);
          color: var(--color-accent-primary);
          position: relative;
        }

        .card.operator::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            transparent 30%,
            rgba(127, 219, 202, 0.1) 50%,
            transparent 70%
          );
          pointer-events: none;
        }

        .card.operator[data-operator="add"] {
          font-size: 3rem;
          font-family: var(--font-mono);
        }

        .card.operator[data-operator="equals"] {
          font-size: 3rem;
          font-family: var(--font-mono);
        }


        /* Number display */
        .card-value {
          font-size: 2rem;
          font-family: var(--font-mono);
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* Operator display */
        .operator-symbol {
          font-size: 3rem;
          font-family: var(--font-mono);
          text-shadow: 0 2px 8px rgba(127, 219, 202, 0.4);
          position: relative;
          z-index: 1;
        }
      </style>

      <div class="card ${isOperator ? 'operator' : ''}" ${operatorType ? `data-operator="${operatorType}"` : ''}>
        ${isOperator 
          ? `<span class="operator-symbol">${content}</span>` 
          : `<span class="card-value">${content}</span>`
        }
      </div>
    `;
  }
}

customElements.define('game-card', Card);

export default Card;
