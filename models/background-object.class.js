class BackgroundObject extends MovableObject {
  constructor(imagePath, y) {
    super().loadImage(imagePath);

    this.y = y;
    this.x = 0;

    this.width = 180;
    this.height = 320;
  }
}
