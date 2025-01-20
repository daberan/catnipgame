/**
 * Main game engine class that manages all game objects, rendering, and game logic.
 */
class World {
  /** @type {Character} - Player character instance */
  character = new Character();
  /** @type {Level} - Current level configuration */
  level = level1;
  /** @type {HTMLCanvasElement} - Game canvas element */
  canvas;
  /** @type {CanvasRenderingContext2D} - Canvas rendering context */
  ctx;
  /** @type {Keyboard} - Keyboard input handler */
  keyboard;
  /** @type {number} - Camera X offset for scrolling */
  camera_x = 0;
  /** @type {boolean} - Whether collision detection is active */
  isCollisionEnabled = true;
  /** @type {Blobmaster|null} - Boss enemy instance */
  blobmaster = null;
  /** @type {Hud} - Heads-up display instance */
  hud = new Hud();
  /** @type {Soundcontrol|null} - Sound manager instance */
  soundControl = null;
  /** @type {ShitCounter} - Ammunition counter instance */
  shitCounter = new ShitCounter();
  /** @type {Shit[]} - Active projectiles array */
  shit = [];
  /** @type {Ball[]} - Active enemy projectiles array */
  ball = [];
  /** @type {CollectibleShit[]} - Collectible items array */
  collectibleShit = [];
  /** @type {boolean} - Mobile device detection flag */
  isOnMobile = false;
  /** @type {GameOver|null} - Game over screen instance */
  gameOver = null;
  /** @type {Winscreen|null} - Victory screen instance */
  winscreen = null;
  /** @type {MobileControls|null} - Mobile controls instance */
  mobileControls = null;
  /** @type {Background[]} - Background layer configurations */
  backgrounds = BACKGROUNDS;
  /** @type {boolean} - Game over sound play flag */
  hasPlayedGameOverSound = false;
  /** @type {boolean} - Victory sound play flag */
  hasPlayedGameWinSound = false;

