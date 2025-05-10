class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.maxFrames = 3;
    this.speed = .25;
    this.frameXSize = 44;
    this.frameYSize = 36;
    this.finished = false;
  }

  draw(ctx) {
    const sprite = document.getElementById('sprites');
    const sx = Math.floor(this.frame) * this.frameXSize;
    const sy = 0;
    ctx.drawImage(sprite, sx, sy, this.frameXSize, this.frameYSize, this.x - 22, this.y - 18, 44, 32);
    this.frame += this.speed;
    if (this.frame >= this.maxFrames) this.finished = true;
  }
}
export default Explosion