import './components/EnemyContainer.js';
import './components/BottomNavContainer.js';
import './components/CardsContainer.js';
import './components/CardSlot.js';
import './components/SettingsButton.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Web Components loaded and ready');
  
  // Get the cards container element
  const cardsContainer = document.querySelector('cards-container');
  
  if (cardsContainer) {
    // Create 8 card slots
    for (let i = 1; i <= 8; i++) {
      const cardSlot = document.createElement('game-card-slot');
      cardSlot.setAttribute('slot-index', i);
      cardsContainer.appendChild(cardSlot);
    }
    
    // Listen for card-dropped events
    cardsContainer.addEventListener('card-dropped', (event) => {
      console.log('Card dropped in slot:', event.detail);
    });
  }
});