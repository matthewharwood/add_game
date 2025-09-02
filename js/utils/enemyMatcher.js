import { enemies } from '../data/enemy_data.js';

/**
 * Finds the closest enemy by level, counting backwards if exact match not found
 * @param {number} targetLevel - The level to match
 * @returns {Object|null} The matched enemy object or null if none found
 */
export function findClosestEnemyByLevel(targetLevel) {
  // First, try to find an exact match
  const exactMatch = enemies.find(enemy => enemy.level === targetLevel);
  if (exactMatch) {
    return exactMatch;
  }
  
  // If no exact match, count backwards to find the closest lower level
  let currentLevel = targetLevel - 1;
  
  while (currentLevel >= 1) {
    const enemy = enemies.find(e => e.level === currentLevel);
    if (enemy) {
      return enemy;
    }
    currentLevel--;
  }
  
  // If no enemy found counting backwards, return the first enemy (level 1)
  return enemies.find(e => e.level === 1) || null;
}