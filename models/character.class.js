class Character extends MovableObject {
  sequence_idle = ["./img/character/idle/character_idle1.png", "./img/character/idle/character_idle2.png", "./img/character/idle/character_idle3.png", "./img/character/idle/character_idle4.png", "./img/character/idle/character_idle5.png", "./img/character/idle/character_idle6.png", "./img/character/idle/character_idle7.png"];
  sequence_rolling_right = ["./img/character/rolling/character_rolling1.png", "./img/character/rolling/character_rolling2.png", "./img/character/rolling/character_rolling3.png", "./img/character/rolling/character_rolling4.png", "./img/character/rolling/character_rolling5.png", "./img/character/rolling/character_rolling6.png", "./img/character/rolling/character_rolling7.png", "./img/character/rolling/character_rolling8.png"];
  sequence_rolling_left = ["./img/character/rolling/character_rolling1.png", "./img/character/rolling/character_rolling8.png", "./img/character/rolling/character_rolling7.png", "./img/character/rolling/character_rolling6.png", "./img/character/rolling/character_rolling5.png", "./img/character/rolling/character_rolling4.png", "./img/character/rolling/character_rolling3.png", "./img/character/rolling/character_rolling2.png"];
  currentImage = 0;
  currentSequence = this.sequence_idle;
  world;

  constructor() {
    super().loadImage("./img/character/idle/character_idle1.png");
    this.loadImages(this.sequence_idle);
    this.loadImages(this.sequence_rolling_right);
    this.loadImages(this.sequence_rolling_left);

    this.animate();
    this.walkRight();
    this.walkLeft();
  }

  animate() {
    setInterval(() => {
      this.sequencePicker();
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
    if (this.world.keyboard.LEFT) {
      this.currentSequence = this.sequence_rolling_left;
    } else if (this.world.keyboard.RIGHT) {
      this.currentSequence = this.sequence_rolling_right;
    } else {
      this.currentSequence = this.sequence_idle;
    }
  }

  jump() {}
}
