/**
 * Manages the victory screen display and interactions.
 * Shows when player defeats the boss and handles game restart.
 */
class Winscreen {
  /** @type {HTMLImageElement} - Victory screen image */
  img;
  /** @type {number} - Screen width */
  width = 320;
  /** @type {number} - Screen height */
  height = 180;
  /** @type {number} - X position */
  x = 0;
  /** @type {number} - Y position */
  y = 0;
  /** @type {Object.<string, HTMLImageElement>} - Cached images */
  imageCache = {};
  /** @type {World} - Reference to game world */
  world;
  /** @type {number} - Width of clickable restart area */
  clickAreaWidth = 140;
  /** @type {number} - Height of clickable restart area */
  clickAreaHeight = 25;

  /**
   * Creates winscreen instance and initializes UI elements.
   * @param {HTMLCanvasElement} canvas - Game canvas element
   * @param {World} world - Reference to game world
   */
  constructor(canvas, world) {
    /** @type {HTMLCanvasElement} - Canvas reference */
    this.canvas = canvas;
    this.world = world;
    this.loadImage("./img/winscreen/win.png");
    this.addClickListener();
    this.addMouseMoveListener();
    this.clickAreaX = this.width / 2 - this.clickAreaWidth / 2;
    this.clickAreaY = this.height / 2 - 12;
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
   * Adds mouse hover listener for restart button area.
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

      if (this.isClickInArea(mouseX, mouseY)) {
        this.canvas.style.cursor = "pointer";
      } else {
        this.canvas.style.cursor = "default";
      }
    });
  }

  /**
   * Adds click listener for restart functionality.
   * Only active when boss is defeated.
   */
  addClickListener() {
    this.canvas.addEventListener("click", (event) => {
      if (!this.world.blobmaster?.isDead) return;
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const clickX = (event.clientX - rect.left) * scaleX;
      const clickY = (event.clientY - rect.top) * scaleY;

      if (this.isClickInArea(clickX, clickY)) {
        restartGame();
      }
    });
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
}
