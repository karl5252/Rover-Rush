import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

class Joystick {
  constructor(scene) {
    this.scene = scene;
    this.joystick = this.scene.plugins.get('rexVirtualJoystick').add(this.scene, {
      x: this.scene.cameras.main.centerX,
      y: this.scene.cameras.main.centerY,
      radius: 100,
      base: this.scene.add.circle(0, 0, 100, 0x888888).setAlpha(0.3),
      thumb: this.scene.add.circle(0, 0, 50, 0xcccccc).setAlpha(0.8),
    }).setScrollFactor(0);

    this.joystick.on('update', this.update, this);
  }

  update() {
    const cursorKeys = this.joystick.createCursorKeys();
    this.left = cursorKeys.left.isDown;
    this.right = cursorKeys.right.isDown;
    this.up = cursorKeys.up.isDown;
    this.down = cursorKeys.down.isDown;
  }
}

export default Joystick;
