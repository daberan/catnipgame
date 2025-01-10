class Blob extends MovableObject {
  sequence_idle = ["./img/enemies/blob/idle/blobIdle1.png", "./img/enemies/blob/idle/blobIdle2.png", "./img/enemies/blob/idle/blobIdle3.png", "./img/enemies/blob/idle/blobIdle4.png", "./img/enemies/blob/idle/blobIdle5.png", "./img/enemies/blob/idle/blobIdle6.png"];
  sequence_hurt = ["./img/enemies/blob/hurt/blob_hurt1.png", "./img/enemies/blob/hurt/blob_hurt2.png"];
  sequence_dying = ["./img/enemies/blob/dead/blob_dead1.png", "./img/enemies/blob/dead/blob_dead2.png"];
  currentImage = Math.floor(Math.random() * 6);
  y = -100;
  world;
  health = 40;
  currentSequence = this.sequence_idle;
  canTurn = true;
  currentDirection = 1; // Track current direction

  audioContext = new AudioContext();
  gainNode = this.audioContext.createGain();
  pannerNode = this.audioContext.createStereoPanner();

  constructor() {
    super().loadImage("./img/enemies/blob/idle/blobIdle1.png");
    this.loadImages(this.sequence_idle);
    this.loadImages(this.sequence_hurt);
    this.loadImages(this.sequence_dying);
    this.speed = Math.floor(Math.random() * 20) + 6;
    this.x = Math.round(500 + Math.random() * 500);

    this.blob_bounce_sound = new Audio("./audio/blob_bounce1.wav");
    const track = this.audioContext.createMediaElementSource(this.blob_bounce_sound);
    track.connect(this.pannerNode);
    this.pannerNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    this.applyGravity();

    this.initializeMovement();
  }

  initializeMovement() {
    this.animate();
    this.startRandomJumping();
  }

  startRandomJumping() {
    setStoppableInterval(() => {
      if (!this.isDead && !this.isHurt && !this.isAboveGround()) {
        // Random chance to jump (about 20% chance every check)
        if (Math.random() < 0.2) {
          const direction = this.getCharacterX() > this.x ? 1 : -1;
          this.jumpForward(direction);
        }
      }
    }, 500); // Check every 1.5 seconds
  }

  jumpForward(direction) {
    this.speedY = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
    this.accelerateOnX(5 * direction, 200); // Jump forward in current direction
  }

  getCharacterX() {
    if (this.world && this.world.character) {
      return this.world.character.x;
    }
    return 0;
  }

  updateAudio() {
    const characterX = this.getCharacterX();
    const distance = Math.abs(this.x - characterX);
    const maxDistance = 300;

    let volume = (1 - distance / maxDistance) * 0.3;
    volume = Math.max(0, Math.min(1, volume));
    this.gainNode.gain.value = volume;

    const panMaxDistance = 200;
    const relativeX = this.x - characterX;
    let panValue = relativeX / panMaxDistance;
    panValue = Math.max(-1, Math.min(1, panValue)) * 0.7;
    this.pannerNode.pan.value = panValue;
  }

  animate() {
    this.move(7);

    setStoppableInterval(() => {
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
        if (!this.world.muted) {
          this.blob_bounce_sound.play();
        }
      }
      this.currentImage++;
    }, 75);
  }

  updateCurrentAnimationSequence() {
    if (this.isHurt) {
      this.currentSequence = this.sequence_hurt;
    } else if (this.isDead) {
      this.currentSequence = this.sequence_dying;
    } else {
      this.currentSequence = this.sequence_idle;
    }
  }

  move(speed) {
    setStoppableInterval(() => {
      if (!this.isDead) {
        const characterX = this.getCharacterX();
        const newDirection = characterX > this.x ? 1 : -1;

        // Only change direction if we can turn and direction is different
        if (this.canTurn && newDirection !== this.currentDirection) {
          this.currentDirection = newDirection;
          this.canTurn = false;

          // Reset turn ability after 1 second
          setTimeout(() => {
            this.canTurn = true;
          }, 1000);
        }

        this.x += 1 * this.currentDirection;
      }
    }, speed);
  }

  checkIfDead() {
    if (this.health < 10) {
      this.isHurt = false;
      this.isDead = true;
    }
  }
}
