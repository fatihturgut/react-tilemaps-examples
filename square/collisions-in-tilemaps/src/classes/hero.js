export default class Hero {
  constructor(map, x, y, image) { 
    this.map = map;
    this.x = x;
    this.y = y;
    this.width = map.tileSize;
    this.height = map.tileSize;
    this.image = image;
    this.SPEED = 256; // pixels per second
  }

  move = (delta, dirX, dirY) => {
    // move camera
    this.x += dirX * this.SPEED * delta;
    this.y += dirY * this.SPEED * delta;

    // check if we walked into a non-walkable tile
    this._collide(dirX, dirY);

    // clamp values
    const maxX = this.map.columns * this.map.tileSize;
    const maxY = this.map.rows * this.map.tileSize;
    this.x = Math.max(0, Math.min(this.x, maxX));
    this.y = Math.max(0, Math.min(this.y, maxY));
  }

  _collide = (dirX, dirY) => {
    let row, column;
    // -1 in right and bottom is because image ranges from 0..63
    // and not up to 64
    const left = this.x - this.width / 2;
    const right = this.x + this.width / 2 - 1;
    const top = this.y - this.height / 2;
    const bottom = this.y + this.height / 2 - 1;

    // check for collisions on sprite sides
    const collision =
        this.map.isSolidTileAtXY(left, top) ||
        this.map.isSolidTileAtXY(right, top) ||
        this.map.isSolidTileAtXY(right, bottom) ||
        this.map.isSolidTileAtXY(left, bottom);
    if (!collision) { return; }

    if (dirY > 0) {
        row = this.map.getRow(bottom);
        this.y = -this.height / 2 + this.map.getY(row);
    }
    else if (dirY < 0) {
        row = this.map.getRow(top);
        this.y = this.height / 2 + this.map.getY(row + 1);
    }
    else if (dirX > 0) {
        column = this.map.getColumn(right);
        this.x = -this.width / 2 + this.map.getX(column);
    }
    else if (dirX < 0) {
        column = this.map.getColumn(left);
        this.x = this.width / 2 + this.map.getX(column + 1);
    }
};
}
