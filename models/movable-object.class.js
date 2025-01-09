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
  speedX = 1;
  acceleration = 2;
  isJumping = false;
  isKicked = false;
  groundX = 102;

  setGroundX() {
    if (this.isDead || this instanceof Shit) {
      this.groundX = 250;
    } else {
      this.groundX = 102;
    }
  }

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

  move(speed) {
    setInterval(() => {
      if (this instanceof Blobmaster) {
        const characterX = this.getCharacterX();
        const direction = characterX > this.x ? 1 : -1;
        setTimeout(() => {
          this.x += 1 * direction;
        }, 1000);
      } else {
        this.x += -1;
      }
    }, speed);
  }

  applyGravity() {
    setInterval(() => {
      this.setGroundX();
      if (this.isAboveGround() || this.speedY > 0) {
        let newY = this.y - this.speedY;
        let groundX = this.groundX;

        if (newY > groundX) {
          this.y = groundX;
          this.speedY = 0;
        } else {
          this.y = newY;
          this.speedY -= this.acceleration;
        }
      }
    }, 40);
  }

  isAboveGround() {
    return this.y < this.groundX;
  }

  jump(sound) {
    this.speedY = 15;
    if (!sound) {
      return;
    }
    if (!this.world.muted) {
      sound.play();
    }
  }

  accelerateOnX(speed, maxDistance = 50) {
    console.log("accelerateOnX called", speed, this.isKicked);
    if (this.isKicked) return;

    let totalDistance = 0;

    this.isKicked = true;
    this.speedX = speed;

    const kickInterval = setInterval(() => {
      if ((!(this instanceof Shit) && !this.isAboveGround()) || Math.abs(totalDistance) >= maxDistance) {
        this.speedX = 0;
        this.isKicked = false;
        clearInterval(kickInterval);
        return;
      }
      this.x += this.speedX;
      totalDistance += this.speedX;
    }, 10);
  }
}
