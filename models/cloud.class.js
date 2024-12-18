class Cloud extends MovableObject {
  constructor() {
    super().loadImage("./img/environment/clouds/cloud1.png");

    this.x = Math.round(0 + Math.random() * 280);
    this.y = Math.round(-15 + Math.random() * 10);
    this.animate();

    this.height = 103;
    this.width = 36;
  }

  animate() {
    setInterval(() => {
      this.x -= 1;
    }, 1000 / 6);
  }
}
