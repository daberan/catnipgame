/**
 * Represents a collectible item in the game that can be picked up by the player.
 * Appears at random horizontal positions with fixed height.
 * @extends MovableObject
 */
class CollectibleShit extends MovableObject {
  /** @type {number} - Width of the collectible sprite */
  width = 16;
  /** @type {number} - Height of the collectible sprite */
  height = 16;
  /** @type {number} - Random horizontal position between 200 and 700 */
  x = Math.floor(Math.random() * 500) + 200;
  /** @type {number} - Fixed vertical position */
  y = 120;

  /**
   * Creates a new collectible instance and loads its sprite.
   */
  constructor() {
    super().loadImage("./img/shit/shit.png");
  }
}
