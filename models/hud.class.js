class Hud {
  img;
  width = 320;
  height = 180;
  x = 0;
  y = 0;
  imageCache = {};
  imageSequence = ["./img/hud/hud100.png", "./img/hud/hud090.png", "./img/hud/hud080.png", "./img/hud/hud070.png", "./img/hud/hud060.png", "./img/hud/hud050.png", "./img/hud/hud040.png", "./img/hud/hud030.png", "./img/hud/hud020.png", "./img/hud/hud010.png", "./img/hud/hud000.png"];

  constructor() {
    this.loadImage("./img/hud/health_bar.png");
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

  setHealthBarImage(energy) {
    const i = this.convertEnergyToIndex(energy);
    this.img = this.imageCache[this.imageSequence[i]];
  }

  convertEnergyToIndex(energy) {
    if (energy === 100) return 0;
    if (energy === 90) return 1;
    if (energy === 80) return 2;
    if (energy === 70) return 3;
    if (energy === 60) return 4;
    if (energy === 50) return 5;
    if (energy === 40) return 6;
    if (energy === 30) return 7;
    if (energy === 20) return 8;
    if (energy === 10) return 9;
    if (energy === 0) return 10;
  }
}
