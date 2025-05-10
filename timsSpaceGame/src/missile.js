class Missile {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.width = 42;
    this.height = 14;
    this.turnSpeed = 0.5;
    this.maxSpeed = 20;
    this.dx = dx;
    this.dy = dy;
    this.juice = 50;
    this.frameXBase = 10;
    this.frameYBase = 113;
    this.frameWidth = 16;
    this.frameHeight = 5;
    this.frameCount = 0;
  }

  draw(ctx) {
    const sprite = document.getElementById('sprites');
    
    ctx.drawImage(
      sprite,
      this.frameXBase,
      this.frameYBase,
      this.frameWidth,
      this.frameHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  update(ctx, player) {    
    const dx = (player.x + player.width / 2) - (this.x + this.width / 2);
    const dy = (player.y + player.height / 2) - (this.y + this.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const vx = (dx / distance) * this.turnSpeed;
    const vy = (dy / distance) * this.turnSpeed;
    this.dx = Math.max(Math.min(this.dx + vx, this.maxSpeed), -this.maxSpeed);
    this.dy = Math.max(Math.min(this.dy + vy, this.maxSpeed), -this.maxSpeed);
    this.x += this.dx;
    this.y += this.dy;
    this.juice--;

    this.draw(ctx);
  }
}
export default Missile