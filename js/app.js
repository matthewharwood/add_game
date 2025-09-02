import './components/EnemyContainer.js';
import './components/BottomNavContainer.js';
import './components/CardsContainer.js';
import './components/CardSlot.js';
import './components/SettingsButton.js';
import { Game, initDB, loadGameState, saveGameState } from './services/storage.js';
import { createRandomNumberGenerator } from './utils/helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Web Components loaded and ready');
  
  // Initialize database
  await initDB();
  
  // Try to load existing game state from IndexedDB
  const stateLoaded = await loadGameState();
  
  // Check if cards already exist in Game state (either from load or need to generate)
  if (!stateLoaded || !Game.cards || Game.cards.length === 0) {
    // Generate new cards using config defaults
    const { nCards, defaultStart, defaultEnd } = Game.config;
    try {
      // Create the random number generator with defaults
      const randomGenerator = createRandomNumberGenerator(nCards, defaultStart, defaultEnd);
      // Generate random numbers using the defaults
      const randomNumbers = randomGenerator();
      
      // Convert numbers to card objects
      Game.cards = randomNumbers.map((value, index) => ({
        id: `card-${Date.now()}-${index}`,
        value: value,
        slotIndex: null  // Will be set when card is placed in a slot
      }));
      
      Game.timestamp = new Date().toISOString();
      console.log('Generated new cards:', Game.cards);
      
      // Save the generated cards to IndexedDB
      await saveGameState();
    } catch (error) {
      console.error('Error generating cards:', error);
    }
  } else {
    // Cards already exist, use them
    console.log('Using existing cards from IndexedDB:', Game.cards);
  }
  
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