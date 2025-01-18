/**
 * Represents a game level containing all game objects and boundaries.
 */
class Level {
  /** @type {MovableObject[]} - Array of enemy objects in the level */
  enemies;
  /** @type {Cloud[]} - Array of cloud objects for background */
  clouds;
  /** @type {BackgroundObject[]} - Array of background scenery objects */
  backgroundObjects;
  /** @type {Hud} - Heads-up display for player status */
  hud;
  /** @type {ShitCounter} - Counter for projectile ammunition */
  shitCounter;
  /** @type {Shit[]} - Array of active projectiles */
  shit;
  /** @type {CollectibleShit[]} - Array of collectible items */
  collectibleShit;
  /** @type {number} - Right boundary of the level */
  level_end_x = 865;

  /**
   * Creates a new Level instance.
   * @param {MovableObject[]} enemies - Array of enemy objects
   * @param {Cloud[]} clouds - Array of cloud objects
   * @param {BackgroundObject[]} backgroundObjects - Array of background objects
   * @param {Hud} hud - HUD instance
   * @param {ShitCounter} shitCounter - Projectile counter instance
   * @param {CollectibleShit[]} [collectibleShit=[]] - Array of collectible items
   */
  constructor(enemies, clouds, backgroundObjects, hud, shitCounter, collectibleShit = []) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.hud = hud;
    this.shitCounter = shitCounter;
    this.collectibleShit = collectibleShit;
  }
}
