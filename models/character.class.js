class Character extends MovableObject {
  sequence_idle = ["./img/character/idle/character_idle1.png", "./img/character/idle/character_idle2.png", "./img/character/idle/character_idle3.png", "./img/character/idle/character_idle4.png", "./img/character/idle/character_idle5.png", "./img/character/idle/character_idle6.png", "./img/character/idle/character_idle7.png"];
  sequence_rolling_right = ["./img/character/rolling/character_rolling1.png", "./img/character/rolling/character_rolling2.png", "./img/character/rolling/character_rolling3.png", "./img/character/rolling/character_rolling4.png", "./img/character/rolling/character_rolling5.png", "./img/character/rolling/character_rolling6.png", "./img/character/rolling/character_rolling7.png", "./img/character/rolling/character_rolling8.png"];
  sequence_rolling_left = ["./img/character/rolling/character_rolling1.png", "./img/character/rolling/character_rolling8.png", "./img/character/rolling/character_rolling7.png", "./img/character/rolling/character_rolling6.png", "./img/character/rolling/character_rolling5.png", "./img/character/rolling/character_rolling4.png", "./img/character/rolling/character_rolling3.png", "./img/character/rolling/character_rolling2.png"];
  sequence_hurt = ["./img/character/hurt/character_hurt1.png", "./img/character/hurt/character_hurt2.png"];
  sequence_dead = ["./img/character/dead/character_dead1.png", "./img/character/dead/character_dead2.png"];
  currentImage = 0;
  currentSequence = this.sequence_idle;
  world;
  y = 0;
  isJumping = this.isJumping;
  isHurt = false;
  isDead = false;
  character_jump_sound = new Audio("./audio/character_jump.mp3");
  character_hurt_sound = new Audio("./audio/hurt.wav");
  character_enemyJump_sound = new Audio("./audio/enemyJump3.wav");

  characterEnergy = 100;
  characterGroundX = 102;
  shitAmmo = 3;
  lastDirection = 1;

  constructor() {
    super().loadImage("./img/character/idle/character_idle1.png");
    this.loadImages(this.sequence_idle);
    this.loadImages(this.sequence_rolling_right);
    this.loadImages(this.sequence_rolling_left);
    this.loadImages(this.sequence_hurt);
    this.loadImages(this.sequence_dead);
    this.applyGravity(this.characterGroundX);
  }

  initializeCharacter() {
    this.animate();
    this.walkRight();
    this.walkLeft();
    this.checkShitThrow();
    this.world.shitCounter.setShitCounterImage(this.shitAmmo);
  }

  animate() {
    this.animationSequencePicker();
    this.handleJumpAnimation();
    this.handleIdleAnimation();
    this.handleRollingAnimation();
    this.handleHurtAnimation();
    this.handleDyingAnimation();
  }

  handleJumpAnimation() {
    setStoppableInterval(() => {
      if (this.world.keyboard.UP && !this.isAboveGround() && !this.world.character.isDead) {
        this.jump(this.character_jump_sound);
      }
    }, 10);
  }

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

  walkRight() {
    setStoppableInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x && !this.world.character.isDead) {
        this.x += 1;
      }
      this.world.camera_x = -this.x + 100;
    }, 8);
  }

  walkLeft() {
    setStoppableInterval(() => {
      if (this.world.keyboard.LEFT && this.x > 0 && !this.world.character.isDead) {
        this.x -= 1;
      }
      this.world.camera_x = -this.x + 100;
    }, 8);
  }

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
    }, 10);
  }

  checkShitThrow() {
    let shitCooldown = false;
    setStoppableInterval(() => {
      if (this.world.keyboard.P && !shitCooldown && this.shitAmmo > 0) {
        let poop = new Shit(this.x, this.y, this.checkCharacterDirection());
        this.world.shit.push(poop);
        this.shitAmmo--;
        if (!this.world.muted) {
          new Audio("./audio/throw.wav").play();
        }

        this.world.shitCounter.setShitCounterImage(this.shitAmmo);

        shitCooldown = true;
        setTimeout(() => {
          shitCooldown = false;
        }, 500);
      }
    }, 10);
  }

  checkCharacterDirection() {
    if (this.world.keyboard.RIGHT) {
      this.lastDirection = 1;
    } else if (this.world.keyboard.LEFT) {
      this.lastDirection = -1;
    }
    return this.lastDirection;
  }

  collectShit() {
    this.shitAmmo++;
    if (!this.world.muted) {
      new Audio("./audio/coin.wav").play();
    }

    this.world.shitCounter.setShitCounterImage(this.shitAmmo);
  }

  handleHit(speed) {
    this.jump();
    this.reduceEnergy();
    this.world.hud.setHealthBarImage(this.characterEnergy);
    if (!this.world.muted) {
      this.character_hurt_sound.play();
    }

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

  reduceEnergy() {
    this.characterEnergy -= 10;
  }

  die() {
    console.log("Character died"); // Debug log
    this.isDead = true;
    // restartGame();
  }
}
