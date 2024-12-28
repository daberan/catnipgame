class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  isCollisionEnabled = true;
  hud = new Hud();
  shit = [];
  lastDirection = 1;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.checkCollisions();
    this.checkThrowObjects();

    let theme = new Audio("./audio/Thunderbirds.wav");
    theme.loop = true;

    document.addEventListener(
      "keydown",
      () => {
        theme.play();
      },
      { once: true }
    );
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Sky (stationary)
    let skyMove = Math.floor(this.camera_x / 0);
    this.ctx.translate(skyMove, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.includes("sky.png")) {
        this.addToMap(bg);
      }
    });
    this.ctx.translate(-skyMove, 0);

    // Far clouds (slowest)
    let farCloudsMove = Math.floor(this.camera_x / 1000);
    this.ctx.translate(farCloudsMove, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.includes("background-clouds2.png")) {
        this.addToMap(bg);
      }
    });
    this.ctx.translate(-farCloudsMove, 0);

    // Close clouds
    let closeCloudsMove = Math.floor(this.camera_x / 200);
    this.ctx.translate(closeCloudsMove, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.includes("background-clouds1.png")) {
        this.addToMap(bg);
      }
    });
    this.ctx.translate(-closeCloudsMove, 0);

    // Far mountains
    let farMountainsMove = Math.floor(this.camera_x / 20);
    this.ctx.translate(farMountainsMove, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.includes("mountains2.png")) {
        this.addToMap(bg);
      }
    });
    this.ctx.translate(-farMountainsMove, 0);

    // Close mountains
    let closeMountainsMove = Math.floor(this.camera_x / 6);
    this.ctx.translate(closeMountainsMove, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.includes("mountains1.png")) {
        this.addToMap(bg);
      }
    });
    this.ctx.translate(-closeMountainsMove, 0);

    // Close ground
    let closeGroundMove = Math.floor(this.camera_x / 3);
    this.ctx.translate(closeGroundMove, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.endsWith("/ground2.png")) {
        this.addToMap(bg);
      }
    });
    this.ctx.translate(-closeGroundMove, 0);

    // Main ground and game objects (full camera movement)
    this.ctx.translate(this.camera_x, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.endsWith("/ground_new.png")) {
        this.addToMap(bg);
      }
    });

    this.addObjectsToMap(this.level.enemies);
    this.addToMap(this.character);

    // foreground1
    let foreGroundMove = Math.floor(this.camera_x);
    this.ctx.translate(foreGroundMove, 0);
    this.level.backgroundObjects.forEach((bg) => {
      if (bg.img.src.endsWith("/foreground2.png")) {
        this.addToMap(bg);
      }
    });
    this.ctx.translate(-foreGroundMove, 0);

    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.shit);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.hud);

    requestAnimationFrame(() => {
      this.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(obj) {
    this.ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height);
    this.displayEnemyHealth(obj);
    if (enableCollisionFrames) {
      this.drawCollisionBox(obj);
    }
  }

  displayEnemyHealth(obj) {
    if (obj instanceof Blob || obj instanceof Blobmaster) {
      this.ctx.font = "18px tiny5";
      this.ctx.fillStyle = "red";
      this.ctx.textAlign = "center";
      this.ctx.fillText(obj.health, obj.x + obj.width / 2, obj.y + 4);
    }
  }

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

  drawCollisionBox(obj) {
    if (obj instanceof BackgroundObject || obj instanceof Cloud || obj instanceof Hud) {
      return;
    }
    this.ctx.beginPath();
    this.ctx.lineWidth = "1";
    if (obj instanceof Blob || obj instanceof Blobmaster) {
      this.ctx.strokeStyle = "red";
      const collisionHeight = obj.height * 0.7;
      this.ctx.rect(obj.x, obj.y + (obj.height - collisionHeight), obj.width, collisionHeight);
    } else if (obj instanceof Character) {
      this.ctx.strokeStyle = "green";
      this.ctx.rect(obj.x, obj.y, obj.width, obj.height);
    }
    this.ctx.stroke();
  }

  isColliding(obj1, obj2) {
    let obj2Height = obj2.height;
    let obj2Y = obj2.y;

    if (obj2 instanceof Blob || obj2 instanceof Blobmaster) {
      obj2Height = obj2.height * 0.7;
      obj2Y = obj2.y + (obj2.height - obj2Height);
    }

    return obj1.x + obj1.width > obj2.x && obj1.y + obj1.height > obj2Y && obj1.x < obj2.x + obj2.width && obj1.y < obj2Y + obj2Height;
  }

  checkCollisions() {
    setInterval(() => {
      if (!this.isCollisionEnabled) return;

      this.level.enemies.forEach((enemy) => {
        if (this.isColliding(this.character, enemy)) {
          this.isCollisionEnabled = false;
          let sound = this.character.character_enemyJump_sound;

          if (this.checkCollisionSide(enemy) == "rightCollision") {
            this.handleCharacterHit(-1);
            sound = this.character.character_hurt_sound;
          }

          if (this.checkCollisionSide(enemy) == "leftCollision") {
            this.handleCharacterHit(1);
            sound = this.character.character_hurt_sound;
          }

          if (this.checkCollisionSide(enemy) == "bottomCollision") {
            sound = this.character.character_enemyJump_sound;
            enemy.health -= 10;
            enemy.isHurt = true;
            setTimeout(() => {
              enemy.isHurt = false;
            }, 450);
            this.killEnemy(enemy);
          }

          this.character.jump(sound);
          this.hud.setHealthBarImage(this.character.characterEnergy);
          this.enableCollision();
        }
      });
    }, 10);
  }

  enableCollision() {
    setTimeout(() => {
      this.isCollisionEnabled = true;
    }, 250);
  }

  checkThrowObjects() {
    let shitCooldown = false;

    setInterval(() => {
      if (this.keyboard.P && !shitCooldown) {
        let poop = new Shit(this.character.x, this.character.y, this.checkCharacterDirection());
        this.shit.push(poop);

        shitCooldown = true;
        setTimeout(() => {
          shitCooldown = false;
        }, 500);
      }
    }, 10);
  }

  checkCharacterDirection() {
    if (this.keyboard.RIGHT) {
      this.lastDirection = 1;
      console.log("Direction: Right (1)");
      return 1;
    } else if (this.keyboard.LEFT) {
      this.lastDirection = -1;
      console.log("Direction: Left (-1)");
      return -1;
    }

    console.log("Last Direction:", this.lastDirection || 1);
    return this.lastDirection || 1;
  }

  reduceCharacterEnergy() {
    this.character.characterEnergy -= 10;
  }

  handleCharacterHit(speed) {
    this.reduceCharacterEnergy();
    this.character.character_hurt_sound.play();
    this.character.isHurt = true;
    if (this.character.characterEnergy <= 0) {
      this.killCharacter();
    }
    setTimeout(() => {
      this.character.isHurt = false;
    }, 750);
    setTimeout(() => {
      this.character.accelerateOnX(speed);
    }, 50);
  }

  killCharacter() {
    // this.character.character_dead_sound.play();
    this.character.isDead = true;

    setTimeout(() => {
      this.character.isDead = false;
    }, 2000);
  }

  checkCollisionSide(enemy) {
    if (this.character.y < enemy.y + enemy.height && this.character.isAboveGround()) {
      console.log("bottomCollision");

      return "bottomCollision";
    }
    if (this.character.x < enemy.x && !this.character.isAboveGround()) {
      console.log("rightCollision");
      return "rightCollision";
    }
    if (this.character.x > enemy.x && !this.character.isAboveGround()) {
      console.log("leftCollision");
      return "leftCollision";
    }
  }
}
