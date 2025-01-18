/**
 * Represents the heads-up display showing player health status.
 * Manages health bar visualization through different image states.
 */
class Hud {
  /** @type {HTMLImageElement} - Current HUD image */
  img;
  /** @type {number} - HUD width */
  width = 320;
  /** @type {number} - HUD height */
  height = 180;
  /** @type {number} - X position */
  x = 0;
  /** @type {number} - Y position */
  y = 0;
  /** @type {Object.<string, HTMLImageElement>} - Cached HUD images */
  imageCache = {};
  /** @type {string[]} - Array of health bar image paths for different health states */
  imageSequence = ["./img/hud/hud100.png", "./img/hud/hud090.png", "./img/hud/hud080.png", "./img/hud/hud070.png", "./img/hud/hud060.png", "./img/hud/hud050.png", "./img/hud/hud040.png", "./img/hud/hud030.png", "./img/hud/hud020.png", "./img/hud/hud010.png", "./img/hud/hud000.png"];

  /**
   * Initializes HUD with full health display.
   */
  constructor() {
    this.loadImage("./img/hud/hud100.png");
    this.loadImages(this.imageSequence);
  }

  /**
   * Loads and caches a single HUD image.
   * @param {string} path - Path to the image file
   */
  loadImage(path) {
    const img = new Image();
    img.src = path;
    this.imageCache[path] = img;
    this.img = img;
  }

  /**
   * Loads and caches multiple HUD images.
   * @param {string[]} arr - Array of image paths
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Updates health bar display based on current energy level.
   * @param {number} energy - Current energy level (0-100)
   */
  setHealthBarImage(energy) {
    const i = this.convertEnergyToIndex(energy);
    this.img = this.imageCache[this.imageSequence[i]];
  }

  /**
   * Converts energy value to corresponding image index.
   * @param {number} energy - Current energy level (0-100)
   * @returns {number} Index in imageSequence array
   */
  convertEnergyToIndex(energy) {
    if (energy === 100) return 0;
    if (energy === 90) return 1;
    if (energy === 80) return 2;
    if (energy === 70) return 3;
    if (energy === 60) return 4;
    if (energy === 50) return 5;
    if (energy === 40) return 6;
    if (energy === 30) return 7;
    if (energy === 20) return 8;
    if (energy === 10) return 9;
    if (energy === 0) return 10;
  }
}
