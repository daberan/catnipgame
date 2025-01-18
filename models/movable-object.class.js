/**
 * Base class for all movable game objects.
 * Handles physics, movement, and image management.
 */
class MovableObject {
  /** @type {number} - X position */
  x = 0;
  /** @type {number} - Y position */
  y = 0;
  /** @type {HTMLImageElement} - Current sprite image */
  img;
  /** @type {number} - Object height */
  height = 32;
  /** @type {number} - Object width */
  width = 32;
  /** @type {number} - Random movement speed between 6-12 */
  rndmSpeed = Math.floor(Math.random() * 7) + 6;
  /** @type {number} - Base movement speed */
  speed = 500;
  /** @type {Object.<string, HTMLImageElement>} - Cached sprite images */
  imageCache = {};
  /** @type {number} - Vertical speed */
  speedY = 0;
  /** @type {number} - Horizontal speed */
  speedX = 1;
  /** @type {number} - Gravity acceleration */
  acceleration = 2;
  /** @type {boolean} - Jump state */
  isJumping = false;
  /** @type {boolean} - Kick state */
  isKicked = false;
  /** @type {number} - Ground Y position */
  groundX = 102;

  /**
   * Sets appropriate ground level based on object state and type.
   */
  setGroundX() {
    if (this.isDead || this instanceof Shit) {
      this.groundX = 250;
    } else {
      this.groundX = 102;
    }
  }

  /**
   * Loads and sets a single sprite image.
   * @param {string} path - Path to image file
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Loads and caches multiple sprite images.
   * @param {string[]} arr - Array of image paths
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Handles continuous movement behavior.
   * Special handling for Blobmaster type.
   * @param {number} speed - Movement interval in milliseconds
   */
  move(speed) {
    setStoppableInterval(() => {
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

  /**
   * Applies gravity effect to object.
   */
  applyGravity() {
    setStoppableInterval(() => {
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

  /**
   * Checks if object is above ground level.
   * @returns {boolean} True if above ground
   */
  isAboveGround() {
    return this.y < this.groundX;
  }

  /**
   * Initiates a jump with optional sound effect.
   * @param {HTMLAudioElement} [sound] - Jump sound effect
   */
  jump(sound) {
    this.speedY = 15;
    if (!sound) {
      return;
    }
    sound.play();
  }

  /**
   * Applies horizontal acceleration for knockback effect.
   * @param {number} speed - Initial speed
   * @param {number} [maxDistance=50] - Maximum knockback distance
   */
  accelerateOnX(speed, maxDistance = 50) {
    if (this.isKicked) return;
    let totalDistance = 0;
    this.isKicked = true;
    this.speedX = speed;
    const kickInterval = setStoppableInterval(() => {
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
