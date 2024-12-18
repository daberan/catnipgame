class Character extends MovableObject {
  sequence_idle = ["./img/character/idle/character_idle1.png", "./img/character/idle/character_idle2.png", "./img/character/idle/character_idle3.png", "./img/character/idle/character_idle4.png", "./img/character/idle/character_idle5.png", "./img/character/idle/character_idle6.png", "./img/character/idle/character_idle7.png"];
  currentImage = 0;

  constructor() {
    super().loadImage("./img/character/idle/character_idle1.png");
    this.loadImages(this.sequence_idle);

    this.animate();
  }

  animate() {
    setInterval(() => {
      let i = this.currentImage % this.sequence_idle.length;
      let path = this.sequence_idle[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 100);
  }

  jump() {}
}
