/**
 * Represents a throwable projectile in the game.
 * Handles projectile physics and movement.
 * @extends MovableObject
 */
class Shit extends MovableObject {
  /** @type {number} - Projectile width */
  width = 16;
  /** @type {number} - Projectile height */
  height = 16;
  /** @type {number} - Horizontal movement speed */
  speedX = 2;

  /**
   * Creates a new projectile instance.
   * @param {number} x - Starting X position
   * @param {number} y - Starting Y position
   * @param {number} direction - Throw direction (-1 for left, 1 for right)
   */
  constructor(x, y, direction) {
    super().loadImage("./img/shit/shit.png");
    this.x = 100;
    this.y = 100;
    this.throw(x, y, direction);
  }

  /**
   * Initiates projectile throw physics.
   * @param {number} x - Starting X position
   * @param {number} y - Starting Y position
   * @param {number} direction - Throw direction (-1 for left, 1 for right)
   */
  throw(x, y, direction) {
    this.x = x;
    this.y = y;
    this.speedY = 10;

    this.accelerateOnX(this.speedX * direction, 500);
    this.applyGravity();
  }
}
