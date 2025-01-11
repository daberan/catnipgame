class Winscreen {
  img;
  width = 320;
  height = 180;
  x = 0;
  y = 0;
  imageCache = {};

  world;

  constructor(canvas, world) {
    this.canvas = canvas;
    this.world = world;
    this.loadImage("./img/winscreen/win.png");
    this.addClickListener();
  }

  loadImage(path) {
    const img = new Image();
    img.src = path;
    this.imageCache[path] = img;
    this.img = img;
  }

  addClickListener() {
    this.canvas.addEventListener("click", (event) => {
      if (!this.world.blobmaster?.isDead) return; // Use optional chaining

      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;

      const clickX = (event.clientX - rect.left) * scaleX;
      const clickY = (event.clientY - rect.top) * scaleY;

      // Rectangle dimensions (100x50 in center)
      const buttonWidth = 100;
      const buttonHeight = 50;
      const buttonX = (this.width - buttonWidth) / 2;
      const buttonY = (this.height - buttonHeight) / 2;

      if (clickX >= buttonX && clickX <= buttonX + buttonWidth && clickY >= buttonY && clickY <= buttonY + buttonHeight) {
        restartGame();
      }
    });
  }
}
