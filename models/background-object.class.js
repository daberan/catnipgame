class BackgroundObject extends MovableObject {
  constructor(imagePath, x, y) {
    super().loadImage(imagePath);

    // this.moveBackgroundLayer(parallaxFacor);

    this.y = y;
    this.x = x;
    console.log(this.x);

    this.width = 180;
    this.height = 320;
  }
}
