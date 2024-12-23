class Level {
  enemies;
  clouds;
  backgroundObjects;
  hud;
  level_end_x = 720;

  constructor(enemies, clouds, backgroundObjects, hud) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.hud = hud;
  }
}
