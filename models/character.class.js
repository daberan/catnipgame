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
  characterEnergy = 100;

  constructor() {
    super().loadImage("./img/character/idle/character_idle1.png");
    this.loadImages(this.sequence_idle);
    this.loadImages(this.sequence_rolling_right);
    this.loadImages(this.sequence_rolling_left);
    this.loadImages(this.sequence_hurt);
    this.loadImages(this.sequence_dead);

    this.applyGravity();
    this.animate();
    this.walkRight();
    this.walkLeft();
  }

  animate() {
    // Picks the right animation sequence
    setInterval(() => {
      this.sequencePicker();
    }, 10);

    //jump
    setInterval(() => {
      if (this.world.keyboard.UP && !this.isAboveGround()) {
        this.jump(this.character_jump_sound);
      }
    }, 10);

    // Idle
    setInterval(() => {
      if (this.currentSequence === this.sequence_idle) {
        let i = this.currentImage % this.sequence_idle.length;
        let path = this.sequence_idle[i];
        this.img = this.imageCache[path];
        this.currentImage++;
      }
    }, 100);

    // Rolling
    setInterval(() => {
      if (this.currentSequence === this.sequence_rolling_left || this.currentSequence === this.sequence_rolling_right) {
        let i = this.currentImage % this.currentSequence.length;
        let path = this.currentSequence[i];
        this.img = this.imageCache[path];
        this.currentImage++;
      }
    }, 50);

    // hurt
    setInterval(() => {
      if (this.currentSequence === this.sequence_hurt) {
        let i = this.currentImage % this.currentSequence.length;
        let path = this.currentSequence[i];
        this.img = this.imageCache[path];
        this.currentImage++;
      }
    }, 50);
    //dead
    setInterval(() => {
      if (this.currentSequence === this.sequence_dead) {
        let i = this.currentImage % this.currentSequence.length;
        let path = this.currentSequence[i];
        this.img = this.imageCache[path];
        this.currentImage++;
      }
    }, 50);
  }

  walkRight() {
    setInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.x += 1;
      }
      this.world.camera_x = -this.x + 100;
    }, 8);
  }

  walkLeft() {
    setInterval(() => {
      if (this.world.keyboard.LEFT && this.x > 0) {
        this.x -= 1;
      }
      this.world.camera_x = -this.x + 100;
    }, 8);
  }

  sequencePicker() {
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
  }
}
