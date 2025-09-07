import './components/EnemyContainer.js';
import './components/BottomNavContainer.js';
import './components/CardsContainer.js';
import './components/CardSlot.js';
import './components/Card.js';
import './components/SettingsButton.js';
import { Game, initDB, loadGameState, saveGameState, initializeQuestion, updateQuestion } from './services/storage.js';
import { createRandomNumberGenerator } from './utils/helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Web Components loaded and ready');
  
  // Initialize database
  await initDB();
  
  // Try to load existing game state from IndexedDB
  const stateLoaded = await loadGameState();
  
  // Initialize question array based on mode
  initializeQuestion();
  
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
    // Create card slots based on the number of cards in the Game state
    const numberOfSlots = Game.cards ? Game.cards.length : 0;
    
    for (let i = 1; i <= numberOfSlots; i++) {
      const cardSlot = document.createElement('game-card-slot');
      cardSlot.setAttribute('slot-index', i);
      
      // If mode is 'add', create operator cards for specific slots
      if (Game.mode === 'add') {
        if (i === 2) {
          // Add plus operator card
          const plusCard = document.createElement('game-card');
          plusCard.classList.add('operator-card');
          plusCard.setAttribute('data-operator', 'add');
          plusCard.textContent = '+';
          cardSlot.appendChild(plusCard);
        } else if (i === 4) {
          // Add equals operator card
          const equalsCard = document.createElement('game-card');
          equalsCard.classList.add('operator-card');
          equalsCard.setAttribute('data-operator', 'equals');
          equalsCard.textContent = '=';
          cardSlot.appendChild(equalsCard);
        }
      }
      
      cardsContainer.appendChild(cardSlot);
    }
    
    console.log(`Created ${numberOfSlots} card slots based on cards array`);
    
    // Listen for card-dropped events
    cardsContainer.addEventListener('card-dropped', (event) => {
      console.log('Card dropped in slot:', event.detail);
      // Update question array when a card is dropped
      if (event.detail && event.detail.slotIndex && event.detail.value !== undefined) {
        updateQuestion(event.detail.slotIndex, event.detail.value);
        saveGameState(); // Save the updated state
      }
    });
  }
});