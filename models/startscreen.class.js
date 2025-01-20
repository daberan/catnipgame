/**
 * Manages the game's start screen interface.
 * Handles start button and home button interaction.
 */
class StartScreen {
  /**
   * Creates start screen instance and initializes UI elements.
   * Sets up the canvas, loads background image, and initializes interaction areas.
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

    /** @type {number} - Home button size */
    this.homeButtonSize = 30;
    /** @type {number} - Home button padding from edges */
    this.homeButtonPadding = 0;

    this.backgroundImg.src = "./img/startscreen/Startscreen.png";
    this.backgroundImg.onload = () => {
      this.draw();
      this.addAllListeners();
      this.addMouseMoveListener();
    };
  }

  /**
   * Draws the start screen background image on the canvas.
   * Called once the background image is loaded.
   */
  draw() {
    this.ctx.drawImage(this.backgroundImg, 0, 0, this.width, this.height);
  }

  /**
   * Adds mouse hover listener for both start and home buttons.
   * Changes cursor to pointer when hovering over interactive areas.
   */
  addMouseMoveListener() {
    this.canvas.addEventListener("mousemove", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const mouseX = (event.clientX - rect.left) * scaleX;
      const mouseY = (event.clientY - rect.top) * scaleY;
      if (this.isClickInStartArea(mouseX, mouseY) || this.isInHomeButtonArea(mouseX, mouseY)) {
        this.canvas.style.cursor = "pointer";
      } else {
        this.canvas.style.cursor = "default";
      }
    });
  }

  /**
   * Initializes all event listeners for the start screen.
   * Sets up both click and touch interactions.
   */
  addAllListeners() {
    this.addClickListener();
    this.addTouchListener();
  }

  /**
   * Adds click event listener for desktop interactions.
   * Handles both home button and start game button clicks.
   */
  addClickListener() {
    this.canvas.addEventListener("click", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const clickX = (event.clientX - rect.left) * scaleX;
      const clickY = (event.clientY - rect.top) * scaleY;
      this.handleHomeButtonClick(clickX, clickY);
      this.handleStartGameButtonClick(clickX, clickY);
    });
  }

  /**
   * Handles click interaction with the home button.
   * Reloads the page if click is within home button area.
   * @param {number} clickX - X coordinate of click
   * @param {number} clickY - Y coordinate of click
   */
  handleHomeButtonClick(clickX, clickY) {
    if (this.isInHomeButtonArea(clickX, clickY)) {
      location.reload();
      return;
    }
  }

  /**
   * Handles click interaction with the start game button.
   * Starts the game if click is within start button area.
   * @param {number} clickX - X coordinate of click
   * @param {number} clickY - Y coordinate of click
   */
  handleStartGameButtonClick(clickX, clickY) {
    if (this.isClickInStartArea(clickX, clickY)) {
      this.startGame();
    }
  }

  /**
   * Adds touch event listener for mobile interactions.
   * Handles both home button and start game button touches.
   */
  addTouchListener() {
    this.canvas.addEventListener(
      "touchstart",
      (event) => {
        event.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const touchX = (event.touches[0].clientX - rect.left) * scaleX;
        const touchY = (event.touches[0].clientY - rect.top) * scaleY;
        this.handleHomeButtonTouch(touchX, touchY);
        this.handleStartGameButtonTouch(touchX, touchY);
      },
      { passive: false }
    );
  }

  /**
   * Handles touch interaction with the home button.
   * Reloads the page if touch is within home button area.
   * @param {number} touchX - X coordinate of touch
   * @param {number} touchY - Y coordinate of touch
   */
  handleHomeButtonTouch(touchX, touchY) {
    if (this.isInHomeButtonArea(touchX, touchY)) {
      location.reload();
      return;
    }
  }

  /**
   * Handles touch interaction with the start game button.
   * Starts the game if touch is within start button area.
   * @param {number} touchX - X coordinate of touch
   * @param {number} touchY - Y coordinate of touch
   */
  handleStartGameButtonTouch(touchX, touchY) {
    if (this.isClickInStartArea(touchX, touchY)) {
      this.startGame();
    }
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
   * Checks if coordinates are within home button area.
   * @param {number} x - X coordinate to check
   * @param {number} y - Y coordinate to check
   * @returns {boolean} True if coordinates are within button area
   */
  isInHomeButtonArea(x, y) {
    return x >= this.homeButtonPadding && x <= this.homeButtonPadding + this.homeButtonSize && y >= this.homeButtonPadding && y <= this.homeButtonPadding + this.homeButtonSize;
  }

  /**
   * Clears the screen and initializes the game.
   * Removes the start screen and begins game initialization.
   */
  startGame() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    initializeGame();
  }
}
