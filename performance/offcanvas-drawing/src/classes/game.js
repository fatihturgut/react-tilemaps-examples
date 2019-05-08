import Loader from "./loader";
import TileMap from "./tileMap";
import Camera from "./camera";
import Keyboard from "./keyboard";

export default class Game {
  constructor(context) {
    this.context = context;
    this.loader = new Loader();
    this.map = new TileMap();
    this.camera = new Camera(this.map, 512, 512);
    this.keyboard = new Keyboard();
    this._previousElapsed = 0;
  }

  init = async () => {
    this.keyboard.listenForEvents(
      [this.keyboard.LEFT, this.keyboard.RIGHT, this.keyboard.UP, this.keyboard.DOWN]);
    const tiles = await this.loader.loadImage("tiles", "./assets/tiles.png");
    this.tileAtlas = this.loader.getImage("tiles");
    this.images = {
      tiles,
    };

    this.layerCanvas = this.map.layers.map(function () {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      return canvas;
    });

    // initial draw of the map
    this._drawMap();
  };

  _drawMap = () => {
    this.map.layers.forEach((layer, layerIndex) => {
      this.drawLayer(layerIndex);
    });
  };

  drawLayer = layerIndex => {
    const context = this.layerCanvas[layerIndex].getContext('2d');
    context.clearRect(0, 0, 512, 512);
    const startColumn = Math.floor(this.camera.x / this.map.tileSize);
    const endColumn = startColumn + (this.camera.width / this.map.tileSize);
    const startRow = Math.floor(this.camera.y / this.map.tileSize);
    const endRow = startRow + (this.camera.height / this.map.tileSize);
    const offsetX = -this.camera.x + startColumn * this.map.tileSize;
    const offsetY = -this.camera.y + startRow * this.map.tileSize;

    for (let columnIndex = startColumn; columnIndex < endColumn; columnIndex++) {
      for (let rowIndex = startRow; rowIndex < endRow; rowIndex++) {
        let tile = this.map.getTile(layerIndex, columnIndex, rowIndex);
        const x = (columnIndex - startColumn) * this.map.tileSize + offsetX;
        const y = (rowIndex - startRow) * this.map.tileSize + offsetY;
        if (tile !== 0) { // 0 => empty tile
          context.drawImage(
            this.tileAtlas, // image
            (tile - 1) * this.map.tileSize, // source x
            0, // source y
            this.map.tileSize, // source width
            this.map.tileSize, // source height
            Math.round(x),  // target x
            Math.round(y), // target y
            this.map.tileSize, // target width
            this.map.tileSize // target height
          );
        }
      }
    }
  };

  update = delta => {
    this.hasScrolled = false;
    // handle camera movement with arrow keys
    let dirX = 0;
    let dirY = 0;
    if (this.keyboard.isDown(this.keyboard.LEFT)) { dirX = -1; }
    if (this.keyboard.isDown(this.keyboard.RIGHT)) { dirX = 1; }
    if (this.keyboard.isDown(this.keyboard.UP)) { dirY = -1; }
    if (this.keyboard.isDown(this.keyboard.DOWN)) { dirY = 1; }

    if (dirX !== 0 || dirY !== 0) {
      this.camera.move(delta, dirX, dirY);
      this.hasScrolled = true;
    }
  };

  getDelta = elapsed => {
    // compute delta time in seconds -- also cap it
    let delta = (elapsed - this._previousElapsed) / 1000.0;
    delta = Math.min(delta, 0.25); // maximum delta of 250 ms
    this._previousElapsed = elapsed;
    return delta;
  }

  render(elapsed) {
    this.context.clearRect(0, 0, 512, 512);
    this.update(this.getDelta(elapsed));
    // re-draw map if there has been scroll
    if (this.hasScrolled) {
      this._drawMap();
    }

    // draw the map layers into game context
    this.context.drawImage(this.layerCanvas[0], 0, 0);
    this.context.drawImage(this.layerCanvas[1], 0, 0);
  }
}
