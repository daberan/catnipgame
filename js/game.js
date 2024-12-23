let canvas;
let world;
let keyboard = new Keyboard();
let enableCollisionFrames = false;

function toggleCollisionframes() {
  enableCollisionFrames = !enableCollisionFrames;
  console.log("Collision frames are: ", enableCollisionFrames);
}

function init() {
  canvas = document.getElementById("canvas");

  canvas.width = 320;
  canvas.height = 180;

  world = new World(canvas, keyboard);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    keyboard.UP = true;
  }
  if (event.key === "w") {
    keyboard.UP = true;
  }
  if (event.key === "ArrowDown") {
    keyboard.DOWN = true;
  }
  if (event.key === "ArrowLeft") {
    keyboard.LEFT = true;
  }
  if (event.key === "a") {
    keyboard.LEFT = true;
  }
  if (event.key === "ArrowRight") {
    keyboard.RIGHT = true;
  }
  if (event.key === "d") {
    keyboard.RIGHT = true;
  }
  if (event.key === " ") {
    keyboard.SPACE = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowUp") {
    keyboard.UP = false;
  }
  if (event.key === "w") {
    keyboard.UP = false;
  }
  if (event.key === "ArrowDown") {
    keyboard.DOWN = false;
  }
  if (event.key === "ArrowLeft") {
    keyboard.LEFT = false;
  }
  if (event.key === "a") {
    keyboard.LEFT = false;
  }
  if (event.key === "ArrowRight") {
    keyboard.RIGHT = false;
  }
  if (event.key === "d") {
    keyboard.RIGHT = false;
  }
  if (event.key === " ") {
    keyboard.SPACE = false;
  }
});
