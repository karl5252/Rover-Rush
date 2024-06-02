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

    if (force > deadzone) {
      const cappedForce = Math.min(force, 1); // Cap the force to 1

      // Determine movement direction based on angle
      let velocityX = 0;
      let velocityY = 0;

      if (angle >= -45 && angle <= 45) {
        // Right
        velocityX = this.player.playerSpeed * cappedForce;
      } else if (angle > 45 && angle < 135) {
        // Down
        velocityY = this.player.playerSpeed * cappedForce;
      } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
        // Left
        velocityX = -this.player.playerSpeed * cappedForce;
      } else if (angle >= -135 && angle < -45) {
        // Up
        velocityY = -this.player.playerSpeed * cappedForce;
      }

      this.player.setVelocityX(velocityX);
      this.player.setVelocityY(velocityY);
    } else {
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
    }
  }

  update(player) {
    this.player = player;
  }
}

export default Joystick;
