/**
 * Represents the boss enemy that can throw homing balls and perform rush attacks.
 * Features spatial audio effects and multiple animation states.
 * @extends MovableObject
 */
class Blobmaster extends MovableObject {
  /** @type {string[]} - Array of image paths for idle animation sequence */
  sequence_idle = ["./img/enemies/blobmaster/blobmaster1.png", "./img/enemies/blobmaster/blobmaster2.png", "./img/enemies/blobmaster/blobmaster3.png", "./img/enemies/blobmaster/blobmaster4.png", "./img/enemies/blobmaster/blobmaster5.png", "./img/enemies/blobmaster/blobmaster6.png"];

  /** @type {string[]} - Array of image paths for hurt animation sequence */
  sequence_hurt = ["./img/enemies/blobmaster/Blobmaster_hurtnew1.png", "./img/enemies/blobmaster/Blobmaster_hurtnew2.png"];

  /** @type {string[]} - Array of image paths for death animation sequence */
  sequence_dying = ["./img/enemies/blobmaster/Blobmaster_dying1.png", "./img/enemies/blobmaster/Blobmaster_dying2.png"];

  /** @type {number} - Current frame index for animation, randomized start */
  currentImage = Math.floor(Math.random() * 6);
  /** @type {World} - Reference to the game world instance */
  world;
  /** @type {number} - Height of the blobmaster sprite in pixels */
  height = 64;
  /** @type {number} - Width of the blobmaster sprite in pixels */
  width = 64;
  /** @type {number} - Vertical position */
  y = 67;
  /** @type {number} - Health points */
  health = 160;
  /** @type {boolean} - Whether currently in hurt state */
  isHurt = false;
  /** @type {boolean} - Whether in dead state */
  isDead = false;
  /** @type {string[]} - Currently active animation sequence */
  currentSequence = this.sequence_idle;
  /** @type {number} - Movement direction (1 or -1) */
  walkDirection = 1;
  /** @type {number} - Current X position tracker */
  blobmasterX = 1;
  /** @type {number} - Base movement speed */
  speed = 50;

  /** @type {AudioContext} - Web Audio API context for spatial audio */
  audioContext = new AudioContext();
  /** @type {GainNode} - Controls audio volume based on distance */
  gainNode = this.audioContext.createGain();
  /** @type {StereoPannerNode} - Controls left/right audio panning */
  pannerNode = this.audioContext.createStereoPanner();

  /**
   * Creates a new Blobmaster instance with initialized audio and animations.
   * Sets up spatial audio system and starts animation/attack cycles.
   */
  constructor() {
    super().loadImage("./img/enemies/blobmaster/blobmaster1.png");
    this.loadImages(this.sequence_idle);
    this.loadImages(this.sequence_hurt);
    this.loadImages(this.sequence_dying);
    this.x = Math.round(1000 + Math.random() * 150);

    // Initialize spatial audio system
    this.blob_bounce_sound = new Audio("./audio/bounce3.wav");
    const track = this.audioContext.createMediaElementSource(this.blob_bounce_sound);
    track.connect(this.pannerNode);
    this.pannerNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    this.animate();
    this.checkBallThrow();
  }

  /**
   * Manages ball throwing attacks with cooldown.
   * Creates new Ball instances targeting the character.
   */
  checkBallThrow() {
    let ballCooldown = false;
    setStoppableInterval(() => {
      if (!ballCooldown && !this.isDead) {
        let flyBall = new Ball(this.x, this.y + this.height / 2, this.world.character);
        flyBall.world = this.world;
        this.world.ball.push(flyBall);
        this.killBall();
        ballCooldown = true;
        setTimeout(() => {
          ballCooldown = false;
        }, 4000);
      }
    }, 10);
  }

  /**
   * Removes active balls from the world after a delay.
   */
  killBall() {
    setTimeout(() => {
      this.world.ball = [];
    }, 4000);
  }

  /**
   * Retrieves the character's X position from the world.
   * @returns {number} The character's X position or 0 if not found
   */
  getCharacterX() {
    if (this.world && this.world.character) {
      return this.world.character.x;
    }
    return 0;
  }

  /**
   * Updates spatial audio parameters based on distance from character.
   * Adjusts volume and stereo panning based on relative position.
   */
  updateAudio() {
    const characterX = this.getCharacterX();
    const distance = Math.abs(this.x - characterX);
    const maxDistance = 300;
    let volume = 1 - distance / maxDistance;
    volume = Math.max(0, Math.min(1, volume));
    this.gainNode.gain.value = volume;

    const panMaxDistance = 200;
    const relativeX = this.x - characterX;
    let panValue = relativeX / panMaxDistance;
    panValue = Math.max(-1, Math.min(1, panValue)) * 0.7;
    this.pannerNode.pan.value = panValue;
  }

  /**
   * Handles main animation loop and behavior cycles.
   * Manages movement, death checks, animation sequences, and audio playback.
   */
  animate() {
    this.move(1000 / this.speed);
    setStoppableInterval(() => {
      if (!this.isDead) {
        this.rushAttack();
      }
    }, 2000);

    setStoppableInterval(() => {
      this.blobmasterX = this.x;
      this.checkIfDead();
      this.updateCurrentAnimationSequence();
      let i = this.currentImage % this.currentSequence.length;
      let path = this.currentSequence[i];
      this.img = this.imageCache[path];

      if (i === 3) {
        if (this.audioContext.state === "suspended") {
          this.audioContext.resume();
        }
        this.updateAudio();
        if (!this.world.soundControl.isMuted) {
          this.blob_bounce_sound.play();
        }
      }
      this.currentImage++;
    }, 100);
  }

  /**
   * Updates the current animation sequence based on state (hurt/dead/idle).
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
   * Checks if health is low enough to trigger death state.
   */
  checkIfDead() {
    if (this.health < 10) {
      this.isHurt = false;
      this.isDead = true;
    }
  }

  /**
   * Performs a rush attack towards the character.
   * Includes acceleration and deceleration phases.
   * Will not execute if already rushing or dead.
   */
  rushAttack() {
    if (this.isRushing || this.health <= 10) return;

    this.isRushing = true;
    let speed = 0;
    const maxSpeed = 9;
    const acceleration = 0.5;
    const deceleration = 0.3;
    let direction = this.getCharacterX() > this.x ? 1 : -1;
    let isAccelerating = true;

    const rushInterval = setStoppableInterval(() => {
      if (isAccelerating) {
        if (speed < maxSpeed) {
          speed += acceleration;
        } else {
          isAccelerating = false;
        }
      } else {
        if (speed > 0) {
          speed -= deceleration;
        } else {
          speed = 0;
          this.isRushing = false;
          clearInterval(rushInterval);
          return;
        }
      }
      this.x += speed * direction;
    }, 20);
  }
}
