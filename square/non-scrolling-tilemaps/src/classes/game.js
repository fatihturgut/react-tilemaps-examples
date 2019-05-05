

import Loader from "./loader";
import TileMap from "./tileMap";

export default class Game {
  constructor(context) {
    this.context = context;
    this.loader = new Loader();
    this.tileMap = new TileMap();
  }

  init = async () => {
    const tiles = await this.loader.loadImage("tiles", "./assets/tiles.png");
    this.tileAtlas = this.loader.getImage("tiles");
    this.images = {
      tiles,
    };
  };

  draw = () => {
    for (let columnIndex = 0; columnIndex < this.tileMap.columns; columnIndex++) {
      for (let rowIndex = 0; rowIndex < this.tileMap.rows; rowIndex++) {
        let tile = this.tileMap.getTile(columnIndex, rowIndex);
        if (tile !== 0) { // 0 => empty tile
          this.context.drawImage(
            this.tileAtlas, // image
            (tile - 1) * this.tileMap.tileSize, // source x
            0, // source y
            this.tileMap.tileSize, // source width
            this.tileMap.tileSize, // source height
            columnIndex * this.tileMap.tileSize,  // target x
            rowIndex * this.tileMap.tileSize, // target y
            this.tileMap.tileSize, // target width
            this.tileMap.tileSize // target height
          );
        }
      }
    }
  };

  render() {
    // draw map
    this.draw(0);
  }
}
