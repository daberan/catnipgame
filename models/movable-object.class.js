class MovableObject {
  x = 45;
  y = 100;
  img;
  height = 32;
  width = 32;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  moveRight() {
    console.log("Moving Right");
  }

  moveLeft() {}
}
