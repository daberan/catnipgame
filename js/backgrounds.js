/**
 * @typedef {Object} Background
 * @property {number} cameraxDivider - Controls the parallax scrolling speed.
 *                                    Lower values = faster movement.
 *                                    0 = static (no movement)
 *                                    1 = moves at camera speed
 *                                    >1 = moves slower than camera (creates depth effect)
 * @property {string} imageSrcName - Path to the image file for this background layer
 * @property {boolean} [noTranslateBack] - Optional. If true, prevents reverse translation
 *                                        when camera moves backwards
 */

/**
 * Array of background layer configurations for parallax scrolling effect.
 * Layers are ordered from back to front in the scene.
 *
 * Layer order and parallax effects:
 * 1. Sky (static, never moves)
 * 2. Far clouds (extremely slow movement)
 * 3. Near clouds (very slow movement)
 * 4. Far mountains (slow movement)
 * 5. Near mountains (moderate movement)
 * 6. Ground back layer (faster movement)
 * 7. Main ground (moves with camera, no reverse translation)
 * 8. Foreground (moves with camera)
 *
 * @type {Background[]}
 */
const BACKGROUNDS = [
  {
    cameraxDivider: 0, // Static background
    imageSrcName: "sky.png",
  },
  {
    cameraxDivider: 1000, // Extremely slow parallax for distant clouds
    imageSrcName: "background-clouds2.png",
  },
  {
    cameraxDivider: 200, // Very slow parallax for closer clouds
    imageSrcName: "background-clouds1.png",
  },
  {
    cameraxDivider: 20, // Slow parallax for distant mountains
    imageSrcName: "mountains2.png",
  },
  {
    cameraxDivider: 6, // Moderate parallax for closer mountains
    imageSrcName: "mountains1.png",
  },
  {
    cameraxDivider: 3, // Fast parallax for back ground layer
    imageSrcName: "/ground2.png",
  },
  {
    cameraxDivider: 1, // Moves with camera
    imageSrcName: "/ground_new",
    noTranslateBack: true, // Prevents backward movement
  },
  {
    cameraxDivider: 1, // Moves with camera
    imageSrcName: "/foreground2.png",
  },
];
