class Shit extends MovableObject {
  width = 8;
  height = 8;

  constructor() {
    super().loadImage("./img/shit/shit.png");
    this.x = 100;
    this.y = 100;
    this.throw(100, 100);
  }

  throw(x, y) {
    this.x = x;
    this.y = y;
    this.speedY = 15;
    this.applyGravity();
  }
}
