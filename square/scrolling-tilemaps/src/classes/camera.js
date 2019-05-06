export default class Camera {
  constructor(map, width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.maxX = map.columns * map.tileSize - width;
    this.maxY = map.rows * map.tileSize - height;
    this.SPEED = 256; // pixels per second
  }

  move = (delta, dirX, dirY) => {
    // move camera
    this.x += dirX * this.SPEED * delta;
    this.y += dirY * this.SPEED * delta;
    // clamp values
    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));
  }
}
