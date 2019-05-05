export default class TileMap {
  constructor() {
    this.columns = 8;
    this.rows = 8;
    this.tileSize = 64;
    this.tiles = [
      1, 3, 3, 3, 1, 1, 3, 1,
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 2, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 2, 1, 1, 1, 1,
      1, 1, 1, 1, 2, 1, 1, 1,
      1, 1, 1, 1, 2, 1, 1, 1,
      1, 1, 1, 1, 2, 1, 1, 1
    ];
  }

  getTile(columnIndex, rowIndex) {
    return this.tiles[rowIndex * this.columns + columnIndex];
  }
}
