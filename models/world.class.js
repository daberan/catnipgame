class World {
  character = new Character();
  enemies = [new Blob(), new Blob(), new Blob(), new Blob()];
  clouds = [new Cloud(), new Cloud()];
  backgroundObjects = [new BackgroundObject("./img/environment/background/sky.png", 0), new BackgroundObject("./img/environment/background/background-clouds2.png", 20), new BackgroundObject("./img/environment/background/background-clouds1.png", 20), new BackgroundObject("./img/environment/background/mountains2.png", 20), new BackgroundObject("./img/environment/background/mountains1.png", 20), new BackgroundObject("./img/environment/background/ground1.png", 20)];
  ctx;
  canvas;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.addObjectsToMap(this.backgroundObjects);
    this.addToMap(this.character);

    this.addObjectsToMap(this.enemies);
    this.addObjectsToMap(this.clouds);

    requestAnimationFrame(() => {
      this.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(obj) {
    this.ctx.drawImage(obj.img, obj.x, obj.y, obj.height, obj.width);
  }
}
