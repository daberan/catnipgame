class Shit extends MovableObject {
  width = 8;
  height = 8;
  speedX = 2;

  constructor(x, y, direction) {
    super().loadImage("./img/shit/shit.png");
    this.x = 100;
    this.y = 100;
    this.throw(x, y, direction);
  }

  throw(x, y, direction) {
    this.x = x;
    this.y = y;
    this.speedY = 10;

    this.accelerateOnX(this.speedX * direction, 500);
    this.applyGravity();
  }
}
