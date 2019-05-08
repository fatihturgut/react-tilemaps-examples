export default class TileMap {
  constructor() {
    this.columns = 12;
    this.rows = 12;
    this.tileSize = 64;
    this.layers = [[
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3,
      3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3,
      3, 3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3
    ], [
      4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 4, 4, 0, 5, 4, 4, 4, 4, 4, 4, 4,
      4, 4, 4, 0, 0, 3, 3, 3, 3, 3, 3, 3
    ]];
  }

  getTile = (layerIndex, columnIndex, rowIndex) => {
    return this.layers[layerIndex][rowIndex * this.columns + columnIndex];
  }

  isSolidTileAtXY = (x, y) => {
    const column = Math.floor(x / this.tileSize);
    const row = Math.floor(y / this.tileSize);

    // tiles 3 and 5 are solid -- the rest are walkable
    // loop through all layers and return TRUE if any tile is solid
    return this.layers.reduce((res, layer, layerIndex) => {
      const tile = this.getTile(layerIndex, column, row);
      const isSolid = tile === 3 || tile === 5;
      return res || isSolid;
    }, false);
  }

  getColumn = x => {
    return Math.floor(x / this.tileSize);
  }

  getRow = y => {
    return Math.floor(y / this.tileSize);
  }

  getX = column => {
    return column * this.tileSize;
  }

  getY = row => {
    return row * this.tileSize;
  }
}
