class MovableObject {
  x = 0;
  y = 0;
  img;
  height = 32;
  width = 32;
  rndmSpeed = Math.floor(Math.random() * 7) + 6;
  speed = 500;
  imageCache = {};
  speedY = 0;
  acceleration = 2;
  isJumping = false;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  moveLeft(speed) {
    setInterval(() => {
      this.x -= 1;
    }, speed);
  }

  applyGravity() {
    setInterval(() => {
      // Nur Gravitation anwenden wenn in der Luft ODER positive speedY (beim Springen)
      if (this.isAboveGround() || this.speedY > 0) {
        let newY = this.y - this.speedY;

        if (newY > 100) {
          this.y = 100;
          this.speedY = 0;
        } else {
          this.y = newY;
          this.speedY -= this.acceleration;
        }
      }
    }, 40);
  }

  isAboveGround() {
    return this.y < 100;
  }

  jump() {
    this.speedY = 15;
    this.doubleJump += 1;

    console.log(`jump`, this.isJumping);
  }
}
