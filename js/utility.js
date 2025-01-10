let intervalIds = [];

function setStoppableInterval(fn, time) {
  const id = setInterval(fn, time);
  intervalIds.push(id);
  return id;
}

function stopGame() {
  // Clear all intervals
  intervalIds.forEach((id) => {
    clearInterval(id);
  });
  intervalIds = [];

  // Stop audio if world exists
  if (world) {
    // Stop game themes
    world.theme.pause();
    world.theme.currentTime = 0;
    world.bossTheme.pause();
    world.bossTheme.currentTime = 0;

    // Stop enemy audio contexts
    world.level.enemies.forEach((enemy) => {
      if (enemy.audioContext) {
        enemy.audioContext.close();
      }
    });
  }
}

function restartGame() {
  stopGame();
  world = null;
  gameStarted = false;
  keyboard = new Keyboard();
  level1.enemies = getNewEnemies();
  init();
  initializeGame();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "r" || e.key === "R") {
    stopGame();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "t" || e.key === "T") {
    restartGame();
  }
});

window.intervalIds = intervalIds;
window.setStoppableInterval = setStoppableInterval;
window.stopGame = stopGame;
window.restartGame = restartGame;
