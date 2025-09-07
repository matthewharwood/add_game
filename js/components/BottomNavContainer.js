import { Game } from '../services/storage.js';
import './Card.js';

class BottomNavContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.createCardElements();
  }

  createCardElements() {
    const navContent = this.shadowRoot.querySelector('.nav-content');
    
    // Clear any existing content in the slot
    navContent.innerHTML = '';
    
    // Create 5 game-card elements from the cards in storage
    if (Game.cards && Game.cards.length > 0) {
      Game.cards.slice(0, 5).forEach((card, index) => {
        const gameCard = document.createElement('game-card');
        gameCard.textContent = card.value;
        gameCard.setAttribute('data-card-id', card.id);
        gameCard.setAttribute('data-index', index);
        gameCard.classList.add('nav-card');
        navContent.appendChild(gameCard);
      });
    }
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
          gap: 0.5rem;
        }

        .nav-content ::slotted(game-card),
        .nav-content game-card {
          flex: 1;
          max-width: 120px;
          aspect-ratio: 2/3;
          cursor: grab;
        }

        .nav-content ::slotted(game-card:active),
        .nav-content game-card:active {
          cursor: grabbing;
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
          
          .nav-content ::slotted(game-card),
          .nav-content game-card {
            max-width: 80px;
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
