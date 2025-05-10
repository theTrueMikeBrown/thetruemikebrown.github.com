class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 20;
    this.dx = -3;
    this.health = Math.random() < 0.3 ? 2 : 1;
    this.frameXBase = 1;
    this.frameYBase = 37;
    this.frameXCurrent = 0;
    this.frameYCurrent = 0;
    this.frameWidth = 19;
    this.frameHeight = 10;
    this.frameCount = 0;
  }

  draw(ctx) {
    const sprite = document.getElementById('sprites');
    
    ctx.drawImage(
      sprite,
      this.frameXBase + this.frameXCurrent * this.frameWidth,
      this.frameYBase + this.frameYCurrent * this.frameHeight + (this.health - 1) * this.frameHeight * 2,
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
      this.frameYCurrent = (this.frameYCurrent + 1) % 2;
    }

    this.draw(ctx);    
  }
}
export default Enemy