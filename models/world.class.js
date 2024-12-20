class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
  }

  setWorld() {
    this.character.world = this;
  }

  // In world.class.js
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw sky layers (moves every 5 pixels)
    let skyMove = Math.floor(this.camera_x / 0);
    this.ctx.translate(skyMove, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.includes("sky.png")) {
        this.addToMap(bg);
      }
    });
    this.ctx.translate(-skyMove, 0);

    // Draw far clouds (moves every 4 pixels)
    let farCloudsMove = Math.floor(this.camera_x / 1000);
    this.ctx.translate(farCloudsMove, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.includes("background-clouds2.png")) {
        this.addToMap(bg);
      }
    });
    this.ctx.translate(-farCloudsMove, 0);

    // Draw close clouds (moves every 3 pixels)
    let closeCloudsMove = Math.floor(this.camera_x / 200);
    this.ctx.translate(closeCloudsMove, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.includes("background-clouds1.png")) {
        this.addToMap(bg);
      }
    });
    this.ctx.translate(-closeCloudsMove, 0);

    // Draw far mountains (moves every 2 pixels)
    let farMountainsMove = Math.floor(this.camera_x / 20);
    this.ctx.translate(farMountainsMove, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.includes("mountains2.png")) {
        this.addToMap(bg);
      }
    });
    this.ctx.translate(-farMountainsMove, 0);

    // Draw close mountains (moves every 1.5 pixels)
    let closeMountainsMove = Math.floor(this.camera_x / 6);
    this.ctx.translate(closeMountainsMove, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.includes("mountains1.png")) {
        this.addToMap(bg);
      }
    });
    this.ctx.translate(-closeMountainsMove, 0);

    // Draw ground and other objects (full camera movement)
    this.ctx.translate(this.camera_x, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.includes("ground1.png")) {
        this.addToMap(bg);
      }
    });
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-this.camera_x, 0);

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
