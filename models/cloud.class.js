class Cloud extends MovableObject {
  constructor() {
    super();

    this.cloudTypes = [
      {
        image: "./img/environment/clouds/cloud1.png",
        width: 27,
        height: 14,
        speedMin: 14,
        speedMax: 20,
        yPosition: 20,
      },
      {
        image: "./img/environment/clouds/cloud2.png",
        width: 167,
        height: 51,
        speedMin: 8,
        speedMax: 12,
        yPosition: -40,
      },
      {
        image: "./img/environment/clouds/cloud3.png",
        width: 140,
        height: 12,
        speedMin: 16,
        speedMax: 20,
        yPosition: 10,
      },
      {
        image: "./img/environment/clouds/cloud4.png",
        width: 113,
        height: 19,
        speedMin: 12,
        speedMax: 18,
        yPosition: 10,
      },
    ];

    const selectedCloud = this.cloudTypes[Math.floor(Math.random() * this.cloudTypes.length)];

    this.loadImage(selectedCloud.image);

    this.width = selectedCloud.width;
    this.height = selectedCloud.height;
    this.speed = Math.floor(Math.random() * (selectedCloud.speedMax - selectedCloud.speedMin + 1)) + selectedCloud.speedMin;

    this.x = Math.round(0 + Math.random() * 1000);
    this.y = Math.round(selectedCloud.yPosition + Math.random() * 30);

    this.animate();
  }

  animate() {
    this.moveLeft(1000 / this.speed);
  }
}