  /**
   * Creates new game world instance and initializes all components.
   * @param {HTMLCanvasElement} canvas - Game canvas element
   * @param {Keyboard} keyboard - Keyboard input handler
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.soundControl = new Soundcontrol(this.canvas, this);
    this.gameOver = new GameOver(canvas, this);
    this.winscreen = new Winscreen(canvas, this);
    this.mobileControls = new MobileControls();
    this.mobileControls.initialize(this);
    this.spawnCollectibleShit();
    this.draw();
    this.setWorld();
    this.spawnBlobs();
    this.checkCollisions();
    this.checkForBossSpawn();
    this.checkIfGameOver();
    this.checkIfGameWin();
    this.checkIfIsOnMobile();
  }

  /**
   * Sets up world references for all game objects.
   */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
    });
    this.character.initializeCharacter();
  }

  /**
   * Main render loop. Draws all game objects in correct order.
   */
  draw() {
    this.handleBackgroundDrawing(0);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.collectibleShit);
    this.addToMap(this.character);
    this.handleBackgroundDrawing(7);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.shit);
    this.addObjectsToMap(this.ball);
    this.ctx.translate(-this.camera_x, 0);
    this.addOverlaysToMap();
    requestAnimationFrame(() => {
      this.draw();
    });
  }

  addOverlaysToMap() {
    this.addToMap(this.hud);
    this.addToMap(this.soundControl);
    this.addToMap(this.shitCounter);
    this.addGameOverScreenToMap();
    this.addWinScreenToMap();
    this.addMobileControls();
  }

  addGameOverScreenToMap() {
    if (this.character.isDead) {
      this.addToMap(this.gameOver);
    }
  }

  addWinScreenToMap() {
    if (this.blobmaster && this.blobmaster.isDead) {
      this.addToMap(this.winscreen);
    }
  }

  addMobileControls() {
    if (this.isOnMobile) {
      this.addToMap(this.mobileControls);
    }
  }

  /**
   * Draws a background layer with parallax scrolling effect.
   * @param {Background} backgroundConfig - Background layer configuration
   */
  drawBackground(backgroundConfig) {
    let moveAmount = Math.floor(this.camera_x / backgroundConfig.cameraxDivider);
    this.ctx.translate(moveAmount, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.includes(backgroundConfig.imageSrcName)) {
        this.addToMap(bg);
      }
    });
    if (!backgroundConfig.noTranslateBack) {
      this.ctx.translate(-moveAmount, 0);
    }
  }

  /**
   * Handles drawing of multiple background layers.
   * @param {number} start - Starting layer index
   */
  handleBackgroundDrawing(start) {
    for (let index = start; index < this.backgrounds.length; index++) {
      this.drawBackground(this.backgrounds[index]);
    }
  }

  /**
   * Draws multiple game objects to the canvas.
   * @param {MovableObject[]} objects - Array of objects to draw
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Draws a single game object to the canvas.
   * @param {MovableObject} obj - Object to draw
   */
  addToMap(obj) {
    this.ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height);
    this.displayEnemyHealth(obj);
    if (enableCollisionFrames) {
      this.drawCollisionBox(obj);
    }
  }

  /**
   * Displays health value above enemies.
   * @param {MovableObject} obj - Object to display health for
   */
  displayEnemyHealth(obj) {
    if (obj instanceof Blob || obj instanceof Blobmaster) {
      this.ctx.font = "18px tiny5";
      this.ctx.fillStyle = "red";
      this.ctx.textAlign = "center";
      this.ctx.fillText(obj.health, obj.x + obj.width / 2, obj.y + 4);
    }
  }

  /**
   * Removes dead enemy from the game.
   * @param {MovableObject} obj - Enemy to remove
   */
  killEnemy(obj) {
    setTimeout(() => {
      if (obj.health < 10) {
        const index = this.level.enemies.indexOf(obj);
        if (index > -1) {
          this.level.enemies.splice(index, 1);
        }
      }
    }, 500);
  }

  /**
   * Spawns basic enemies over time up to maximum count.
   */
  spawnBlobs() {
    const maxBlobs = 5;
    let blobsSpawned = 0;
    setStoppableInterval(() => {
      if (blobsSpawned < maxBlobs) {
        let newBlob = new Blob();
        newBlob.world = this;
        this.level.enemies.push(newBlob);
        blobsSpawned++;
      }
    }, 4000);
  }

  /**
   * Checks conditions for boss spawn and spawns boss when ready.
   */
  checkForBossSpawn() {
    setStoppableInterval(() => {
      if (!this.blobmaster && this.level.enemies.every((enemy) => enemy instanceof Blob === false) && this.level.enemies.every((enemy) => !(enemy instanceof Blobmaster))) {
        this.soundControl.theme.pause();
        this.soundControl.playBossTheme();
        this.blobmaster = new Blobmaster();
        this.blobmaster.world = this;
        this.level.enemies.push(this.blobmaster);
      }
    }, 2000);
  }

  /**
   * Checks collision between two objects with adjustments for enemy hitboxes.
   * @param {MovableObject} obj1 - First object (usually player)
   * @param {MovableObject} obj2 - Second object to check collision with
   * @returns {boolean} Whether objects are colliding
   */
  isColliding(obj1, obj2) {
    let obj2Height = obj2.height;
    let obj2Y = obj2.y;
    if (obj2 instanceof Blob || obj2 instanceof Blobmaster || obj2 instanceof Ball) {
      obj2Height = obj2.height * 0.7;
      obj2Y = obj2.y + (obj2.height - obj2Height);
    }
    return obj1.x + obj1.width > obj2.x && obj1.y + obj1.height > obj2Y && obj1.x < obj2.x + obj2.width && obj1.y < obj2Y + obj2Height;
  }

  /**
   * Re-enables collision detection after delay.
   */
  enableCollision() {
    setTimeout(() => {
      this.isCollisionEnabled = true;
    }, 250);
  }

  /**
   * Main collision detection loop.
   * Checks player-enemy, projectile-enemy, and collection collisions.
   */
  checkCollisions() {
    setStoppableInterval(() => {
      if (!this.isCollisionEnabled || this.character.isDead) return;
      this.level.enemies.forEach((enemy) => {
        if (this.isColliding(this.character, enemy)) {
          this.isCollisionEnabled = false;
          this.checkCollisionSide(enemy);
          this.enableCollision();
        }
      });
      this.checkFireballCollisions();
      this.checkShitCollisions();
      this.checkShitCollection();
    }, 25);
  }

  /**
   * Determines collision side and triggers appropriate response.
   * @param {MovableObject} enemy - Enemy involved in collision
   * @param {MovableObject} [obj1=this.character] - First object (default: player)
   */
  checkCollisionSide(enemy, obj1 = this.character) {
    if (obj1.y < enemy.y + enemy.height && obj1.isAboveGround()) {
      this.handleBottomCollision(enemy);
    }
    if (obj1.y + obj1.height > enemy.y && obj1.isAboveGround()) {
      this.handleTopCollision();
    }
    if (obj1.x < enemy.x && !obj1.isAboveGround()) {
      this.handleRightCollision();
    }
    if (obj1.x > enemy.x && !obj1.isAboveGround()) {
      this.handleLeftCollision();
    }
  }

  /**
   * Handles collision from right side.
   */
  handleRightCollision() {
    this.character.handleHit(-1);
  }

  /**
   * Handles collision from left side.
   */
  handleLeftCollision() {
    this.character.handleHit(1);
  }

  /**
   * Handles collision from top.
   */
  handleTopCollision() {
    let sound = this.soundControl.character_enemyJump_sound;
    this.character.jump(sound);
  }

  /**
   * Handles collision from bottom.
   * @param {MovableObject} enemy - Enemy that was hit
   */
  handleBottomCollision(enemy) {
    enemy.health -= 10;
    enemy.isHurt = true;
    setTimeout(() => {
      enemy.isHurt = false;
    }, 450);
    this.killEnemy(enemy);
  }

  /**
   * Checks collisions with enemy projectiles.
   */
  checkFireballCollisions() {
    this.ball.forEach((ball) => {
      if (this.isColliding(this.character, ball)) {
        this.isCollisionEnabled = false;
        this.character.handleHit(0);
        this.enableCollision();
        this.ball = [];
      }
    });
  }

  /**
   * Checks collisions between player projectiles and enemies.
   */
  checkShitCollisions() {
    this.level.enemies.forEach((enemy) => {
      this.shit.forEach((poop, index) => {
        if (this.isColliding(poop, enemy)) {
          this.isCollisionEnabled = false;
          enemy.health -= 10;
          enemy.isHurt = true;
          this.soundControl.playShitSound();
          setTimeout(() => {
            enemy.isHurt = false;
          }, 450);
          this.killEnemy(enemy);
          this.enableCollision();
          this.shit.splice(index, 1);
        }
      });
    });
  }

  /**
   * Creates initial collectible items in the level.
   */
  spawnCollectibleShit() {
    const amount = 7;
    for (let i = 0; i < amount; i++) {
      const x = Math.floor(Math.random() * 750) + 180;
      this.collectibleShit.push(new CollectibleShit(x, 150));
    }
  }

  /**
   * Checks collisions with collectible items.
   */
  checkShitCollection() {
    this.collectibleShit.forEach((shit, index) => {
      if (this.isColliding(this.character, shit)) {
        this.collectibleShit.splice(index, 1);
        this.character.collectShit();
      }
    });
  }

  /**
   * Checks for game over condition and plays appropriate sound.
   */
  checkIfGameOver() {
    setInterval(() => {
      if (this.character.isDead && !this.hasPlayedGameOverSound) {
        this.soundControl.theme.pause();
        this.soundControl.bossTheme.pause();
        this.soundControl.playGameOverSound();
        this.hasPlayedGameOverSound = true;
        gameStarted = false;
      }
    }, 100);
  }

  /**
   * Checks for victory condition and plays appropriate sound.
   */
  checkIfGameWin() {
    setInterval(() => {
      if (this.blobmaster && this.blobmaster.isDead && !this.hasPlayedGameWinSound && !this.soundControl.isMuted) {
        this.soundControl.theme.pause();
        this.soundControl.bossTheme.pause();
        this.soundControl.playGameWinSound();
        this.hasPlayedGameWinSound = true;
      }
    }, 100);
  }

  /**
   * Detects if game is being played on a mobile device.
   * Uses touch capability checks to determine device type.
   */
  checkIfIsOnMobile() {
    setStoppableInterval(() => {
      if ("ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
        this.isOnMobile = true;
      } else {
        this.isOnMobile = false;
      }
    }, 1000);
  }
}
