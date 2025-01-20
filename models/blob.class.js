/**
 * Represents a basic enemy blob that moves and animates in the game world.
 * @extends MovableObject
 */
class Blob extends MovableObject {
  /** @type {string[]} - Array of image paths for idle animation */
  sequence_idle = ["./img/enemies/blob/idle/blobIdle1.png", "./img/enemies/blob/idle/blobIdle2.png", "./img/enemies/blob/idle/blobIdle3.png", "./img/enemies/blob/idle/blobIdle4.png", "./img/enemies/blob/idle/blobIdle5.png", "./img/enemies/blob/idle/blobIdle6.png"];

  /** @type {string[]} - Array of image paths for hurt animation */
  sequence_hurt = ["./img/enemies/blob/hurt/blob_hurt1.png", "./img/enemies/blob/hurt/blob_hurt2.png"];

  /** @type {string[]} - Array of image paths for death animation */
  sequence_dying = ["./img/enemies/blob/dead/blob_dead1.png", "./img/enemies/blob/dead/blob_dead2.png"];

  /** @type {number} - Current frame index for animation */
  currentImage = Math.floor(Math.random() * 6);
  /** @type {number} - Vertical starting position */
  y = -100;
  /** @type {World} - Reference to the game world */
  world;
  /** @type {number} - Blob's health points */
  health = 20;
  /** @type {string[]} - Currently active animation sequence */
  currentSequence = this.sequence_idle;
  /** @type {boolean} - Whether the blob can change direction */
  canTurn = true;
  /** @type {number} - Current movement direction (1 or -1) */
  currentDirection = 1;

  /**
   * Creates a new Blob instance with randomized starting properties.
   */
  constructor() {
    super().loadImage("./img/enemies/blob/idle/blobIdle1.png");
    this.loadImages(this.sequence_idle);
    this.loadImages(this.sequence_hurt);
    this.loadImages(this.sequence_dying);
    this.speed = Math.floor(Math.random() * 10) + 1;
    this.x = Math.round(500 + Math.random() * 500);
    this.applyGravity();
    this.animate();
    this.moveBlob(this.speed);
  }

  /**
   * Gets the character's X position from the world.
   * @returns {number} The character's X position or 0 if not found
   */
  getCharacterX() {
    if (this.world && this.world.character) {
      return this.world.character.x;
    }
    return 0;
  }

  /**
   * Handles blob animation and sound effects.
   * Updates animation sequence based on blob state.
   */
  animate() {
    setStoppableInterval(() => {
      this.checkIfDead();
      this.updateCurrentAnimationSequence();
      let i = this.currentImage % this.currentSequence.length;
      let path = this.currentSequence[i];
      this.img = this.imageCache[path];
      if (!this.world?.isOnMobile && i === 3 && this.world && !this.world.soundControl.isMuted && !this.isDead) {
        this.world.soundControl.playBlobBounceSound();
      }
      this.currentImage++;
    }, 150);
  }

  /**
   * Updates the current animation sequence based on blob state.
   */
  updateCurrentAnimationSequence() {
    if (this.isHurt) {
      this.currentSequence = this.sequence_hurt;
    } else if (this.isDead) {
      this.currentSequence = this.sequence_dying;
    } else {
      this.currentSequence = this.sequence_idle;
    }
  }

  /**
   * Moves the blob towards the character with direction changes.
   * Includes cooldown on direction changes to prevent rapid flipping.
   * @param {number} speed - Movement speed of the blob
   */
  moveBlob(speed) {
    setStoppableInterval(() => {
      if (!this.isDead) {
        const characterX = this.getCharacterX();
        const newDirection = characterX > this.x ? 1 : -1;
        if (this.canTurn && newDirection !== this.currentDirection) {
          this.currentDirection = newDirection;
          this.canTurn = false;
          setTimeout(() => {
            this.canTurn = true;
          }, 1000);
        }
        this.x += 1 * this.currentDirection;
      }
    }, speed);
  }

  /**
   * Checks if blob's health is low enough to trigger death state.
   */
  checkIfDead() {
    if (this.health < 10) {
      this.isHurt = false;
      this.isDead = true;
    }
  }
}
