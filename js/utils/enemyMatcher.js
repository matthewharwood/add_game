import { enemies } from '../data/enemy_data.js';

/**
 * Finds the closest enemy by level, counting backwards if exact match not found
 * @param {number} targetLevel - The level to match
 * @returns {Object} The matched enemy object
 * @throws {Error} If no enemy can be found
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
  
  // If no enemy found counting backwards, try to return the first enemy (level 1)
  const firstEnemy = enemies.find(e => e.level === 1);
  
  if (!firstEnemy) {
    throw new Error(`No enemy found for level ${targetLevel} or any lower level. Enemy data may be missing.`);
  }
  
  return firstEnemy;
}