class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.dx = -2;
    this.type = type; // Type of power-up ('health', 'threeWayShot', etc.)
    this.frameXBase = 64;
    this.frameYBase = 62;
    this.frameWidth = 11;
    this.frameHeight = 11;
  }

  draw(ctx) {
    var frameOffset = this.type === 'threeWayShot' ? 0 : 1;
    const sprite = document.getElementById('sprites');
    
    ctx.drawImage(
      sprite,
      this.frameXBase + frameOffset * this.frameWidth,
      this.frameYBase,
      this.frameWidth,
      this.frameHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  update(ctx) {
    this.x += this.dx;
    this.draw(ctx);
  }
}
export default PowerUp