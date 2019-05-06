import Loader from "./loader";
import TileMap from "./tileMap";
import Camera from "./camera";
import Keyboard from "./keyboard";

export default class Game {
  constructor(context) {
    this.context = context;
    this.loader = new Loader();
    this.tileMap = new TileMap();
    this.camera = new Camera(this.tileMap, 512, 512);
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
  };

  drawLayer = layerIndex => {
    var startColumn = Math.floor(this.camera.x / this.tileMap.tileSize);
    var endColumn = startColumn + (this.camera.width / this.tileMap.tileSize);
    var startRow = Math.floor(this.camera.y / this.tileMap.tileSize);
    var endRow = startRow + (this.camera.height / this.tileMap.tileSize);
    var offsetX = -this.camera.x + startColumn * this.tileMap.tileSize;
    var offsetY = -this.camera.y + startRow * this.tileMap.tileSize;

    for (let columnIndex = startColumn; columnIndex < endColumn; columnIndex++) {
      for (let rowIndex = startRow; rowIndex < endRow; rowIndex++) {
        let tile = this.tileMap.getTile(layerIndex, columnIndex, rowIndex);
        const x = (columnIndex - startColumn) * this.tileMap.tileSize + offsetX;
        const y = (rowIndex - startRow) * this.tileMap.tileSize + offsetY;
        if (tile !== 0) { // 0 => empty tile
          this.context.drawImage(
            this.tileAtlas, // image
            (tile - 1) * this.tileMap.tileSize, // source x
            0, // source y
            this.tileMap.tileSize, // source width
            this.tileMap.tileSize, // source height
            Math.round(x),  // target x
            Math.round(y), // target y
            this.tileMap.tileSize, // target width
            this.tileMap.tileSize // target height
          );
        }
      }
    }
  };

  update = delta => {
    // handle camera movement with arrow keys
    let dirX = 0;
    let dirY = 0;
    if (this.keyboard.isDown(this.keyboard.LEFT)) { dirX = -1; }
    if (this.keyboard.isDown(this.keyboard.RIGHT)) { dirX = 1; }
    if (this.keyboard.isDown(this.keyboard.UP)) { dirY = -1; }
    if (this.keyboard.isDown(this.keyboard.DOWN)) { dirY = 1; }

    this.camera.move(delta, dirX, dirY);
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
    // draw map background layer
    this.drawLayer(0);
    // draw map top layer
    this.drawLayer(1);
  }
}
