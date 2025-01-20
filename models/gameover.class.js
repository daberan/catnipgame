/**
 * Handles game over screen display and interactions.
 */
class GameOver {
  /** @type {Object} Default configuration for GameOver screen */
  static DEFAULT_CONFIG = {
    width: 320,
    height: 180,
    clickableWidth: 160,
    clickableHeight: 50,
    homeButtonSize: 30,
    homeButtonPadding: 0,
    gameOverImagePath: "./img/gameover/gameover.png",
  };

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {World} world
   */
  constructor(canvas, world) {
    this.canvas = canvas;
    this.world = world;
    this.initializeProperties();
    this.loadGameOverImage();
    this.setupEventListeners();
  }

  /**
   * Initializes all class properties with default configuration
   */
  initializeProperties() {
    const config = GameOver.DEFAULT_CONFIG;
    this.width = config.width;
    this.height = config.height;
    this.x = 0;
    this.y = 0;
    this.imageCache = {};
    this.clickArea = {
      width: config.clickableWidth,
      height: config.clickableHeight,
      x: (config.width - config.clickableWidth) / 2,
      y: (config.height - config.clickableHeight) / 2,
    };
    this.homeButton = {
      size: config.homeButtonSize,
      padding: config.homeButtonPadding,
    };
  }

  /**
   * Loads and caches the game over screen image
   */
  loadGameOverImage() {
    const img = new Image();
    img.src = GameOver.DEFAULT_CONFIG.gameOverImagePath;
    this.imageCache[GameOver.DEFAULT_CONFIG.gameOverImagePath] = img;
    this.img = img;
  }

  /**
   * Sets up all event listeners
   */
  setupEventListeners() {
    this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));
    this.canvas.addEventListener("click", (e) => this.handleInteraction(e));
    this.canvas.addEventListener("touchstart", (e) => this.handleInteraction(e), { passive: false });
  }

  /**
   * Handles mouse movement for cursor changes
   * @param {MouseEvent} event
   */
  handleMouseMove(event) {
    if (!this.world.character.isDead) return;

    const { x, y } = this.getScaledCoordinates(event);
    this.canvas.style.cursor = this.isInHomeButtonArea(x, y) ? "pointer" : "default";
  }

  /**
   * Handles both mouse clicks and touch events
   * @param {MouseEvent|TouchEvent} event
   */
  handleInteraction(event) {
    event.preventDefault();
    if (!this.world.character.isDead) return;
    const coords = event.type === "touchstart" ? this.getScaledCoordinates(event.touches[0]) : this.getScaledCoordinates(event);
    if (this.isInHomeButtonArea(coords.x, coords.y)) {
      location.reload();
      return;
    }
    if (this.isInRestartArea(coords.x, coords.y)) {
      restartGame();
    }
  }

  /**
   * Converts screen coordinates to canvas coordinates
   * @param {{clientX: number, clientY: number}} event
   * @returns {{x: number, y: number}}
   */
  getScaledCoordinates(event) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  isInHomeButtonArea(x, y) {
    const { padding, size } = this.homeButton;
    return x >= padding && x <= padding + size && y >= padding && y <= padding + size;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  isInRestartArea(x, y) {
    return x >= this.clickArea.x && x <= this.clickArea.x + this.clickArea.width && y >= this.clickArea.y && y <= this.clickArea.y + this.clickArea.height;
  }
}
