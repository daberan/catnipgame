class Blobmaster extends MovableObject {
  sequence_idle = ["./img/enemies/blobmaster/blobmaster1.png", "./img/enemies/blobmaster/blobmaster2.png", "./img/enemies/blobmaster/blobmaster3.png", "./img/enemies/blobmaster/blobmaster4.png", "./img/enemies/blobmaster/blobmaster5.png", "./img/enemies/blobmaster/blobmaster6.png"];
  currentImage = Math.floor(Math.random() * 6);
  height = 64;
  width = 64;
  y = 67;

  constructor() {
    super().loadImage("./img/enemies/blobmaster/blobmaster1.png");
    this.loadImages(this.sequence_idle);
    this.speed = Math.floor(Math.random() * 7) + 6;
    this.x = Math.round(100 + Math.random() * 150);

    this.animate();
  }

  animate() {
    this.moveLeft(1000 / this.speed);
    setInterval(() => {
      let i = this.currentImage % this.sequence_idle.length;
      let path = this.sequence_idle[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 75);
  }
}
