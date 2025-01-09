class Level {
  enemies;
  clouds;
  backgroundObjects;
  hud;
  shitCounter;
  shit;
  collectibleShit;
  level_end_x = 720;

  constructor(enemies, clouds, backgroundObjects, hud, shitCounter, collectibleShit = []) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.hud = hud;
    this.shitCounter = shitCounter;
    this.collectibleShit = collectibleShit;
  }
}
