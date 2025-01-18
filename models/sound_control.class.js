/**
 * Manages game audio including sound effects and background music.
 * Provides mute functionality and touch/click controls.
 */
class Soundcontrol {
  /** @type {HTMLImageElement} - Current sound control icon */
  img;
  /** @type {number} - Control width */
  width = 320;
  /** @type {number} - Control height */
  height = 180;
  /** @type {number} - X position */
  x = -7;
  /** @type {number} - Y position */
  y = 7;
  /** @type {Object.<string, HTMLImageElement>} - Cached control images */
  imageCache = {};
  /** @type {string[]} - Sound control icon image paths */
  imageSequence = ["./img/soundcontrol/unmuted.png", "./img/soundcontrol/muted.png"];
  /** @type {boolean} - Current mute state */
  isMuted = false;
  /** @type {number} - Icon width */
  iconWidth = 16;
  /** @type {number} - Icon height */
  iconHeight = 16;
  /** @type {HTMLAudioElement} - Background music */
  theme;
  /** @type {HTMLAudioElement} - Boss fight music */
  bossTheme;
  /** @type {HTMLAudioElement} - Game over sound effect */
  gameOverSound;
  /** @type {HTMLAudioElement} - Victory sound effect */
  gameWinSound;
  /** @type {HTMLAudioElement} - Collection sound effect */
  shitSound;
  /** @type {HTMLAudioElement} - Throw sound effect */
  throwSound;
  /** @type {HTMLAudioElement} - Jump sound effect */
  character_jump_sound;
  /** @type {HTMLAudioElement} - Hurt sound effect */
  character_hurt_sound;
  /** @type {HTMLAudioElement} - Enemy jump sound effect */
  character_enemyJump_sound;
  /** @type {HTMLAudioElement} - Bounce sound effect */
  blob_bounce_sound;
  /** @type {World} - Reference to game world */
  world;

  /**
   * Initializes sound control with canvas and world references.
   * @param {HTMLCanvasElement} canvas - Game canvas
   * @param {World} world - Game world instance
   */
  constructor(canvas, world) {
    this.canvas = canvas;
    this.world = world;
    this.loadImage("./img/soundcontrol/unmuted.png");
    this.loadImages(this.imageSequence);
    this.addClickListener();
    this.addMouseMoveListener();
    this.initializeAudioFiles();

    this.theme.loop = true;
    this.bossTheme.loop = true;

    if (!this.isMuted) {
      this.playTheme();
    }
  }

  /**
   * Initializes all audio files used in the game.
   */
  initializeAudioFiles() {
    this.theme = new Audio("./audio/Thunderbirds.wav");
    this.bossTheme = new Audio("./audio/TheBloop.wav");
    this.gameOverSound = new Audio("./audio/gameover.mp3");
    this.gameWinSound = new Audio("./audio/win.mp3");
    this.shitSound = new Audio("./audio/coin.wav");
    this.throwSound = new Audio("./audio/throw.wav");
    this.character_jump_sound = new Audio("./audio/character_jump.mp3");
    this.character_hurt_sound = new Audio("./audio/hurt.wav");
    this.character_enemyJump_sound = new Audio("./audio/enemyJump3.wav");
    this.blob_bounce_sound = new Audio("./audio/blob_bounce1.wav");
  }

  /**
   * Plays blob bounce sound if not muted.
   */
  playBlobBounceSound() {
    if (!this.isMuted) this.blob_bounce_sound.play();
  }

  /**
   * Plays character jump sound if not muted.
   */
  playCharacterJumpSound() {
    if (!this.isMuted) this.character_jump_sound.play();
  }

  /**
   * Plays character hurt sound if not muted.
   */
  playCharacterHurtSound() {
    if (!this.isMuted) this.character_hurt_sound.play();
  }

  /**
   * Plays enemy jump sound if not muted.
   */
  playCharacterEnemyJumpSound() {
    if (!this.isMuted) this.character_enemyJump_sound.play();
  }

  /**
   * Plays throw sound if not muted.
   */
  playThrowSound() {
    if (!this.isMuted) this.throwSound.play();
  }

