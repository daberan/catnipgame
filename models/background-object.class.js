class BackgroundObject extends MovableObject {
  constructor(imagePath, x, y) {
    super().loadImage(imagePath);

    this.y = y;
    this.x = x;

    this.width = 320;
    this.height = 180;
  }
}
