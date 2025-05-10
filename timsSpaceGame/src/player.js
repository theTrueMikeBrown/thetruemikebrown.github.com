class Player {
  constructor(startX, startY) {
    this.width = 70;
    this.height = 10;
    this.x = startX;
    this.y = startY;
    this.startX = startX;
    this.startY = startY;
    this.dx = 0;  // Horizontal movement speed
    this.dy = 0;  // Vertical movement speed
    this.speed = 3;
    this.health = 3;
    this.lives = 3;
    this.frameXBase = 23;
    this.frameYBase = 38;
    this.frameXCurrent = 0;
    this.frameYCurrent = 0;
    this.frameWidth = 20;
    this.frameHeight = 4;
    this.frameCount = 0;
    this.threeWayShotActive = false;
    this.threeWayShotDuration = 0;
    this.action = ""
    this.shotCooldown = 0;
    this.shotBaseCooldown = 20;
  }

  actionToSpriteRow(action) {
    if (action === "") {
      return 0
    } else if (action === "move") {
      return 1
    } else if (action === "shootmove") {
      return 2
    } else if (action === "shoot") {
      return 3
    }
  }
 
  draw(ctx) {
    const sprite = document.getElementById('sprites');
    this.frameYCurrent = this.actionToSpriteRow(this.action)
    ctx.drawImage(
      sprite,
      this.frameXBase + this.frameXCurrent * (this.frameWidth+1),
      this.frameYBase + this.frameYCurrent * (this.frameHeight+1),
      this.frameWidth,
      this.frameHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  update(canvas, ctx) {
    this.x += this.dx;
    this.y += this.dy;

    // Prevent the player from moving outside the canvas
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    if (this.y < 0) this.y = 0;
    if (this.y + this.height > canvas.height) this.y = canvas.height - this.height;

    this.frameCount++;
    this.shotCooldown = Math.max(this.shotCooldown - 1, -3)
    if (this.frameCount % 10 === 0) {
      this.frameXCurrent = (this.frameXCurrent + 1) % 4;
    }

    // If the three-way shot is active, decrement the timer
    if (this.threeWayShotActive) {
      this.threeWayShotDuration--;
      if (this.threeWayShotDuration <= 0) {
        this.threeWayShotActive = false; // Deactivate the power-up
      }
    }

    this.draw(ctx);
  }

  reset() {
    this.x = this.startX;
    this.y = this.startY;
    this.action = ""
    this.shotCooldown = 0;
    this.speed = 3;
    this.health = 3;
  }
}
export default Player