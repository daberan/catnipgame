class Blobmaster extends MovableObject {
  sequence_idle = ["./img/enemies/blobmaster/blobmaster1.png", "./img/enemies/blobmaster/blobmaster2.png", "./img/enemies/blobmaster/blobmaster3.png", "./img/enemies/blobmaster/blobmaster4.png", "./img/enemies/blobmaster/blobmaster5.png", "./img/enemies/blobmaster/blobmaster6.png"];
  currentImage = Math.floor(Math.random() * 6);
  world;
  height = 64;
  width = 64;
  y = 67;

  audioContext = new AudioContext();
  gainNode = this.audioContext.createGain();
  pannerNode = this.audioContext.createStereoPanner();

  constructor() {
    super().loadImage("./img/enemies/blobmaster/blobmaster1.png");
    this.loadImages(this.sequence_idle);
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
      let i = this.currentImage % this.sequence_idle.length;
      let path = this.sequence_idle[i];
      this.img = this.imageCache[path];

      if (i === 3) {
        if (this.audioContext.state === "suspended") {
          this.audioContext.resume();
        }
        this.updateAudio();
        this.blob_bounce_sound.play().catch((err) => console.log("Audio play error:", err));
      }

      this.currentImage++;
    }, 100);
  }
}
