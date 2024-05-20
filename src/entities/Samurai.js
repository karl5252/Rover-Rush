import initAnims from '../anims/samuraiAnims';
import Enemy from './Enemy';

class Samurai extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'samurai');
        initAnims(this.scene.anims);
    }

    update(time, delta) {
        super.update(time, delta);
        if (this.alive && this.anims) {
            this.anims.play('sam-walk', true); // Play walking animation
        }
    }
}

export default Samurai;
