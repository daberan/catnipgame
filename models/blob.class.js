class Blob extends MovableObject {
  sequence_idle = ["./img/enemies/blob/idle/blobIdle1.png", "./img/enemies/blob/idle/blobIdle2.png", "./img/enemies/blob/idle/blobIdle3.png", "./img/enemies/blob/idle/blobIdle4.png", "./img/enemies/blob/idle/blobIdle5.png", "./img/enemies/blob/idle/blobIdle6.png"];
  currentImage = Math.floor(Math.random() * 6);
  y = 100;
  world;

  // Audio setup
  audioContext = new AudioContext();
  gainNode = this.audioContext.createGain();
  pannerNode = this.audioContext.createStereoPanner();

  constructor() {
    super().loadImage("./img/enemies/blob/idle/blobIdle1.png");
    this.loadImages(this.sequence_idle);
    this.speed = Math.floor(Math.random() * 7) + 6;
    this.x = Math.round(100 + Math.random() * 150);

    // Set up audio nodes
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
    this.moveLeft(1000 / this.speed);
    setInterval(() => {
      let i = this.currentImage % this.sequence_idle.length;
      let path = this.sequence_idle[i];
      this.img = this.imageCache[path];

      // Play bounce sound when blob is at the bottom of its animation
      if (i === 3) {
        // Adjust this frame number if needed based on your animation
        if (this.audioContext.state === "suspended") {
          this.audioContext.resume();
        }
        this.updateAudio();
        this.blob_bounce_sound.play().catch((err) => console.log("Audio play error:", err));
      }

      this.currentImage++;
    }, 75);
  }
}
