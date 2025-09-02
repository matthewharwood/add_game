class CardSlot extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._occupied = false;
    this._highlighted = false;
    this._slotIndex = null;
  }

  connectedCallback() {
    this.render();

  }




  render() {
    const disabled = this.getAttribute('disabled') === 'true';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          aspect-ratio: 2/3;
          position: relative;
        }

        .slot {
          width: 100%;
          height: 100%;
          border: 2px dashed rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .slot.occupied {
          border-style: solid;
          border-color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.1);
        }

        .slot.highlighted {
          border-color: #4ade80;
          background: rgba(74, 222, 128, 0.1);
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(74, 222, 128, 0.3);
        }

        .slot.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }

        .slot-number {
          position: absolute;
          top: 8px;
          right: 12px;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 600;
          user-select: none;
        }

        .slot-content {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .empty-indicator {
          color: rgba(255, 255, 255, 0.2);
          font-size: 2rem;
          user-select: none;
        }

        /* Pulse animation for highlighted state */
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(74, 222, 128, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(74, 222, 128, 0);
          }
        }

        .slot.highlighted::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          border-radius: 8px;
          animation: pulse 1.5s infinite;
        }

        /* Shimmer effect for occupied slots */
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .slot.occupied::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
          pointer-events: none;
        }

        ::slotted(*) {
          width: 100%;
          height: 100%;
        }
      </style>

      <div class="slot">

        <div class="slot-content">
          <slot>
            <span class="empty-indicator">+</span>
          </slot>
        </div>
      </div>
    `;
  }
}

customElements.define('game-card-slot', CardSlot);

export default CardSlot;
