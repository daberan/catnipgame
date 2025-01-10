class Ball extends MovableObject {
  width = 16;
  height = 16;
  speedX = 0;
  homingSpeed = 2;

  constructor(x, y, target) {
    super().loadImage("./img/enemies/ball/ball1.png");
    this.x = x;
    this.y = y;
    this.target = target;
    this.throw();
  }
  throw() {
    this.followTarget();
  }

  followTarget() {
    setStoppableInterval(() => {
      if (this.target) {
        const dx = this.target.x + this.target.width / 2 - this.x;
        const dy = this.target.y + this.target.height / 2 - this.y;

        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
          this.x += Math.round((dx / distance) * this.homingSpeed);
          this.y += Math.round((dy / distance) * this.homingSpeed);
        }
      }
    }, 20);
  }
}
