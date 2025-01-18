/**
 * Input reference for the Rive state machine.
 * @type {Object}
 */
let stateMachineInput;

/**
 * Reference to the mouth animation control in the Rive state machine.
 * @type {Object}
 */
let mouth;

/**
 * Initializes and configures the Rive animation instance.
 * Sets up mouse tracking for eye movement and random blinking behavior.
 *
 * @type {rive.Rive}
 */
const r = new rive.Rive({
  src: "./rive/catnip.riv",
  canvas: document.getElementById("canvasCat"),
  autoplay: true,
  stateMachines: "stateMachine",
  /**
   * Callback executed when the Rive animation is loaded.
   * Sets up input controls, mouse tracking, and blinking behavior.
   */
  onLoad: () => {
    r.resizeDrawingSurfaceToCanvas();

    // Initialize state machine inputs
    const inputs = r.stateMachineInputs("stateMachine");
    const xAxis = inputs.find((input) => input.name === "xAxis");
    const yAxis = inputs.find((input) => input.name === "yAxis");
    const blink = inputs.find((input) => input.name === "blink");
    mouth = inputs.find((input) => input.name === "mouth");

    /**
     * Mouse movement handler for eye tracking.
     * Converts mouse position to percentage values for x and y axes.
     * @param {MouseEvent} e - Mouse movement event
     */
    document.addEventListener("mousemove", (e) => {
      const xPercentage = (e.clientX / window.innerWidth) * 100;
      const yPercentage = 100 - (e.clientY / window.innerHeight) * 100;

      xAxis.value = Math.min(Math.max(xPercentage, 0), 100);
      yAxis.value = Math.min(Math.max(yPercentage, 0), 100);
    });

    /**
     * Schedules random blinking animations.
     * Blink delay is randomized between minDelay and maxDelay.
     */
    function randomBlink() {
      const minDelay = 500; // Minimum time between blinks (ms)
      const maxDelay = 8000; // Maximum time between blinks (ms)

      /**
       * Recursive function to schedule the next blink animation
       */
      const scheduleNextBlink = () => {
        const delay = minDelay + Math.random() * (maxDelay - minDelay);
        setTimeout(() => {
          if (blink) {
            blink.fire();
          }
          scheduleNextBlink();
        }, delay);
      };

      scheduleNextBlink();
    }

    randomBlink();

    // Trigger blink animation on click
    document.addEventListener("click", () => {
      blink.fire();
    });

    // Set initial eye position to center
    xAxis.value = 50;
    yAxis.value = 50;
  },
});

/**
 * Triggers the mouth opening animation in the Rive state machine.
 */
function openMouth() {
  mouth.fire();
}
