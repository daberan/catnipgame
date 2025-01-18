/**
 * @typedef {Object} Keyboard
 * @property {boolean} UP - State of up arrow or 'w' key
 * @property {boolean} DOWN - State of down arrow key
 * @property {boolean} LEFT - State of left arrow or 'a' key
 * @property {boolean} RIGHT - State of right arrow or 'd' key
 * @property {boolean} SPACE - State of spacebar
 * @property {boolean} P - State of 'p' key
 */

/**
 * The main game canvas element.
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * The main World instance that manages game state and rendering.
 * @type {World}
 */
let world;

/**
 * The start screen instance shown before game begins.
 * @type {StartScreen}
 */
let startScreen;

/**
 * The game over screen instance shown when player dies.
 * @type {GameOverScreen}
 */
let gameOverScreen;

/**
 * Keyboard instance tracking the state of player input keys.
 * @type {Keyboard}
 */
let keyboard = new Keyboard();

/**
 * Flag to enable/disable collision frame visualization for debugging.
 * @type {boolean}
 */
let enableCollisionFrames = false;

/**
 * Flag indicating whether the game has been started.
 * @type {boolean}
 */
let gameStarted = false;

/**
 * Initializes the game by setting up the canvas and creating the start screen.
 * This function should be called when the page loads.
 */
function initGame() {
  canvas = document.getElementById("canvasGame");
  canvas.width = 320;
  canvas.height = 180;

  setTimeout(() => {
    startScreen = new StartScreen(canvas);
  }, 100);
}

/**
 * Initializes the main game world when player starts the game.
 * Creates a new World instance and checks if running on mobile device.
 * Only initializes once - subsequent calls are ignored.
 */
function initializeGame() {
  if (!gameStarted) {
    gameStarted = true;
    world = new World(canvas, keyboard);
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
      world.isOnMobile = true;
    }
  }
}

// Add event listeners for keyboard input
/**
 * Keydown event listener that updates keyboard state when keys are pressed.
 * Only processes events if game has started.
 * @param {KeyboardEvent} event - The keyboard event
 */
document.addEventListener("keydown", (event) => {
  if (!gameStarted) return;

  if (event.key === "ArrowUp" || event.key === "w") {
    keyboard.UP = true;
  }
  if (event.key === "ArrowDown") {
    keyboard.DOWN = true;
  }
  if (event.key === "ArrowLeft" || event.key === "a") {
    keyboard.LEFT = true;
  }
  if (event.key === "ArrowRight" || event.key === "d") {
    keyboard.RIGHT = true;
  }
  if (event.key === " ") {
    keyboard.SPACE = true;
  }
  if (event.key === "p") {
    keyboard.P = true;
  }
});

/**
 * Keyup event listener that updates keyboard state when keys are released.
 * Only processes events if game has started.
 * @param {KeyboardEvent} event - The keyboard event
 */
document.addEventListener("keyup", (event) => {
  if (!gameStarted) return;

  if (event.key === "ArrowUp" || event.key === "w") {
    keyboard.UP = false;
  }
  if (event.key === "ArrowDown") {
    keyboard.DOWN = false;
  }
  if (event.key === "ArrowLeft" || event.key === "a") {
    keyboard.LEFT = false;
  }
  if (event.key === "ArrowRight" || event.key === "d") {
    keyboard.RIGHT = false;
  }
  if (event.key === " ") {
    keyboard.SPACE = false;
  }
  if (event.key === "p") {
    keyboard.P = false;
  }
});

// Export functions to window object for external access
window.initializeGame = initializeGame;
window.initGame = initGame;
