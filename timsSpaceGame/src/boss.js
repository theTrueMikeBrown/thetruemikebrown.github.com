class Boss {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.width = 160;
    this.height = 40;
    this.dx = -5;
    this.health = 25;
    this.active = true;
    this.frameXBase = 0;
    this.frameYBase = 159;
    this.frameXCurrent = 0;
    this.frameYCurrent = 0;
    this.frameWidth = 38;
    this.frameHeight = 9;
    this.frameCount = 0;
  }

  draw(ctx) {
    const sprite = document.getElementById('sprites');
    
    ctx.drawImage(
      sprite,
      this.frameXBase + this.frameXCurrent * (this.frameWidth + 1),
      this.frameYBase + this.frameYCurrent * this.frameHeight + (5 - Math.floor(this.health/5)) * (this.frameHeight + 1) * 3,
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
    
    this.frameCount++;
    if (this.frameCount % 10 === 0) {
      this.frameXCurrent = (this.frameXCurrent + 1) % 2;
    }

    this.draw(ctx);    
  }
}
export default Boss