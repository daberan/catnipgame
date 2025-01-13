function onLoadAnimations() {
  // cat onload move up
  document.querySelector(".canvasCat").classList.add("onLoadMove");
  // text onload move up
  document.querySelector(".textWrapper").classList.add("onLoadMove");
  // button onload move up
  setTimeout(() => {
    document.querySelector(".button").classList.add("onLoadMove");
  }, 650);
}

function openMouthMove() {
  openMouth();
  document.querySelector(".canvasCat").classList.add("openMouthMove");
  document.querySelector("nav").classList.add("moveUp");
  document.querySelector(".tongue").classList.add("moveUpAndDown");
}
