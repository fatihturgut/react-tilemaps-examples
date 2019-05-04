

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
    const character = await this.loader.loadImage("character", "./assets/character.png");
    this.tileAtlas = this.loader.getImage("tiles");
    this.hero = { x: 128, y: 384, image: this.loader.getImage("character") };
    this.images = {
      tiles,
      character
    };
  };

  drawLayer = layerIndex => {
    for (let columnIndex = 0; columnIndex < this.tileMap.columns; columnIndex++) {
      for (let rowIndex = 0; rowIndex < this.tileMap.rows; rowIndex++) {
        let tile = this.tileMap.getTile(layerIndex, columnIndex, rowIndex);
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
    // draw map background layer
    this.drawLayer(0);
    // draw game sprites
    this.context.drawImage(this.hero.image, this.hero.x, this.hero.y);
    // draw map top layer
    this.drawLayer(1);
  }
}
