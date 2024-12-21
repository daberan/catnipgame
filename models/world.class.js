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
    // Add this line to set world reference for all enemies
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Sky (stationary)
    let skyMove = Math.floor(this.camera_x / 0);
    this.ctx.translate(skyMove, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.includes("sky.png")) {
        this.addToMap(bg);
      }
    });
    this.ctx.translate(-skyMove, 0);

    // Far clouds (slowest)
    let farCloudsMove = Math.floor(this.camera_x / 1000);
    this.ctx.translate(farCloudsMove, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.includes("background-clouds2.png")) {
        this.addToMap(bg);
      }
    });
    this.ctx.translate(-farCloudsMove, 0);

    // Close clouds
    let closeCloudsMove = Math.floor(this.camera_x / 200);
    this.ctx.translate(closeCloudsMove, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.includes("background-clouds1.png")) {
        this.addToMap(bg);
      }
    });
    this.ctx.translate(-closeCloudsMove, 0);

    // Far mountains
    let farMountainsMove = Math.floor(this.camera_x / 20);
    this.ctx.translate(farMountainsMove, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.includes("mountains2.png")) {
        this.addToMap(bg);
      }
    });
    this.ctx.translate(-farMountainsMove, 0);

    // Close mountains
    let closeMountainsMove = Math.floor(this.camera_x / 6);
    this.ctx.translate(closeMountainsMove, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.includes("mountains1.png")) {
        this.addToMap(bg);
      }
    });
    this.ctx.translate(-closeMountainsMove, 0);

    // Close ground
    let closeGroundMove = Math.floor(this.camera_x / 3);
    this.ctx.translate(closeGroundMove, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.endsWith("/ground2.png")) {
        this.addToMap(bg);
      }
    });
    this.ctx.translate(-closeGroundMove, 0);

    // Main ground and game objects (full camera movement)
    this.ctx.translate(this.camera_x, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.endsWith("/ground_new.png")) {
        this.addToMap(bg);
      }
    });

    this.addObjectsToMap(this.level.enemies);
    this.addToMap(this.character);

    // foreground1
    let foreGroundMove = Math.floor(this.camera_x / 1);
    this.ctx.translate(foreGroundMove, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.endsWith("/foreground2.png")) {
        this.addToMap(bg);
      }
    });
    this.ctx.translate(-foreGroundMove, 0);

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
