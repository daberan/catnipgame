class Shit extends MovableObject {
  width = 8;
  height = 8;
  speedX = 2;

  constructor(x, y) {
    super().loadImage("./img/shit/shit.png");
    this.x = 100;
    this.y = 100;
    this.throw(x, y);
  }

  throw(x, y) {
    this.x = x;
    this.y = y;
    this.speedY = 15;

    this.accelerateOnX(this.speedX, 500);
    this.applyGravity();
  }
}
