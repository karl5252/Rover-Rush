import Phaser from 'phaser';
import collidbable from '../mixins/collidbable';

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    Object.assign(this, collidbable);
    
    this.init();
    this.eventListeners();

  }
      // Add your custom methods and logic here
      init() {
        this.gravity = 500;
        this.playerSpeed = 100;
        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);
        this.setImmovable(true);
        this.setOrigin(0.5, 1);

      }
      update(time, delta) {
        this.setVelocityX(30);

      }

      eventListeners() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
      }
  }
export default Enemy;