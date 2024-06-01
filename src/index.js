import Phaser, { Plugins } from 'phaser';

import PlayScene from './scenes/Play';
import PreloadScene from './scenes/Preload';
import MenuScene from './scenes/Menu';
import InputScoreScene from './scenes/InputScoreScene';
import EndGameScene from './scenes/EndGame';
import { plugin } from 'mongoose';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js'; // Importing joystick plugin


const WIDTH = document.body.offsetWidth;
const HEIGHT = 700;
const MAP_WIDTH = 1732;
const ZOOM_FACTOR = 1.5;


const SHARED_CONFIG = {
  mapOffset: MAP_WIDTH > WIDTH ? MAP_WIDTH - WIDTH : 0,
  width: WIDTH,
  height: HEIGHT,
  leftTopCorner: {
    x: (WIDTH - (WIDTH / ZOOM_FACTOR)) / 2,
    y: (HEIGHT - (HEIGHT / ZOOM_FACTOR)) / 2
  },
  rightTopCorner: {
    x: ((WIDTH / ZOOM_FACTOR) + ((WIDTH - (WIDTH / ZOOM_FACTOR)) / 2)),
    y: (HEIGHT - (HEIGHT / ZOOM_FACTOR)) / 2
  },
  zoomFactor: ZOOM_FACTOR,
  leaderboardUrl: '.netlify/functions/leaderboard'  //for local testing use 'http://localhost:3000/leaderboard' on server /.netlify/functions/leaderboard

}

const Scenes = [PreloadScene, MenuScene, PlayScene, InputScoreScene, EndGameScene];
const createScene = Scene => new Scene(SHARED_CONFIG)
const initScenes = () => Scenes.map(createScene)

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    }
  },
  scene: initScenes(),
  Plugins: {
    global: [
      {
        key: 'rexVirtualJoystick', plugin: VirtualJoystickPlugin, start: true}
    ]
  }
};

new Phaser.Game(config);