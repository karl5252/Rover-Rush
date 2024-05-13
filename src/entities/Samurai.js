import initAnims from '../anims/samuraiAnims';
import Enemy from './Enemy';

class Samurai extends Enemy {
    constructor(scene, x, y ) {
        super(scene, x, y, 'samurai');
        initAnims(this.scene.anims);

    }
    
      update(time, delta) {
        super.update(time, delta);
        this.anims.play('sam-walk', true);

    }  
}

export default Samurai;