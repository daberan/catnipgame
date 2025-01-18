/**
 * Handles touch-based controls for mobile devices.
 * Manages virtual buttons and touch input processing.
 */
class MobileControls {
  /** @type {number} - Control overlay width */
  width = 320;
  /** @type {number} - Control overlay height */
  height = 180;
  /** @type {number} - X position of controls overlay */
  x = 0;
  /** @type {number} - Y position of controls overlay */
  y = 0;
  /** @type {Object.<string, HTMLImageElement>} - Cached control images */
  imageCache = {};
  /** @type {World} - Reference to game world instance */
  world;

  /**
   * @type {Object.<string, {
   *   xPercent: number,
   *   yPercent: number,
   *   widthPercent: number,
   *   heightPercent: number
   * }>} - Button layout configuration
   */
  buttons = {
    left: {
      xPercent: 3.5,
      yPercent: 65,
      widthPercent: 12,
      heightPercent: 30,
    },
    right: {
      xPercent: 16.5,
      yPercent: 65,
      widthPercent: 12,
      heightPercent: 30,
    },
    A: {
      xPercent: 68,
      yPercent: 73,
      widthPercent: 15,
      heightPercent: 25,
    },
    B: {
      xPercent: 84,
      yPercent: 55,
      widthPercent: 15,
      heightPercent: 25,
    },
  };

  /**
   * Creates mobile controls instance and loads control overlay image.
   */
  constructor() {
    this.loadImage("./img/mobile_controls/mobile_controls.png");
  }

  /**
   * Loads and caches the control overlay image.
   * @param {string} path - Path to the image file
   */
  loadImage(path) {
    const img = new Image();
    img.src = path;
    this.imageCache[path] = img;
    this.img = img;
  }

  /**
   * Initializes controls with world reference and sets up touch listeners.
   * @param {World} world - Game world instance
   */
  initialize(world) {
    this.world = world;
    if (world.canvas) {
      this.addTouchListeners(world.canvas);
    }
  }

  /**
   * Sets up touch event listeners on the game canvas.
   * @param {HTMLCanvasElement} canvas - Game canvas element
   */
  addTouchListeners(canvas) {
    canvas.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        this.checkTouches(e.touches, canvas);
      },
      { passive: false }
    );

    canvas.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
        this.checkTouches(e.touches, canvas);
      },
      { passive: false }
    );

    canvas.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        if (e.touches.length === 0) {
          this.resetControls();
        } else {
          this.checkTouches(e.touches, canvas);
        }
      },
      { passive: false }
    );
  }

  /**
   * Processes active touches and activates corresponding buttons.
   * @param {TouchList} touches - List of active touch points
   * @param {HTMLCanvasElement} canvas - Game canvas element
   */
  checkTouches(touches, canvas) {
    this.resetControls();

    const rect = canvas.getBoundingClientRect();
    const scaleX = this.width / rect.width;
    const scaleY = this.height / rect.height;

    for (let touch of touches) {
      const x = (touch.clientX - rect.left) * scaleX;
      const y = (touch.clientY - rect.top) * scaleY;

      Object.entries(this.buttons).forEach(([button, area]) => {
        const scaledArea = this.getScaledButtonArea(area);
        if (this.isInButton(x, y, scaledArea)) {
          this.activateButton(button);
        }
      });
    }
  }

  /**
   * Activates the corresponding control based on button pressed.
   * @param {string} button - Button identifier ('left', 'right', 'A', or 'B')
   */
  activateButton(button) {
    switch (button) {
      case "left":
        this.world.keyboard.LEFT = true;
        this.world.keyboard.RIGHT = false;
        break;
      case "right":
        this.world.keyboard.RIGHT = true;
        this.world.keyboard.LEFT = false;
        break;
      case "B":
        this.world.keyboard.UP = true;
        break;
      case "A":
        this.world.keyboard.P = true;
        break;
    }
  }

  /**
   * Calculates actual button dimensions from percentage values.
   * @param {{xPercent: number, yPercent: number, widthPercent: number, heightPercent: number}} button - Button configuration
   * @returns {{x: number, y: number, width: number, height: number}} Calculated button dimensions
   */
  getScaledButtonArea(button) {
    return {
      x: (this.width * button.xPercent) / 100,
      y: (this.height * button.yPercent) / 100,
      width: (this.width * button.widthPercent) / 100,
      height: (this.height * button.heightPercent) / 100,
    };
  }

  /**
   * Checks if a touch point is within a button's area.
   * @param {number} x - Touch X coordinate
   * @param {number} y - Touch Y coordinate
   * @param {{x: number, y: number, width: number, height: number}} area - Button area
   * @returns {boolean} Whether touch is within button area
   */
  isInButton(x, y, area) {
    return x >= area.x && x <= area.x + area.width && y >= area.y && y <= area.y + area.height;
  }

  /**
   * Resets all control states to inactive.
   */
  resetControls() {
    if (this.world?.keyboard) {
      this.world.keyboard.LEFT = false;
      this.world.keyboard.RIGHT = false;
      this.world.keyboard.UP = false;
      this.world.keyboard.P = false;
    }
  }
}
