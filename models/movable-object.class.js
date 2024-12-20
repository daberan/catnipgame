class MovableObject {
  x = 0;
  y = 0;
  img;
  height = 32;
  width = 32;
  rndmSpeed = Math.floor(Math.random() * 7) + 6;
  speed = 500;
  imageCache = {};
  parallaxFactor = 10;

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

  // animate() {
  //   this.moveLeft();
  // }

  // moveRight() {
  //   console.log("Moving Right");
  // }

  moveLeft(speed) {
    setInterval(() => {
      this.x -= 1;
    }, speed);
  }

  // moveBackgroundLayer(parallaxFactor) {
  //   setInterval(() => {
  //     this.x -= 1;
  //   }, 50 * parallaxFactor);
  // }
}
