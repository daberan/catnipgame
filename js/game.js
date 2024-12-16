let canvas;
let world;

function init() {
  canvas = document.getElementById("canvas");

  canvas.width = 320;
  canvas.height = 180;

  world = new World(canvas);

  console.log("My character is", world.character);
}
