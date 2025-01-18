/**
 * Manages the ammunition counter display in the game HUD.
 */
class ShitCounter {
  /** @type {HTMLImageElement} - Current counter image */
  img;
  /** @type {number} - Counter width */
  width = 320;
  /** @type {number} - Counter height */
  height = 180;
  /** @type {number} - X position */
  x = 0;
  /** @type {number} - Y position */
  y = 20;
  /** @type {Object.<string, HTMLImageElement>} - Cached counter images */
  imageCache = {};
  /** @type {string[]} - Array of counter image paths for different ammo amounts */
  imageSequence = ["./img/shitcounter/shitcounter1.png", "./img/shitcounter/shitcounter2.png", "./img/shitcounter/shitcounter3.png", "./img/shitcounter/shitcounter4.png", "./img/shitcounter/shitcounter5.png", "./img/shitcounter/shitcounter6.png", "./img/shitcounter/shitcounter7.png", "./img/shitcounter/shitcounter8.png", "./img/shitcounter/shitcounter9.png", "./img/shitcounter/shitcounter10.png", "./img/shitcounter/shitcounter11.png"];

  /**
   * Initializes counter with default image and preloads image sequence.
   */
  constructor() {
    this.loadImage("./img/shitcounter/shitcounter5.png");
    this.loadImages(this.imageSequence);
  }

  /**
   * Loads and caches a single counter image.
   * @param {string} path - Path to the image file
   */
  loadImage(path) {
    const img = new Image();
    img.src = path;
    this.imageCache[path] = img;
    this.img = img;
  }

  /**
   * Loads and caches multiple counter images.
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
   * Updates counter display based on current ammunition.
   * @param {number} shitAmmo - Current ammunition count
   */
  setShitCounterImage(shitAmmo) {
    const i = shitAmmo;
    this.img = this.imageCache[this.imageSequence[i]];
  }
}
