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
    imageSrcName: "/ground_new",
    noTranslateBack: true,
  },
  {
    cameraxDivider: 1,
    imageSrcName: "/foreground2.png",
  },
];
