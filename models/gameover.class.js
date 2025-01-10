class GameOver {
  img;
  width = 320;
  height = 180;
  x = 0;
  y = 0;
  imageCache = {};

  world;

  constructor(canvas, world) {
    this.canvas = canvas;
    this.world = world; // Store world reference
    this.loadImage("./img/gameover/gameover.png");
    this.addClickListener();
    // stopGame();
  }

  loadImage(path) {
    const img = new Image();
    img.src = path;
    this.imageCache[path] = img;
    this.img = img;
  }

  addClickListener() {
    this.canvas.addEventListener("click", (event) => {
      if (!this.world.character.isDead) return;

      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;

      const clickX = (event.clientX - rect.left) * scaleX;
      const clickY = (event.clientY - rect.top) * scaleY;

      // Rectangle dimensions (100x50 in center)
      const buttonWidth = 100;
      const buttonHeight = 50;
      const buttonX = (this.width - buttonWidth) / 2; // Center horizontally
      const buttonY = (this.height - buttonHeight) / 2; // Center vertically

      if (clickX >= buttonX && clickX <= buttonX + buttonWidth && clickY >= buttonY && clickY <= buttonY + buttonHeight && this.world.character.isDead) {
        restartGame();
      }
    });
  }
}
