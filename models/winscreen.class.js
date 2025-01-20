/**
 * Manages the victory screen display and interactions.
 * Shows when player defeats the boss and handles game restart and home navigation.
 */
class Winscreen {
  /**
   * Creates winscreen instance and initializes UI elements.
   * @param {HTMLCanvasElement} canvas - Game canvas element
   * @param {World} world - Reference to game world
   */
  constructor(canvas, world) {
    /** @type {HTMLCanvasElement} - Canvas element reference */
    this.canvas = canvas;
    /** @type {World} - Game world reference */
    this.world = world;
    /** @type {number} - Screen width */
    this.width = 320;
    /** @type {number} - Screen height */
    this.height = 180;
    /** @type {number} - X position */
    this.x = 0;
    /** @type {number} - Y position */
    this.y = 0;
    /** @type {Object.<string, HTMLImageElement>} - Cached images */
    this.imageCache = {};

    /** @type {HTMLImageElement} - Victory screen image */
    this.img = null;

    /** @type {number} - Width of clickable restart area */
    this.clickAreaWidth = 140;
    /** @type {number} - Height of clickable restart area */
    this.clickAreaHeight = 25;
    /** @type {number} - X position of clickable area */
    this.clickAreaX = this.width / 2 - this.clickAreaWidth / 2;
    /** @type {number} - Y position of clickable area */
    this.clickAreaY = this.height / 2 - 12;

    /** @type {number} - Home button size */
    this.homeButtonSize = 30;
    /** @type {number} - Home button padding from edges */
    this.homeButtonPadding = 0;

    this.loadImage("./img/winscreen/win.png");
    this.addAllListeners();
    this.addMouseMoveListener();
  }

  /**
   * Loads and caches the victory screen image.
   * @param {string} path - Path to the image file
   */
  loadImage(path) {
    const img = new Image();
    img.src = path;
    this.imageCache[path] = img;
    this.img = img;
  }

  /**
   * Adds mouse hover listener for restart and home buttons.
   * Changes cursor to pointer when hovering over interactive areas.
   * Only active when boss is defeated.
   */
  addMouseMoveListener() {
    this.canvas.addEventListener("mousemove", (event) => {
      if (!this.world.blobmaster?.isDead) return;
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const mouseX = (event.clientX - rect.left) * scaleX;
      const mouseY = (event.clientY - rect.top) * scaleY;
      if (this.isClickInArea(mouseX, mouseY) || this.isInHomeButtonArea(mouseX, mouseY)) {
        this.canvas.style.cursor = "pointer";
      } else {
        this.canvas.style.cursor = "default";
      }
    });
  }

  /**
   * Initializes all event listeners for the victory screen.
   * Sets up both click and touch interactions.
   */
  addAllListeners() {
    this.addClickListener();
    this.addTouchListener();
  }

  /**
   * Adds touch event listener for mobile interactions.
   * Handles both home button and restart area touches.
   */
  addTouchListener() {
    this.canvas.addEventListener(
      "touchstart",
      (event) => {
        event.preventDefault();
        if (!this.world.blobmaster?.isDead) return;
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const touchX = (event.touches[0].clientX - rect.left) * scaleX;
        const touchY = (event.touches[0].clientY - rect.top) * scaleY;
        this.checkIfTouchHome(touchX, touchY);
        this.checkIfTouchArea(touchX, touchY);
      },
      { passive: false }
    );
  }

  /**
   * Checks if touch coordinates are within home button area and reloads page if true.
   * @param {number} touchX - X coordinate of touch
   * @param {number} touchY - Y coordinate of touch
   */
  checkIfTouchHome(touchX, touchY) {
    if (this.isInHomeButtonArea(touchX, touchY)) {
      location.reload();
      return;
    }
  }

  /**
   * Adds click event listener for desktop interactions.
   * Handles both home button and restart area clicks.
   */
  addClickListener() {
    this.canvas.addEventListener("click", (event) => {
      if (!this.world.blobmaster?.isDead) return;
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const clickX = (event.clientX - rect.left) * scaleX;
      const clickY = (event.clientY - rect.top) * scaleY;
      this.checkIfClickOnHome(clickX, clickY);
      this.checkIfClickArea(clickX, clickY);
    });
  }

  /**
   * Checks if click coordinates are within home button area and reloads page if true.
   * @param {number} clickX - X coordinate of click
   * @param {number} clickY - Y coordinate of click
   */
  checkIfClickOnHome(clickX, clickY) {
    if (this.isInHomeButtonArea(clickX, clickY)) {
      location.reload();
      return;
    }
  }

  /**
   * Checks if click coordinates are within restart area and restarts game if true.
   * @param {number} clickX - X coordinate of click
   * @param {number} clickY - Y coordinate of click
   */
  checkIfClickArea(clickX, clickY) {
    if (this.isClickInArea(clickX, clickY)) {
      restartGame();
    }
  }

  /**
   * Checks if touch coordinates are within restart area and restarts game if true.
   * @param {number} touchX - X coordinate of touch
   * @param {number} touchY - Y coordinate of touch
   */
  checkIfTouchArea(touchX, touchY) {
    if (this.isClickInArea(touchX, touchY)) {
      restartGame();
    }
  }

  /**
   * Checks if coordinates are within restart button area.
   * @param {number} x - X coordinate to check
   * @param {number} y - Y coordinate to check
   * @returns {boolean} True if coordinates are within restart area
   */
  isClickInArea(x, y) {
    return x >= this.clickAreaX && x <= this.clickAreaX + this.clickAreaWidth && y >= this.clickAreaY && y <= this.clickAreaY + this.clickAreaHeight;
  }

  /**
   * Checks if coordinates are within home button area.
   * @param {number} x - X coordinate to check
   * @param {number} y - Y coordinate to check
   * @returns {boolean} True if coordinates are within home button area
   */
  isInHomeButtonArea(x, y) {
    return x >= this.homeButtonPadding && x <= this.homeButtonPadding + this.homeButtonSize && y >= this.homeButtonPadding && y <= this.homeButtonPadding + this.homeButtonSize;
  }
}
