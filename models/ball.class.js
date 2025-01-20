/**
 * Represents a homing projectile that follows a target in the game.
 * @extends MovableObject
 */
class Ball extends MovableObject {
  /** @type {number} - Width of the ball sprite */
  width = 16;
  /** @type {number} - Height of the ball sprite */
  height = 16;
  /** @type {number} - Horizontal speed of the ball */
  speedX = 0;
  /** @type {number} - Speed at which the ball homes in on its target */
  homingSpeed = 2;
  /** @type {World} - Reference to the game world instance */
  world;

  /**
   * Creates a new Ball instance.
   *
   * @param {number} x - Initial X coordinate position
   * @param {number} y - Initial Y coordinate position
   * @param {MovableObject} target - The object this ball will follow
   */
  constructor(x, y, target) {
    super().loadImage("./img/enemies/ball/ball1.png");
    this.x = x;
    this.y = y;
    this.target = target;
    this.throw();
  }

  /**
   * Initiates the ball's movement towards its target.
   */
  throw() {
    this.followTarget();
  }

  /**
   * Updates the ball's position to follow its target using homing logic.
   * Uses vector normalization to create smooth homing movement.
   * Only follows if the target exists and the blobmaster is alive.
   */
  followTarget() {
    setStoppableInterval(() => {
      if (this.target && !this.world?.blobmaster?.isDead) {
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
