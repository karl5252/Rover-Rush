import Phaser from 'phaser';

class Preload extends Phaser.Scene {

  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.load.tilemapTiledJSON('map', 'assets/demo_map.json');
    this.load.image('bg', 'assets/img/background1.png');
    this.load.image('tiles-1', 'assets/demo_build_1.png');
    //this.load.image('player', 'assets/ninja.png');

    this.load.spritesheet(
        'player', 'assets/player/player_move.png', {
             frameWidth: 32, frameHeight: 32});
    this.load.spritesheet(
      'samurai', 'assets/samurai/samurai_move.png', {
            frameWidth: 32, frameHeight: 32});
  }

  create() {
    this.scene.start('PlayScene')
  }
}

export default Preload;