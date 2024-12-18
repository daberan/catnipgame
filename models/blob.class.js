class Blob extends MovableObject {
  constructor() {
    super().loadImage("./img/enemies/blob/blob1.png");

    this.x = Math.round(100 + Math.random() * 150);
  }
}
