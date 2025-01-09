class ShitCounter {
  img;
  width = 320;
  height = 180;
  x = 0;
  y = 20;
  imageCache = {};
  imageSequence = ["./img/shitcounter/shitcounter1.png", "./img/shitcounter/shitcounter2.png", "./img/shitcounter/shitcounter3.png", "./img/shitcounter/shitcounter4.png", "./img/shitcounter/shitcounter5.png", "./img/shitcounter/shitcounter6.png", "./img/shitcounter/shitcounter7.png", "./img/shitcounter/shitcounter8.png", "./img/shitcounter/shitcounter9.png", "./img/shitcounter/shitcounter10.png", "./img/shitcounter/shitcounter11.png"];

  constructor() {
    this.loadImage("./img/shitcounter/shitcounter5.png");
    this.loadImages(this.imageSequence);
  }

  loadImage(path) {
    const img = new Image();
    img.src = path;
    this.imageCache[path] = img;
    this.img = img;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  setShitCounterImage(shitAmmo) {
    const i = shitAmmo;
    this.img = this.imageCache[this.imageSequence[i]];
  }
}
