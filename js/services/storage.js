import { openDB } from 'idb';

// Game state structure
export const Game = {
  cards: [],        // Array of card objects with {id, value, slotIndex}
  coins: 0,         // Current game coins (renamed from score)
  level: 1,         // Current game level (now represents enemy level)
  cardCount: 5,     // Number of cards (difficulty)
  numberRange: 10,  // Maximum number range
  timestamp: null,  // Last save timestamp
  enemy: null,      // Current enemy state {enemy, currentHealth}
  config: {         // Default loading rules configuration
    nCards: 5,      // Number of cards to generate
    defaultStart: 0,    // Starting number range
    defaultEnd: 100     // Ending number range
  }
};

// Database configuration
const DB_NAME = 'AddGameDB';
const DB_VERSION = 1;
const STORE_NAME = 'gameState';

// Initialize the database
export const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create the game state store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp');
      }
    },
  });
  
  return db;
};

// Save game state to IndexedDB
export const saveGameState = async () => {
  try {
    const db = await initDB();
    
    // Add id and timestamp to the Game object for storage
    const gameStateToSave = {
      ...Game,
      id: 'currentGame',  // Fixed ID so we always update the same record
      timestamp: new Date().toISOString()
    };
    
    // IDB library handles transactions automatically
    await db.put(STORE_NAME, gameStateToSave);
    console.log('Game state saved to IndexedDB:', gameStateToSave);
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};

// Load game state from IndexedDB
export const loadGameState = async () => {
  try {
    const db = await initDB();
    
    // IDB library handles transactions automatically
    const savedState = await db.get(STORE_NAME, 'currentGame');
    
    if (savedState) {
      // Update the Game object with saved state
      Object.keys(savedState).forEach(key => {
        if (key !== 'id' && Game.hasOwnProperty(key)) {
          Game[key] = savedState[key];
        }
      });
      console.log('Game state loaded from IndexedDB:', savedState);
      return true;
    }
    
    console.log('No saved game state found');
    return false;
  } catch (error) {
    console.error('Error loading game state:', error);
    return false;
  }
};

// Update enemy in game state
export const updateEnemy = async (enemy) => {
  if (!enemy) {
    throw new Error('No enemy provided to update');
  }
  
  // Store the enemy with current health initialized to max health
  Game.enemy = {
    ...enemy,
    currentHealth: enemy.health,
    maxHealth: enemy.health
  };
  
  // Save the updated state to IndexedDB
  await saveGameState();
  
  console.log('Enemy updated in game state:', Game.enemy);
  return Game.enemy;
};

// Export database configuration for use in other modules
export const dbConfig = {
  name: DB_NAME,
  version: DB_VERSION,
  storeName: STORE_NAME
};