/**
 * Stores all active interval IDs for the game.
 * Used to track and clear intervals when stopping/restarting the game.
 * @type {number[]}
 */
let intervalIds = [];

/**
 * Creates an interval that can be stopped later using clearIntervals.
 * Automatically tracks the interval ID for later cleanup.
 *
 * @param {Function} fn - The function to be called at each interval
 * @param {number} time - The interval time in milliseconds
 * @returns {number} The interval ID
 */
function setStoppableInterval(fn, time) {
  const id = setInterval(fn, time);
  intervalIds.push(id);
  return id;
}

/**
 * Clears all tracked intervals and resets the intervalIds array.
 * Used as part of game cleanup and reset process.
 */
function clearIntervals() {
  intervalIds.forEach((id) => {
    clearInterval(id);
  });
  intervalIds = [];
}

/**
 * Completely restarts the game by:
 * 1. Stopping all current game processes
 * 2. Resetting game state variables
 * 3. Creating new keyboard instance
 * 4. Resetting enemies
 * 5. Reinitializing the game
 *
 * Note: Assumes existence of global variables (world, gameStarted, Keyboard class,
 * level1, getNewEnemies function, initGame and initializeGame functions)
 */
function restartGame() {
  stopGame();
  world = null;
  gameStarted = false;
  keyboard = new Keyboard();
  level1.enemies = getNewEnemies();
  initGame();
  initializeGame();
}

/**
 * Stops all game processes including:
 * - Clears all active intervals
 * - Pauses and resets all game audio
 * - Closes any active enemy audio contexts
 *
 * Should be called before restarting or exiting the game.
 */
function stopGame() {
  clearIntervals();
  this.stopMusic();
}

/**
 * Stops all music.
 */

function stopMusic() {
  if (world) {
    world.soundControl.theme.pause();
    world.soundControl.theme.currentTime = 0;

    world.soundControl.bossTheme.pause();
    world.soundControl.bossTheme.currentTime = 0;

    world.level.enemies.forEach((enemy) => {
      if (enemy.audioContext) {
        enemy.audioContext.close();
      }
    });
  }
}

window.intervalIds = intervalIds;
window.setStoppableInterval = setStoppableInterval;
window.stopGame = stopGame;
window.restartGame = restartGame;
