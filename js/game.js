let canvas;
let ctx;
let character = new Image();

function init() {
  canvas = document.getElementById("canvas");

  canvas.width = 320;
  canvas.height = 180;

  ctx = canvas.getContext(`2d`);

  character.src = "../img/character/idle/character_idle1.png";

  ctx.drawImage(character, 20, 20, 32, 32);
}
