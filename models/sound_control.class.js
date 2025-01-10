class Soundcontrol {
  img;
  width = 320;
  height = 180;
  x = -7;
  y = 7;
  imageCache = {};
  imageSequence = ["./img/soundcontrol/unmuted.png", "./img/soundcontrol/muted.png"];
  isMuted = false;
  iconWidth = 16;
  iconHeight = 16;
  world; // Add reference to world

  constructor(canvas, world) {
    // Add world parameter
    this.canvas = canvas;
    this.world = world; // Store world reference
    this.loadImage("./img/soundcontrol/unmuted.png");
    this.loadImages(this.imageSequence);
    this.addClickListener();
  }

  loadImage(path) {
    const img = new Image();
    img.src = path;
    this.imageCache[path] = img;
    this.img = img;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  addClickListener() {
    this.canvas.addEventListener("click", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;

      const clickX = (event.clientX - rect.left) * scaleX;
      const clickY = (event.clientY - rect.top) * scaleY;

      // Make click area 1.5 times bigger (16 * 1.5 = 24)
      const clickAreaWidth = this.iconWidth * 1.5;
      const clickAreaHeight = this.iconHeight * 1.5;

      // Move detection area 10% of screen width to the left
      const leftOffset = this.width * 0.1; // 10% of 320 = 32
      const iconX = this.width + this.x - leftOffset;
      const iconY = this.y;

      if (clickX >= iconX && clickX <= iconX + clickAreaWidth && clickY >= iconY && clickY <= iconY + clickAreaHeight) {
        this.toggleSoundIcon();
      }
    });
  }

  toggleSoundIcon() {
    this.isMuted = !this.isMuted;
    const imagePath = this.isMuted ? "./img/soundcontrol/muted.png" : "./img/soundcontrol/unmuted.png";
    this.img = this.imageCache[imagePath];

    // Toggle world's audio state
    if (this.world) {
      this.world.toggleMusic();
    }
  }
}
