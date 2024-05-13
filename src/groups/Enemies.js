import Phaser from 'phaser';
import { ENEMY_TYPES } from '../types';
import collidbable from '../mixins/collidbable';

class Enemies extends Phaser.GameObjects.Group {
  constructor(scene) {
    super(scene);

    Object.assign(this, collidbable);
  }

  getTypes() {
    return ENEMY_TYPES;
  }
}

export default Enemies;