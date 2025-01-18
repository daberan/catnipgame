/**
 * Manages the game's start screen interface.
 * Handles start button interaction and game initialization.
 */
class StartScreen {
  /**
   * Creates start screen instance and initializes UI elements.
   * @param {HTMLCanvasElement} canvas - Game canvas element
   */
  constructor(canvas) {
    /** @type {HTMLCanvasElement} - Game canvas reference */
    this.canvas = canvas;
    /** @type {CanvasRenderingContext2D} - Canvas rendering context */
    this.ctx = canvas.getContext("2d");
    /** @type {HTMLImageElement} - Background image for start screen */
    this.backgroundImg = new Image();
    /** @type {number} - Screen width */
    this.width = 320;
    /** @type {number} - Screen height */
    this.height = 180;

    /** @type {number} - Width of clickable start area */
    this.clickAreaWidth = 140;
    /** @type {number} - Height of clickable start area */
    this.clickAreaHeight = 25;
    /** @type {number} - X position of clickable area */
    this.clickAreaX = this.width / 2 - this.clickAreaWidth / 2;
    /** @type {number} - Y position of clickable area */
    this.clickAreaY = this.height / 2 - 12;

    this.backgroundImg.src = "./img/startscreen/Startscreen.png";

    this.backgroundImg.onload = () => {
      this.draw();
      this.addClickListener();
      this.addMouseMoveListener();
    };
  }

  /**
   * Draws the start screen background image.
   */
  draw() {
    this.ctx.drawImage(this.backgroundImg, 0, 0, this.width, this.height);
  }

  /**
   * Adds mouse hover listener for start button area.
   * Changes cursor to pointer when over clickable area.
   */
  addMouseMoveListener() {
    this.canvas.addEventListener("mousemove", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;

      const mouseX = (event.clientX - rect.left) * scaleX;
      const mouseY = (event.clientY - rect.top) * scaleY;

      if (this.isClickInStartArea(mouseX, mouseY)) {
        this.canvas.style.cursor = "pointer";
      } else {
        this.canvas.style.cursor = "default";
      }
    });
  }

  /**
   * Adds click and touch listeners for game start interaction.
   */
  addClickListener() {
    this.canvas.addEventListener("click", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;

      const clickX = (event.clientX - rect.left) * scaleX;
      const clickY = (event.clientY - rect.top) * scaleY;

      if (this.isClickInStartArea(clickX, clickY)) {
        this.startGame();
      }
    });

    this.canvas.addEventListener(
      "touchstart",
      (event) => {
        event.preventDefault();

        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const touchX = (event.touches[0].clientX - rect.left) * scaleX;
        const touchY = (event.touches[0].clientY - rect.top) * scaleY;

        if (this.isClickInStartArea(touchX, touchY)) {
          this.startGame();
        }
      },
      { passive: false }
    );
  }

  /**
   * Checks if coordinates are within start button area.
   * @param {number} x - X coordinate to check
   * @param {number} y - Y coordinate to check
   * @returns {boolean} True if coordinates are within start area
   */
  isClickInStartArea(x, y) {
    return x >= this.clickAreaX && x <= this.clickAreaX + this.clickAreaWidth && y >= this.clickAreaY && y <= this.clickAreaY + this.clickAreaHeight;
  }

  /**
   * Clears the screen and initializes the game.
   */
  startGame() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    initializeGame();
  }
}
