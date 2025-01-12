let canvas;
let world;
let startScreen;
let gameOverScreen;
let keyboard = new Keyboard();
let enableCollisionFrames = false;
let gameStarted = false;

function init() {
  canvas = document.getElementById("canvasGame");
  canvas.width = 320;
  canvas.height = 180;

  setTimeout(() => {
    startScreen = new StartScreen(canvas);
  }, 100);

  // Add touch event listeners for mobile
  canvas.addEventListener("touchstart", (event) => {
    if (!gameStarted) return;
    event.preventDefault(); // Prevent default touch behavior
    keyboard.UP = true;
  });

  canvas.addEventListener("touchend", (event) => {
    if (!gameStarted) return;
    event.preventDefault(); // Prevent default touch behavior
    keyboard.UP = false;
  });
}

function initializeGame() {
  if (!gameStarted) {
    gameStarted = true;
    world = new World(canvas, keyboard);
  }
}

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

window.initializeGame = initializeGame;
window.init = init;
