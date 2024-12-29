class Blobmaster extends MovableObject {
  sequence_idle = ["./img/enemies/blobmaster/blobmaster1.png", "./img/enemies/blobmaster/blobmaster2.png", "./img/enemies/blobmaster/blobmaster3.png", "./img/enemies/blobmaster/blobmaster4.png", "./img/enemies/blobmaster/blobmaster5.png", "./img/enemies/blobmaster/blobmaster6.png"];
  sequence_hurt = ["./img/enemies/blobmaster/Blobmaster_hurtnew1.png", "./img/enemies/blobmaster/Blobmaster_hurtnew2.png"];
  sequence_dying = ["./img/enemies/blobmaster/Blobmaster_dying1.png", "./img/enemies/blobmaster/Blobmaster_dying2.png"];
  currentImage = Math.floor(Math.random() * 6);
  world;
  height = 64;
  width = 64;
  y = 67;
  health = 60;
  isHurt = false;
  isDead = false;
  currentSequence = this.sequence_idle;
  walkDirection = 1;
  blobmasterX = 1;

  audioContext = new AudioContext();
  gainNode = this.audioContext.createGain();
  pannerNode = this.audioContext.createStereoPanner();

  constructor() {
    super().loadImage("./img/enemies/blobmaster/blobmaster1.png");
    this.loadImages(this.sequence_idle);
    this.loadImages(this.sequence_hurt);
    this.loadImages(this.sequence_dying);

    this.speed = Math.floor(Math.random() * 7) + 6;
    this.x = Math.round(100 + Math.random() * 150);

    this.blob_bounce_sound = new Audio("./audio/bounce3.wav");
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

    let volume = 1 - distance / maxDistance;
    volume = Math.max(0, Math.min(1, volume));
    this.gainNode.gain.value = volume;

    const panMaxDistance = 200;
    const relativeX = this.x - characterX;
    let panValue = relativeX / panMaxDistance;
    panValue = Math.max(-1, Math.min(1, panValue)) * 0.7;
    this.pannerNode.pan.value = panValue;
  }

  animate() {
    this.moveLeft(1000 / this.speed);
    setInterval(() => {
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
        this.blob_bounce_sound.play();
      }

      this.currentImage++;
    }, 100);
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
