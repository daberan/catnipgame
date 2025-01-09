class CollectibleShit extends MovableObject {
  width = 16;
  height = 16;
  x = Math.floor(Math.random() * (1000 - 200 + 1)) + 200;
  y = 120;

  constructor() {
    super().loadImage("./img/shit/shit.png");
  }
}
