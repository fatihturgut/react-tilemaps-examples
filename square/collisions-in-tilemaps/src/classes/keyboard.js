export default class Keyboard {
  constructor() {
    this.LEFT = 37;
    this.RIGHT = 39;
    this.UP = 38;
    this.DOWN = 40;
    this._keys = {};
  }

  listenForEvents = keys => {
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);

    keys.forEach(key => {
      this._keys[key] = false;
    });
  }

  _onKeyDown = event => {
    const keyCode = event.keyCode;
    if (keyCode in this._keys) {
      event.preventDefault();
      this._keys[keyCode] = true;
    }
  };

  _onKeyUp = event => {
    const keyCode = event.keyCode;
    if (keyCode in this._keys) {
      event.preventDefault();
      this._keys[keyCode] = false;
    }
  };

  isDown = keyCode => {
    if (!keyCode in this._keys) {
      throw new Error(`Keycode  ${keyCode} is not being listened to`);
    }
    return this._keys[keyCode];
  };
}
