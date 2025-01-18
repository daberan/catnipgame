/**
 * Represents the playable character in the game.
 * Handles movement, animations, combat, and projectile throwing.
 * @extends MovableObject
 */
class Character extends MovableObject {
  /** @type {string[]} - Paths for idle animation frames */
  sequence_idle = ["./img/character/idle/character_idle1.png", "./img/character/idle/character_idle2.png", "./img/character/idle/character_idle3.png", "./img/character/idle/character_idle4.png", "./img/character/idle/character_idle5.png", "./img/character/idle/character_idle6.png", "./img/character/idle/character_idle7.png"];
  /** @type {string[]} - Paths for right rolling animation frames */
  sequence_rolling_right = ["./img/character/rolling/character_rolling1.png", "./img/character/rolling/character_rolling2.png", "./img/character/rolling/character_rolling3.png", "./img/character/rolling/character_rolling4.png", "./img/character/rolling/character_rolling5.png", "./img/character/rolling/character_rolling6.png", "./img/character/rolling/character_rolling7.png", "./img/character/rolling/character_rolling8.png"];
  /** @type {string[]} - Paths for left rolling animation frames */
  sequence_rolling_left = ["./img/character/rolling/character_rolling1.png", "./img/character/rolling/character_rolling8.png", "./img/character/rolling/character_rolling7.png", "./img/character/rolling/character_rolling6.png", "./img/character/rolling/character_rolling5.png", "./img/character/rolling/character_rolling4.png", "./img/character/rolling/character_rolling3.png", "./img/character/rolling/character_rolling2.png"];
  /** @type {string[]} - Paths for hurt animation frames */
  sequence_hurt = ["./img/character/hurt/character_hurt1.png", "./img/character/hurt/character_hurt2.png"];
  /** @type {string[]} - Paths for death animation frames */
  sequence_dead = ["./img/character/dead/character_dead1.png", "./img/character/dead/character_dead2.png"];
  /** @type {number} - Current animation frame index */
  currentImage = 0;
  /** @type {string[]} - Currently active animation sequence */
  currentSequence = this.sequence_idle;
  /** @type {World} - Reference to the game world */
  world;
  /** @type {number} - Vertical position */
  y = 0;
  /** @type {boolean} - Whether character is currently jumping */
  isJumping = this.isJumping;
  /** @type {boolean} - Whether character is hurt */
  isHurt = false;
  /** @type {boolean} - Whether character is dead */
  isDead = false;
  /** @type {number} - Character's health points */
  characterEnergy = 100;
  /** @type {number} - Base X position when on ground */
  characterGroundX = 102;
  /** @type {number} - Current projectile ammunition count */
  shitAmmo = 3;
  /** @type {number} - Last movement direction (1 for right, -1 for left) */
  lastDirection = 1;

  /**
   * Initializes the character with default animation, gravity, and position.
   */
  constructor() {
    super().loadImage("./img/character/idle/character_idle1.png");
    this.loadImages(this.sequence_idle);
    this.loadImages(this.sequence_rolling_right);
    this.loadImages(this.sequence_rolling_left);
    this.loadImages(this.sequence_hurt);
    this.loadImages(this.sequence_dead);
    this.applyGravity(this.characterGroundX);
    this.moveToStart();
  }

  /**
   * Sets up character behaviors and initial state.
   */
  initializeCharacter() {
    this.animate();
    this.walkRight();
    this.walkLeft();
    this.checkShitThrow();
    this.world.shitCounter.setShitCounterImage(this.shitAmmo);
  }

  /**
   * Initializes all animation handlers.
   */
  animate() {
    this.animationSequencePicker();
    this.handleJumpAnimation();
    this.handleIdleAnimation();
    this.handleRollingAnimation();
    this.handleHurtAnimation();
    this.handleDyingAnimation();
  }

  /**
   * Handles jump input and jump animation.
   */
  handleJumpAnimation() {
    setStoppableInterval(() => {
      if (this.world.keyboard.UP && !this.isAboveGround() && !this.world.character.isDead) {
        this.jump(this.world.soundControl.character_jump_sound);
      }
    }, 50);
  }

  /**
   * Manages idle animation sequence.
   */
  handleIdleAnimation() {
    setStoppableInterval(() => {
      if (this.currentSequence === this.sequence_idle) {
        let i = this.currentImage % this.sequence_idle.length;
        let path = this.sequence_idle[i];
        this.img = this.imageCache[path];
        this.currentImage++;
      }
    }, 100);
  }

