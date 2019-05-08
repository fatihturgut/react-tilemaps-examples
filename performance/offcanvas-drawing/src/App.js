import React, { Component } from "react";
import Game from './classes/game';
import "./App.css";

const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 512;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isGameRunning: false
    };
    this.canvasRef = React.createRef();
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
    requestAnimationFrame((elapsed) => {
      this.game.render(elapsed);

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
          Offcanvas drawing
        </div>
        <div className="subheader2">
          Use arrow keys to move
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
