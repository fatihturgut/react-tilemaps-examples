import Loader from "./loader";
import TileMap from "./tileMap";
import Camera from "./camera";
import Keyboard from "./keyboard";
import Hero from "./hero";

export default class Game {
  constructor(context) {
    this.context = context;
    this.loader = new Loader();
    this.map = new TileMap();
    this.keyboard = new Keyboard();
    this._previousElapsed = 0;
  }

  init = async () => {
    this.keyboard.listenForEvents(
      [this.keyboard.LEFT, this.keyboard.RIGHT, this.keyboard.UP, this.keyboard.DOWN]);
    const tiles = await this.loader.loadImage("tiles", "./assets/tiles.png");
    const character = await this.loader.loadImage("character", "./assets/character.png");
    this.tileAtlas = this.loader.getImage("tiles");
    this.images = {
      tiles,
      character,
    };
    this.hero = new Hero(this.map, 160, 160, this.images.character);
    this.camera = new Camera(this.map, 512, 512);
    this.camera.follow(this.hero);
  };

  drawLayer = layerIndex => {
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
          this.context.drawImage(
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

  _drawGrid = () => {
    const width = this.map.columns * this.map.tileSize;
    const height = this.map.rows * this.map.tileSize;
    let x, y;

    for (let row = 0; row < this.map.rows; row++) {
      x = - this.camera.x;
      y = row * this.map.tileSize - this.camera.y;
      this.context.beginPath();
      this.context.moveTo(x, y);
      this.context.lineTo(width, y);
      this.context.stroke();
    }

    for (let column = 0; column < this.map.columns; column++) {
      x = column * this.map.tileSize - this.camera.x;
      y = - this.camera.y;
      this.context.beginPath();
      this.context.moveTo(x, y);
      this.context.lineTo(x, height);
      this.context.stroke();
    }
  };

  update = delta => {
    // handle hero movement with arrow keys
    let dirX = 0;
    let dirY = 0;
    if (this.keyboard.isDown(this.keyboard.LEFT)) { dirX = -1; }
    if (this.keyboard.isDown(this.keyboard.RIGHT)) { dirX = 1; }
    if (this.keyboard.isDown(this.keyboard.UP)) { dirY = -1; }
    if (this.keyboard.isDown(this.keyboard.DOWN)) { dirY = 1; }

    this.hero.move(delta, dirX, dirY)
    this.camera.update();
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

    // draw main character
    this.context.drawImage(
      this.hero.image,
      this.hero.screenX - this.hero.width / 2,
      this.hero.screenY - this.hero.height / 2
    );

    // draw map top layer
    this.drawLayer(1);

    this._drawGrid();
  }
}
