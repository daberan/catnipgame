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

  moveLeft(speed) {
    setInterval(() => {
      // Für Blobmaster Instanzen
      if (this instanceof Blobmaster) {
        const characterX = this.getCharacterX(); // Nutze die existierende Methode
        const direction = characterX > this.x ? 1 : -1;
        this.x += 1 * direction; // Note: Changed -= to += to match direction logic
      } else {
        // Für andere MovableObjects
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
    sound.play();
  }

  // checkIfLeftOrRight(characterX, enemyX) {
  //   setInterval(() => {
  //     if (characterX > enemyX) {
  //       this.walkDirection = 1;
  //       return 1;
  //     }
  //     if (characterX < enemyX) {
  //       this.walkDirection = -1;
  //       return -1;
  //     }
  //   }, 250);
  // }

  accelerateOnX(speed, maxDistance = 50) {
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