  /**
   * Manages rolling animation sequences.
   */
  handleRollingAnimation() {
    setStoppableInterval(() => {
      if (this.currentSequence === this.sequence_rolling_left || this.currentSequence === this.sequence_rolling_right) {
        let i = this.currentImage % this.currentSequence.length;
        let path = this.currentSequence[i];
        this.img = this.imageCache[path];
        this.currentImage++;
      }
    }, 50);
  }

  /**
   * Prevents character from moving off screen left.
   */
  moveToStart() {
    setStoppableInterval(() => {
      if (this.x < 0) {
        this.x = 0;
      }
    }, 100);
  }

  /**
   * Manages hurt animation sequence.
   */
  handleHurtAnimation() {
    setStoppableInterval(() => {
      if (this.currentSequence === this.sequence_hurt) {
        let i = this.currentImage % this.sequence_hurt.length;
        let path = this.sequence_hurt[i];
        this.img = this.imageCache[path];
        this.currentImage++;
      }
    }, 50);
  }

  /**
   * Manages death animation sequence.
   */
  handleDyingAnimation() {
    setStoppableInterval(() => {
      if (this.currentSequence === this.sequence_dead) {
        let i = this.currentImage % this.sequence_dead.length;
        let path = this.sequence_dead[i];
        this.img = this.imageCache[path];
        this.currentImage++;
      }
    }, 50);
  }

  /**
   * Handles right movement and camera position.
   */
  walkRight() {
    setStoppableInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x && !this.world.character.isDead) {
        this.x += 1;
      }
      this.world.camera_x = -this.x + 100;
    }, 8);
  }

  /**
   * Handles left movement and camera position.
   */
  walkLeft() {
    setStoppableInterval(() => {
      if (this.world.keyboard.LEFT && this.x > 0 && !this.world.character.isDead) {
        this.x -= 1;
      }
      this.world.camera_x = -this.x + 100;
    }, 8);
  }

  /**
   * Selects appropriate animation sequence based on character state.
   */
  animationSequencePicker() {
    setStoppableInterval(() => {
      if (this.world.keyboard.LEFT && !this.isHurt && !this.isDead) {
        this.currentSequence = this.sequence_rolling_left;
      } else if (this.world.keyboard.RIGHT && !this.isHurt && !this.isDead) {
        this.currentSequence = this.sequence_rolling_right;
      } else if (!this.isHurt && !this.isDead) {
        this.currentSequence = this.sequence_idle;
      } else if (!this.isDead) {
        this.currentSequence = this.sequence_hurt;
      } else {
        this.currentSequence = this.sequence_dead;
      }
    }, 25);
  }

  /**
   * Manages projectile throwing mechanics and cooldown.
   */
  checkShitThrow() {
    let shitCooldown = false;
    setStoppableInterval(() => {
      if (this.world.keyboard.P && !shitCooldown && this.shitAmmo > 0) {
        let poop = new Shit(this.x, this.y, this.checkCharacterDirection());
        this.world.shit.push(poop);
        this.shitAmmo--;
        this.world.soundControl.playThrowSound();
        this.world.shitCounter.setShitCounterImage(this.shitAmmo);

        shitCooldown = true;
        setTimeout(() => {
          shitCooldown = false;
        }, 500);
      }
    }, 25);
  }

  /**
   * Determines character's facing direction.
   * @returns {number} Direction multiplier (1 for right, -1 for left)
   */
  checkCharacterDirection() {
    if (this.world.keyboard.RIGHT) {
      this.lastDirection = 1;
    } else if (this.world.keyboard.LEFT) {
      this.lastDirection = -1;
    }
    return this.lastDirection;
  }

  /**
   * Handles collectible pickup.
   */
  collectShit() {
    this.shitAmmo++;
    this.world.soundControl.playShitSound();
    this.world.shitCounter.setShitCounterImage(this.shitAmmo);
  }

  /**
   * Processes character taking damage.
   * @param {number} speed - Knockback speed
   */
  handleHit(speed) {
    this.jump();
    this.reduceEnergy();
    this.world.hud.setHealthBarImage(this.characterEnergy);
    this.world.soundControl.playCharacterHurtSound();
    this.isHurt = true;
    if (this.characterEnergy <= 0) {
      this.die();
    }
    setTimeout(() => {
      this.isHurt = false;
    }, 750);
    setTimeout(() => {
      this.accelerateOnX(speed);
    }, 50);
  }

  /**
   * Reduces character's health points.
   */
  reduceEnergy() {
    this.characterEnergy -= 10;
  }

  /**
   * Sets character's death state.
   */
  die() {
    this.isDead = true;
  }
}
