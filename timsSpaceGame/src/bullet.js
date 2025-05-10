class Bullet {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 4;
    this.dx = dx;
    this.dy = dy;
  }

  draw(ctx) {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(ctx) {
    this.x += this.dx;
    this.y += this.dy;
    this.draw(ctx);
  }
}
export default Bullet