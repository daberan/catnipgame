class Blob extends MovableObject {
  sequence_idle = ["./img/enemies/blob/idle/blobIdle1.png", "./img/enemies/blob/idle/blobIdle2.png", "./img/enemies/blob/idle/blobIdle3.png", "./img/enemies/blob/idle/blobIdle4.png", "./img/enemies/blob/idle/blobIdle5.png", "./img/enemies/blob/idle/blobIdle6.png"];
  currentImage = Math.floor(Math.random() * 6);

  constructor() {
    super().loadImage("./img/enemies/blob/idle/blobIdle1.png");
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
