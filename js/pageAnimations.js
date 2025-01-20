/**
 * Manages the initial load animations for the game's start screen.
 * Sequentially animates the cat canvas, text wrapper, and button elements
 * by adding CSS classes in a timed sequence.
 *
 * Animation sequence:
 * 1. Cat and text wrapper animate immediately
 * 2. Button animates after 650ms delay
 */
function onLoadAnimations() {
  document.querySelector(".canvasCat").classList.add("onLoadMove");
  document.querySelector(".textWrapper").classList.add("onLoadMove");
  setTimeout(() => {
    document.querySelector(".button").classList.add("onLoadMove");
  }, 650);
}

/**
 * Manages the mouth opening animation sequence and transition to game start.
 * This function:
 * 1. Triggers the mouth opening animation
 * 2. Moves the cat canvas
 * 3. Animates the navigation upward
 * 4. Animates the tongue
 * 5. Hides the start button
 * 6. Shows the game wrapper after animation completes
 *
 * Note: Depends on external 'openMouth' function being defined
 */
function openMouthMove() {
  openMouth();
  document.querySelector(".canvasCat").classList.add("openMouthMove");
  document.querySelector("nav").classList.add("moveUp");
  document.querySelector(".tongue").classList.add("moveUpAndDown");
  document.querySelector(".button").classList.remove("onLoadMove");
  document.querySelector(".button").classList.add("hide");
  setTimeout(() => {
    document.querySelector(".gameWrapper").classList.add("show");
  }, 1250);
}

/**
 * Checks the device orientation and manages the display of orientation error message.
 * Shows error message in portrait mode, hides it in landscape mode.
 *
 * @returns {void}
 */
function checkOrientation() {
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  if (isLandscape) {
    document.querySelector(".horizontalError").style.display = "none";
  } else {
    document.querySelector(".horizontalError").style.display = "flex";
  }
}

/**
 * Initialize orientation check on load
 */
checkOrientation();

/**
 * Add listener for orientation changes
 */
window.matchMedia("(orientation: landscape)").addEventListener("change", (e) => {
  checkOrientation();
});
