let stateMachineInput;
let mouth;

const r = new rive.Rive({
  src: "./rive/catnip.riv",
  canvas: document.getElementById("canvasCat"),
  autoplay: true,
  stateMachines: "stateMachine",
  onLoad: () => {
    r.resizeDrawingSurfaceToCanvas();

    const inputs = r.stateMachineInputs("stateMachine");
    const xAxis = inputs.find((input) => input.name === "xAxis");
    const yAxis = inputs.find((input) => input.name === "yAxis");
    const blink = inputs.find((input) => input.name === "blink");
    mouth = inputs.find((input) => input.name === "mouth");

    document.addEventListener("mousemove", (e) => {
      const xPercentage = (e.clientX / window.innerWidth) * 100;
      const yPercentage = 100 - (e.clientY / window.innerHeight) * 100;

      xAxis.value = Math.min(Math.max(xPercentage, 0), 100);
      yAxis.value = Math.min(Math.max(yPercentage, 0), 100);
    });

    function randomBlink() {
      const minDelay = 500; // Minimum 2 Sekunden
      const maxDelay = 8000; // Maximum 5 Sekunden

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

    document.addEventListener("click", () => {
      blink.fire();
    });

    xAxis.value = 50;
    yAxis.value = 50;
  },
});

function openMouth() {
  mouth.fire();
}
