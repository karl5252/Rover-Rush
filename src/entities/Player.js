import Phaser from 'phaser';
import initAnims from '../anims/playerAnims';

import collidbable from '../mixins/collidbable';

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y ) {
        super(scene, x, y, 'player');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        Object.assign(this, collidbable);

        this.init();
        this.eventListeners();
    }

    // Add your custom methods and logic here
    init() {
        this.gravity = 500;
        this.playerSpeed = 200;
        this.cursors = this.scene.input.keyboard.createCursorKeys();    
        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);
        this.setOrigin(0.5, 1);
        initAnims(this.scene.anims);
      }

      eventListeners() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
      }
    
      update() {
        const { left, right } = this.cursors;
        var onFloor = this.body.onFloor();
    
        if (left.isDown) {
          this.setVelocityX(-this.playerSpeed);
          //flip the animation
            this.setFlipX(true);
        } else if (right.isDown) {
          this.setVelocityX(this.playerSpeed);
            //flip the animation
            this.setFlipX(false);
        } else {
          this.setVelocityX(0);
        }
        if(this.cursors.up.isDown && onFloor){
            this.setVelocityY(-this.playerSpeed * 2);
        }
        if (onFloor) {
          if (this.body.velocity.x !== 0) {
              this.play('walk', true);
          } else {
              this.play('idle', true);
          }
      } else {
          this.play('jump', true);
      }
    }  
}

export default Player;