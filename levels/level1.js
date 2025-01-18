/**
 * Creates a new array of enemy objects for the level.
 * Currently initializes with a single Blob enemy.
 *
 * @returns {Blob[]} Array containing enemy objects
 */
function getNewEnemies() {
  return [new Blob()];
}

/**
 * Level 1 configuration and initialization.
 * Creates a new Level instance with enemies, clouds, background objects, and HUD.
 * The level spans 6 screen widths (320px each) with repeating background layers.
 *
 * Level structure:
 * - Screen width: 320px
 * - Total width: 1920px (6 screens)
 * - Background layers (from back to front):
 *   1. Sky (y: 0)
 *   2. Background clouds 2 (y: 20)
 *   3. Background clouds 1 (y: 20)
 *   4. Mountains 2 (y: 20)
 *   5. Mountains 1 (y: 20)
 *   6. Ground 2 (y: 20)
 *   7. Ground variations (y: 20)
 *   8. Foreground (y: 25)
 *
 * Special ground variations:
 * - Screen -1: First section
 * - Screen 0: Start section
 * - Screen 2: Skull section
 * - Other screens: Standard ground
 *
 * @type {Level}
 */
const level1 = new Level(
  // Enemy array - single Blob instance
  getNewEnemies(),

  // Cloud array - 8 cloud instances for atmospheric effect
  [new Cloud(), new Cloud(), new Cloud(), new Cloud(), new Cloud(), new Cloud(), new Cloud(), new Cloud()],

  // Background objects array - organized in screens from -1 to 5
  [
    // Screen -1 (-320px to 0px) - Initial buffer screen
    new BackgroundObject("./img/environment/background/sky.png", -320, 0),
    new BackgroundObject("./img/environment/background/background-clouds2.png", -320, 20),
    new BackgroundObject("./img/environment/background/background-clouds1.png", -320, 20),
    new BackgroundObject("./img/environment/background/mountains2.png", -320, 20),
    new BackgroundObject("./img/environment/background/mountains1.png", -320, 20),
    new BackgroundObject("./img/environment/background/ground2.png", -320, 20),
    new BackgroundObject("./img/environment/background/ground_newFirst.png", -320, 20),
    new BackgroundObject("./img/environment/background/foreground2.png", -320, 25),

    // Screen 0 (0px to 320px) - Starting screen
    new BackgroundObject("./img/environment/background/sky.png", 0, 0),
    new BackgroundObject("./img/environment/background/background-clouds2.png", 0, 20),
    new BackgroundObject("./img/environment/background/background-clouds1.png", 0, 20),
    new BackgroundObject("./img/environment/background/mountains2.png", 0, 20),
    new BackgroundObject("./img/environment/background/mountains1.png", 0, 20),
    new BackgroundObject("./img/environment/background/ground2.png", 0, 20),
    new BackgroundObject("./img/environment/background/ground_newStart.png", 0, 20),
    new BackgroundObject("./img/environment/background/foreground2.png", 0, 25),

    // Screen 1 (320px to 640px)
    new BackgroundObject("./img/environment/background/sky.png", 320, 0),
    new BackgroundObject("./img/environment/background/background-clouds2.png", 320, 20),
    new BackgroundObject("./img/environment/background/background-clouds1.png", 320, 20),
    new BackgroundObject("./img/environment/background/mountains2.png", 320, 20),
    new BackgroundObject("./img/environment/background/mountains1.png", 320, 20),
    new BackgroundObject("./img/environment/background/ground2.png", 320, 20),
    new BackgroundObject("./img/environment/background/ground_new.png", 320, 20),
    new BackgroundObject("./img/environment/background/foreground2.png", 320, 25),

    // Screen 2 (640px to 960px) - Skull section
    new BackgroundObject("./img/environment/background/sky.png", 320 * 2, 0),
    new BackgroundObject("./img/environment/background/background-clouds2.png", 320 * 2, 20),
    new BackgroundObject("./img/environment/background/background-clouds1.png", 320 * 2, 20),
    new BackgroundObject("./img/environment/background/mountains2.png", 320 * 2, 20),
    new BackgroundObject("./img/environment/background/mountains1.png", 320 * 2, 20),
    new BackgroundObject("./img/environment/background/ground2.png", 320 * 2, 20),
    new BackgroundObject("./img/environment/background/ground_newSkull.png", 320 * 2, 20),
    new BackgroundObject("./img/environment/background/foreground2.png", 320 * 2, 25),

    // Screen 3 (960px to 1280px)
    new BackgroundObject("./img/environment/background/sky.png", 320 * 3, 0),
    new BackgroundObject("./img/environment/background/background-clouds2.png", 320 * 3, 20),
    new BackgroundObject("./img/environment/background/background-clouds1.png", 320 * 3, 20),
    new BackgroundObject("./img/environment/background/mountains2.png", 320 * 3, 20),
    new BackgroundObject("./img/environment/background/mountains1.png", 320 * 3, 20),
    new BackgroundObject("./img/environment/background/ground2.png", 320 * 3, 20),
    new BackgroundObject("./img/environment/background/ground_new.png", 320 * 3, 20),
    new BackgroundObject("./img/environment/background/foreground2.png", 320 * 3, 25),

    // Screen 4 (1280px to 1600px)
    new BackgroundObject("./img/environment/background/sky.png", 320 * 4, 0),
    new BackgroundObject("./img/environment/background/background-clouds2.png", 320 * 4, 20),
    new BackgroundObject("./img/environment/background/background-clouds1.png", 320 * 4, 20),
    new BackgroundObject("./img/environment/background/mountains2.png", 320 * 4, 20),
    new BackgroundObject("./img/environment/background/mountains1.png", 320 * 4, 20),
    new BackgroundObject("./img/environment/background/ground2.png", 320 * 4, 20),
    new BackgroundObject("./img/environment/background/ground_new.png", 320 * 4, 20),
    new BackgroundObject("./img/environment/background/foreground2.png", 320 * 4, 25),

    // Screen 5 (1600px to 1920px)
    new BackgroundObject("./img/environment/background/sky.png", 320 * 5, 0),
    new BackgroundObject("./img/environment/background/background-clouds2.png", 320 * 5, 20),
    new BackgroundObject("./img/environment/background/background-clouds1.png", 320 * 5, 20),
    new BackgroundObject("./img/environment/background/mountains2.png", 320 * 5, 20),
    new BackgroundObject("./img/environment/background/mountains1.png", 320 * 5, 20),
    new BackgroundObject("./img/environment/background/ground2.png", 320 * 5, 20),
    new BackgroundObject("./img/environment/background/ground_new.png", 320 * 5, 20),
    new BackgroundObject("./img/environment/background/foreground2.png", 320 * 5, 25),
  ],
  // HUD array - single HUD instance for game stats
  [new Hud()]
);
