import Phaser from 'phaser';

class Joystick {
  constructor(scene) {
    this.scene = scene;
    this.createJoystick();
  }

  createJoystick() {
    this.joystick = this.scene.plugins.get('rexVirtualJoystick').add(this.scene, {
      x: this.scene.cameras.main.width / 2,
      y: this.scene.cameras.main.height / 2,
      radius: 100,
      base: this.scene.add.circle(0, 0, 100, 0x888888).setAlpha(0.3),
      thumb: this.scene.add.circle(0, 0, 50, 0xffffff).setAlpha(0.8)
    }).setScrollFactor(0);

    this.joystick.on('update', this.updateJoystick, this);
  }
  updateJoystick() {
    const deadzone = 0.2; // Deadzone threshold
    const force = this.joystick.force;
    const angle = this.joystick.angle;
    
    // Normalize angle to be between -180 and 180
    while (angle > 180) {
      angle -= 360;
    }
    while (angle < -180) {
      angle += 360;
    }
    console.log('force:', force, 'angle:', angle); // Check the angles and force values to adjust properly
  
    const onFloor = this.player.body.onFloor();
  
    if (force > deadzone) {
      const cappedForce = Math.min(force, 1); // Cap the force to 1
  
      // Determine movement direction based on angle
      let velocityX = 0;
      let velocityY = this.player.body.velocity.y; // Maintain current vertical velocity
  
      if (angle >= -22.5 && angle < 22.5) {
        // E
        this.player.setFlipX(false);
        velocityX = this.player.playerSpeed * cappedForce;
      } else if (angle >= 22.5 && angle < 67.5) {
        // NE
        velocityX = this.player.playerSpeed * cappedForce * Math.cos(Math.PI / 4);
        velocityY = -this.player.playerSpeed * cappedForce * Math.sin(Math.PI / 4);
      } else if (angle >= 67.5 && angle < 112.5) {
        // N
        if (onFloor) {
          this.player.playerPhaseInOut(); // Phase in and out when joystick is pushed up
        }
      } else if (angle >= 112.5 && angle < 157.5) {
        // NW
        this.player.setFlipX(true);
        velocityX = -this.player.playerSpeed * cappedForce * Math.cos(Math.PI / 4);
        velocityY = -this.player.playerSpeed * cappedForce * Math.sin(Math.PI / 4);
      } else if ((angle >= 157.5 && angle <= 180) || (angle >= -180 && angle < -157.5)) {
        // W
        this.player.setFlipX(true);
        velocityX = -this.player.playerSpeed * cappedForce;
      } else if (angle >= -157.5 && angle < -112.5) {
        // SW
        this.player.setFlipX(true);
        velocityX = -this.player.playerSpeed * cappedForce * Math.cos(Math.PI / 4);
        if (onFloor) {
          this.player.setVelocityY(-this.player.playerSpeed * 2.1 * Math.sin(Math.PI / 4));
        }
      } else if (angle >= -112.5 && angle < -67.5) {
        // S
        if (onFloor) {
          this.player.setVelocityY(-this.player.playerSpeed * 2.1); // Jump straight up
        }
      } else if (angle >= -67.5 && angle < -22.5) {
        // SE
        this.player.setFlipX(false);
        velocityX = this.player.playerSpeed * cappedForce * Math.cos(Math.PI / 4);
        if (onFloor) {
          this.player.setVelocityY(-this.player.playerSpeed * 2.1 * Math.sin(Math.PI / 4));
        }
      }
  
      this.player.setVelocityX(velocityX);
    } else {
      this.player.setVelocityX(0);
      if (onFloor) {
        this.player.setVelocityY(0); // Ensure player stops moving vertically when on the ground
      }
    }
  }
  

  update(player) {
    this.player = player;
  }
}

export default Joystick;