  /**
   * Plays collection sound if not muted.
   */
  playShitSound() {
    if (!this.isMuted) this.shitSound.play();
  }

  /**
   * Plays background music if not muted.
   */
  playTheme() {
    if (!this.isMuted) this.theme.play();
  }

  /**
   * Plays boss theme if not muted.
   */
  playBossTheme() {
    if (!this.isMuted) this.bossTheme.play();
  }

  /**
   * Plays game over sound if not muted.
   */
  playGameOverSound() {
    if (!this.isMuted) this.gameOverSound.play();
  }

  /**
   * Plays victory sound if not muted.
   */
  playGameWinSound() {
    if (!this.isMuted) this.gameWinSound.play();
  }

  /**
   * Loads and caches a single image.
   * @param {string} path - Path to the image file
   */
  loadImage(path) {
    const img = new Image();
    img.src = path;
    this.imageCache[path] = img;
    this.img = img;
  }

  /**
   * Loads and caches multiple images.
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
   * Adds mouse hover listener for sound control button.
   */
  addMouseMoveListener() {
    this.canvas.addEventListener("mousemove", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = (event.clientX - rect.left) * (this.width / rect.width);
      const mouseY = (event.clientY - rect.top) * (this.height / rect.height);

      const buttonX = this.width - 40;
      const buttonY = 10;
      const hitAreaSize = 40;

      if (mouseX >= buttonX && mouseX <= buttonX + hitAreaSize && mouseY >= buttonY && mouseY <= buttonY + hitAreaSize) {
        this.canvas.style.cursor = "pointer";
      } else {
        this.canvas.style.cursor = "default";
      }
    });
  }

  /**
   * Adds click/touch listener for sound control button.
   */
  addClickListener() {
    let touchTimeout;
    const handleInteraction = (event) => {
      event.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      let clickX, clickY;
      if (event.type === "touchstart") {
        clickX = (event.touches[0].clientX - rect.left) * (this.width / rect.width);
        clickY = (event.touches[0].clientY - rect.top) * (this.height / rect.height);
      } else {
        clickX = (event.clientX - rect.left) * (this.width / rect.width);
        clickY = (event.clientY - rect.top) * (this.height / rect.height);
      }
      const buttonX = this.width - 40;
      const buttonY = 10;
      const hitAreaSize = 40;
      if (clickX >= buttonX && clickX <= buttonX + hitAreaSize && clickY >= buttonY && clickY <= buttonY + hitAreaSize) {
        if (touchTimeout) {
          clearTimeout(touchTimeout);
        }
        if (event.type === "touchstart") {
          touchTimeout = setTimeout(() => {
            this.toggleSoundIcon();
          }, 100);
        } else {
          this.toggleSoundIcon();
        }
      }
    };

    this.canvas.addEventListener("click", handleInteraction);
    this.canvas.addEventListener("touchstart", handleInteraction, { passive: false });
  }

  /**
   * Toggles mute state and updates all audio volumes.
   */
  toggleSoundIcon() {
    this.isMuted = !this.isMuted;
    const imagePath = this.isMuted ? "./img/soundcontrol/muted.png" : "./img/soundcontrol/unmuted.png";
    this.img = this.imageCache[imagePath];
    if (this.world) {
      this.theme.volume = this.isMuted ? 0 : 1;
      this.bossTheme.volume = this.isMuted ? 0 : 1;
      this.gameOverSound.volume = this.isMuted ? 0 : 1;
      this.gameWinSound.volume = this.isMuted ? 0 : 1;
      this.shitSound.volume = this.isMuted ? 0 : 1;
      this.throwSound.volume = this.isMuted ? 0 : 1;
      this.character_jump_sound.volume = this.isMuted ? 0 : 1;
      this.character_hurt_sound.volume = this.isMuted ? 0 : 1;
      this.character_enemyJump_sound.volume = this.isMuted ? 0 : 1;
      this.blob_bounce_sound.volume = this.isMuted ? 0 : 1;
    }
  }
}
