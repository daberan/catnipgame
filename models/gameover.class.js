/**
 * Represents the game over screen that appears when the player dies.
 * Handles display and restart functionality for both mouse and touch inputs.
 */
class GameOver {
  /**
   * Creates a new GameOver instance.
   * @param {HTMLCanvasElement} canvas - The game's canvas element
   * @param {World} world - Reference to the game world
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

    /** @type {number} - Width of clickable restart area */
    this.clickAreaWidth = this.width * 0.5;
    /** @type {number} - Height of clickable restart area */
    this.clickAreaHeight = 50;
    /** @type {number} - X position of clickable area */
    this.clickAreaX = (this.width - this.clickAreaWidth) / 2;
    /** @type {number} - Y position of clickable area */
    this.clickAreaY = (this.height - this.clickAreaHeight) / 2;

    this.loadImage("./img/gameover/gameover.png");
    this.addClickListener();
  }

  /**
   * Loads and caches the game over screen image.
   * @param {string} path - Path to the image file
   */
  loadImage(path) {
    const img = new Image();
    img.src = path;
    this.imageCache[path] = img;
    this.img = img;
  }

  /**
   * Adds mouse and touch event listeners for restart functionality.
   * Checks if click/touch is within restart button area.
   */
  addClickListener() {
    this.canvas.addEventListener("click", (event) => {
      if (!this.world.character.isDead) return;

      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;

      const clickX = (event.clientX - rect.left) * scaleX;
      const clickY = (event.clientY - rect.top) * scaleY;

      if (clickX >= this.clickAreaX && clickX <= this.clickAreaX + this.clickAreaWidth && clickY >= this.clickAreaY && clickY <= this.clickAreaY + this.clickAreaHeight) {
        restartGame();
      }
    });

    this.canvas.addEventListener(
      "touchstart",
      (event) => {
        event.preventDefault();
        if (!this.world.character.isDead) return;

        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const touchX = (event.touches[0].clientX - rect.left) * scaleX;
        const touchY = (event.touches[0].clientY - rect.top) * scaleY;

        if (touchX >= this.clickAreaX && touchX <= this.clickAreaX + this.clickAreaWidth && touchY >= this.clickAreaY && touchY <= this.clickAreaY + this.clickAreaHeight) {
          restartGame();
        }
      },
      { passive: false }
    );
  }
}
