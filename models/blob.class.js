class Blob extends MovableObject {
  sequence_idle = ["./img/enemies/blob/idle/blobIdle1.png", "./img/enemies/blob/idle/blobIdle2.png", "./img/enemies/blob/idle/blobIdle3.png", "./img/enemies/blob/idle/blobIdle4.png", "./img/enemies/blob/idle/blobIdle5.png", "./img/enemies/blob/idle/blobIdle6.png"];
  sequence_hurt = ["./img/enemies/blob/hurt/blob_hurt1.png", "./img/enemies/blob/hurt/blob_hurt2.png"];
  sequence_dying = ["./img/enemies/blob/dead/blob_dead1.png", "./img/enemies/blob/dead/blob_dead2.png"];
  currentImage = Math.floor(Math.random() * 6);
  y = 100;
  world;
  health = 20;
  currentSequence = this.sequence_idle;

  audioContext = new AudioContext();
  gainNode = this.audioContext.createGain();
  pannerNode = this.audioContext.createStereoPanner();

  constructor() {
    super().loadImage("./img/enemies/blob/idle/blobIdle1.png");
    this.loadImages(this.sequence_idle);
    this.loadImages(this.sequence_hurt);
    this.loadImages(this.sequence_dying);
    this.speed = Math.floor(Math.random() * 10) + 6;
    this.x = Math.round(100 + Math.random() * 500);

    this.blob_bounce_sound = new Audio("./audio/blob_bounce1.wav");
    const track = this.audioContext.createMediaElementSource(this.blob_bounce_sound);
    track.connect(this.pannerNode);
    this.pannerNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    this.animate();
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

    // Volume based on distance
    let volume = (1 - distance / maxDistance) * 0.3;
    volume = Math.max(0, Math.min(1, volume));
    this.gainNode.gain.value = volume;

    // Stereo panning based on position
    const panMaxDistance = 200;
    const relativeX = this.x - characterX;
    let panValue = relativeX / panMaxDistance;
    panValue = Math.max(-1, Math.min(1, panValue)) * 0.7; // 70% max panning
    this.pannerNode.pan.value = panValue;
  }

  animate() {
    this.move(250 / this.speed);
    setInterval(() => {
      this.checkIfDead();
      this.updateCurrentAnimationSequence();
      let i = this.currentImage % this.currentSequence.length;
      let path = this.currentSequence[i];
      this.img = this.imageCache[path];

      // Play bounce sound when blob is at the bottom of its animation
      if (i === 3) {
        if (this.audioContext.state === "suspended") {
          this.audioContext.resume();
        }
        this.updateAudio();
        this.blob_bounce_sound.play();
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

  checkIfDead() {
    if (this.health < 10) {
      this.isHurt = false;
      this.isDead = true;
    }
  }
}
