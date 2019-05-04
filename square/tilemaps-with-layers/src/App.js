import React, { Component } from "react";
import "./App.css";

const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 512;

class Loader {
  constructor() {
    this.images = {};
  }

  loadImage = (key, src) => {
    const image = new Image();
    const promise = new Promise((resolve, reject) => {
      image.onload = () => {
        this.images[key] = image;
        resolve(image);
      };

      image.onerror = () => {
        reject("Could not load image: " + src);
      };
    });

    image.src = src;
    return promise;
  };

  getImage = key => {
    return key in this.images ? this.images[key] : null;
  };
}

class TileMap {
  constructor() {
    this.columns = 8;
    this.rows = 8;
    this.tileSize = 64;
    this.layers = [[
        3, 3, 3, 3, 3, 3, 3, 3,
        3, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 1, 1, 2, 1, 3,
        3, 1, 1, 1, 1, 1, 1, 3,
        3, 1, 1, 2, 1, 1, 1, 3,
        3, 1, 1, 1, 2, 1, 1, 3,
        3, 1, 1, 1, 2, 1, 1, 3,
        3, 3, 3, 1, 2, 3, 3, 3
    ], [
        4, 3, 3, 3, 3, 3, 3, 4,
        4, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 5, 0, 0, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 4,
        4, 0, 0, 0, 0, 0, 0, 4,
        4, 4, 4, 0, 5, 4, 4, 4,
        0, 3, 3, 0, 0, 3, 3, 3
    ]];
  }

  getTile(layerIndex, columnIndex, rowIndex) {
    return this.layers[layerIndex][rowIndex * this.columns + columnIndex];
  }
}

class Game {
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
    console.log("fth this", this);
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CURRENT_STEP: "",
      isGameRunning: false
    };
    this.canvasRef = React.createRef();
    this.lastLoop = null;
  }

  componentDidMount = () => {
    this.start();
  };

  start = async () => {
    if (!this.state.isGameRunning) {
      this.game = new Game(this.getContext());
      await this.game.init();
      this.renderGame();
    }
    this.setState(state => ({ isGameRunning: !state.isGameRunning }));
  };

  renderGame = () => {
    requestAnimationFrame(() => {
      this.game.render();

      if (this.state.isGameRunning) {
        this.renderGame();
      }
    });
  };

  getContext = () => this.canvasRef.current.getContext("2d");

  render() {
    return (
      <div>
        <div className="header">
          Tilemaps examples (with React)
        </div>
        <div className="subheader">
          Layers
        </div>
        <div className="gameContainer">
          <canvas
            ref={this.canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
          />
        </div>
      </div>
    );
  }
}

export default App;
