class World {
  character = new Character();
  enemies = [new Blob(), new Blob(), new Blob(), new Blob()];
  ctx;
  canvas;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.character.img, this.character.x, this.character.y, this.character.height, this.character.width);
    this.enemies.forEach((blob) => {
      this.ctx.drawImage(blob.img, blob.x, blob.y, blob.height, blob.width);
    });
    requestAnimationFrame(() => {
      this.draw();
    });
  }
}
