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
    
    // Clear any existing content
    navContent.innerHTML = '';
    
    // Create 5 card slots in the nav
    for (let i = 0; i < 5; i++) {
      const cardSlot = document.createElement('div');
      cardSlot.classList.add('nav-card-slot');
      cardSlot.setAttribute('data-slot-index', i);
      
      // Add the card to its slot if it exists
      if (Game.cards && Game.cards[i]) {
        const gameCard = document.createElement('game-card');
        gameCard.textContent = Game.cards[i].value;
        gameCard.setAttribute('data-card-id', Game.cards[i].id);
        gameCard.setAttribute('data-nav-index', i);
        gameCard.classList.add('nav-card');
        cardSlot.appendChild(gameCard);
      }
      
      navContent.appendChild(cardSlot);
    }
  }
  
  canAcceptCard(card) {
    // Bottom nav can always accept cards back
    return !card.classList.contains('operator-card');
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
        
        .nav-card-slot {
          flex: 1;
          max-width: 120px;
          aspect-ratio: 2/3;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          position: relative;
        }
        
        .nav-card-slot:empty::after {
          content: attr(data-slot-index);
          position: absolute;
          color: rgba(255, 255, 255, 0.1);
          font-size: 2rem;
          font-family: var(--font-mono);
        }

        .nav-content ::slotted(game-card),
        .nav-content game-card {
          width: 100%;
          height: 100%;
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
          
          .nav-card-slot {
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
