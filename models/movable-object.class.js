class MovableObject {
  x = 45;
  y = 100;
  img;
  height = 32;
  width = 32;

  imageCache = {};

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  moveRight() {
    console.log("Moving Right");
  }

  moveLeft() {}
}
