class StartScreen {
  canvas;
  ctx;
  backgroundImg = new Image();
  startButtonImg = new Image();
  buttonX;
  buttonY;
  buttonWidth;
  buttonHeight;

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.backgroundImg.src = "./img/startscreen/World.png";
    this.startButtonImg.src = "./img/startscreen/button.png";

    this.buttonWidth = 58;
    this.buttonHeight = 21;
    this.buttonX = canvas.width / 2 - this.buttonWidth / 2;
    this.buttonY = canvas.height / 2 - 12;

    Promise.all([this.loadImage(this.backgroundImg), this.loadImage(this.startButtonImg)]).then(() => {
      this.draw();
      this.addClickListener();
    });
  }

  loadImage(img) {
    return new Promise((resolve) => {
      img.onload = () => resolve();
    });
  }

  draw() {
    this.ctx.drawImage(this.backgroundImg, 0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.startButtonImg, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
  }

  addClickListener() {
    this.canvas.addEventListener("click", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;

      const clickX = (event.clientX - rect.left) * scaleX;
      const clickY = (event.clientY - rect.top) * scaleY;

      if (this.isClickOnButton(clickX, clickY)) {
        this.startGame();
      }
    });
  }

  isClickOnButton(x, y) {
    return x >= this.buttonX && x <= this.buttonX + this.buttonWidth && y >= this.buttonY && y <= this.buttonY + this.buttonHeight;
  }

  startGame() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.removeEventListener("click", this.addClickListener);
    initializeGame();
  }
}
