import Phaser from "phaser";

class Collectible extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    scene.add.existing(this);

    this.value = 1;
  }

}
export default Collectible;