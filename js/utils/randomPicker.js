/**
 * Picks a random element from an array
 * @param {Array} array - The array to pick from
 * @returns {*} A random element from the array, or undefined if array is empty
 */
export function pickRandom(array) {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return undefined;
  }
  
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

/**
 * Picks a random index from an array
 * @param {Array} array - The array to get index from
 * @returns {number} A random index, or -1 if array is empty
 */
export function pickRandomIndex(array) {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return -1;
  }
  
  return Math.floor(Math.random() * array.length);
}