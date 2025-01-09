class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  isCollisionEnabled = true;
  blobmaster;
  hud = new Hud();
  shitCounter = new ShitCounter();
  shit = [];
  ball = [];
  collectibleShit = [];
  shitAmmo = 4;
  lastCharacterDirection = 1;
  backgrounds = [
    {
      cameraxDivider: 0,
      imageSrcName: "sky.png",
    },
    {
      cameraxDivider: 1000,
      imageSrcName: "background-clouds2.png",
    },
    {
      cameraxDivider: 200,
      imageSrcName: "background-clouds1.png",
    },
    {
      cameraxDivider: 20,
      imageSrcName: "mountains2.png",
    },
    {
      cameraxDivider: 6,
      imageSrcName: "mountains1.png",
    },
    {
      cameraxDivider: 3,
      imageSrcName: "/ground2.png",
    },
    {
      cameraxDivider: 1,
      imageSrcName: "/ground_new.png",
      noTranslateBack: true,
    },
    {
      cameraxDivider: 1,
      imageSrcName: "/foreground2.png",
    },
  ];

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.spawnCollectibleShit();
    this.draw();
    this.setWorld();
    this.checkCollisions();
    this.checkThrowObjects();
    this.blobmaster = this.level.enemies.find((enemy) => enemy instanceof Blobmaster);

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
    this.handleBackgrounds(0);

    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.collectibleShit);
    this.addToMap(this.character);

    this.handleBackgrounds(7);

    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.shit);
    this.addObjectsToMap(this.ball);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.hud);
    this.addToMap(this.shitCounter);

    requestAnimationFrame(() => {
      this.draw();
    });
  }

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

  handleBackgrounds(start) {
    for (let index = start; index < this.backgrounds.length; index++) {
      this.drawBackground(this.backgrounds[index]);
    }
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

    if (obj2 instanceof Blob || obj2 instanceof Blobmaster || obj2 instanceof Ball) {
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
          this.handleRightCollision(enemy);
          this.handleLeftCollision(enemy);
          this.handleBottomCollision(enemy);

          if (this.checkCollisionSide(enemy, this.character) == "rightCollision" || this.checkCollisionSide(enemy, this.character) == "leftCollision") {
            sound = this.character.character_hurt_sound;
          }
          this.character.jump(sound);
          this.hud.setHealthBarImage(this.character.characterEnergy);
          this.enableCollision();
        }
      });
      this.checkFireballCollisions();
      this.checkShitCollisions();
      this.checkShitCollection();
    }, 10);
  }

  handleRightCollision(enemy) {
    if (this.checkCollisionSide(enemy, this.character) == "rightCollision") {
      this.handleCharacterHit(-1);
    }
  }

  handleLeftCollision(enemy) {
    if (this.checkCollisionSide(enemy, this.character) == "leftCollision") {
      this.handleCharacterHit(1);
    }
  }

  handleBottomCollision(enemy) {
    if (this.checkCollisionSide(enemy, this.character) == "bottomCollision") {
      enemy.health -= 10;
      enemy.isHurt = true;
      setTimeout(() => {
        enemy.isHurt = false;
      }, 450);
      this.killEnemy(enemy);
    }
  }

  checkShitCollisions() {
    this.level.enemies.forEach((enemy) => {
      this.shit.forEach((poop, index) => {
        if (this.isColliding(poop, enemy)) {
          this.isCollisionEnabled = false;
          enemy.health -= 10;
          enemy.isHurt = true;
          new Audio("./audio/coin.wav").play();
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

  checkFireballCollisions() {
    this.ball.forEach((ball) => {
      if (this.isColliding(this.character, ball)) {
        this.isCollisionEnabled = false;
        this.handleCharacterHit(0);
        this.character.jump();
        this.character.character_hurt_sound.play();
        this.hud.setHealthBarImage(this.character.characterEnergy);
        this.enableCollision();
        this.ball = [];
      }
    });
  }

  enableCollision() {
    setTimeout(() => {
      this.isCollisionEnabled = true;
    }, 250);
  }

  checkThrowObjects() {
    this.checkShitThrow();
    this.checkBallThrow();
  }

  checkShitThrow() {
    let shitCooldown = false;
    setInterval(() => {
      if (this.keyboard.P && !shitCooldown && this.shitAmmo > 0) {
        let poop = new Shit(this.character.x, this.character.y, this.checkCharacterDirection());
        this.shit.push(poop);
        this.shitAmmo--;
        new Audio("./audio/throw.wav").play();
        this.shitCounter.setShitCounterImage(this.shitAmmo);

        shitCooldown = true;
        setTimeout(() => {
          shitCooldown = false;
        }, 500);
      }
    }, 10);
  }

  checkBallThrow() {
    let ballCooldown = false;

    setInterval(() => {
      if (!ballCooldown && !this.blobmaster.isDead) {
        let flyBall = new Ball(this.blobmaster.x, this.blobmaster.y + this.blobmaster.height / 2, this.character);
        this.ball.push(flyBall);
        this.killBall();

        ballCooldown = true;
        setTimeout(() => {
          ballCooldown = false;
        }, 4000);
      }
    }, 10);
  }

  killBall() {
    setTimeout(() => {
      this.ball = [];
    }, 4000);
  }

  checkCharacterDirection() {
    if (this.keyboard.RIGHT) {
      this.lastCharacterDirection = 1;
    } else if (this.keyboard.LEFT) {
      this.lastCharacterDirection = -1;
    }
    return this.lastCharacterDirection;
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
    this.character.isDead = true;
    setTimeout(() => {
      this.character.isDead = false;
    }, 2000);
  }

  checkCollisionSide(enemy, obj1) {
    if (obj1.y < enemy.y + enemy.height && obj1.isAboveGround()) {
      console.log("bottomCollision");
      return "bottomCollision";
    }
    if (obj1.x < enemy.x && !obj1.isAboveGround()) {
      console.log("rightCollision");
      return "rightCollision";
    }
    if (obj1.x > enemy.x && !obj1.isAboveGround()) {
      console.log("leftCollision");
      return "leftCollision";
    }
  }

  spawnCollectibleShit() {
    for (let index = 0; index < 6; index++) {
      this.collectibleShit.push(new CollectibleShit());
    }
  }

  checkShitCollection() {
    this.collectibleShit.forEach((shit, index) => {
      if (this.isColliding(this.character, shit)) {
        this.collectibleShit.splice(index, 1);
        this.shitAmmo++;
        new Audio("./audio/coin.wav").play();
        this.shitCounter.setShitCounterImage(this.shitAmmo);
      }
    });
  }
}
