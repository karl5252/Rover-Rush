import Phaser from 'phaser';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

class Preload extends Phaser.Scene {

  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.load.tilemapTiledJSON('map', 'assets/demo_map.json');
    this.load.image('bg', 'assets/img/bg.png');
    this.load.image('background_tiles', 'assets/tilemap.png');
    this.load.image('stone', 'assets/stone.png');
    this.load.image('coins', 'assets/coins.png');
    this.load.image('egg', 'assets/egg.png');
    this.load.spritesheet('player', 'assets/player/player_move.png', {
      frameWidth: 32, frameHeight: 32
    });
    this.load.spritesheet('samurai', 'assets/samurai/samurai_move.png', {
      frameWidth: 32, frameHeight: 32
    });
    this.load.spritesheet('snail', 'assets/snail/snail_move.png', {
      frameWidth: 32, frameHeight: 32
    });
    this.load.plugin('rexVirtualJoystick', VirtualJoystickPlugin, true);
  }

  create() {
    this.scene.start('MenuScene');
  }
}

export default Preload;
