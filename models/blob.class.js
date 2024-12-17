class Blob extends MovableObject {
  constructor() {
    super().loadImage("./img/enemies/blob/blob1.png");

    this.x = Math.round(120 + Math.random() * 300);
  }
}
