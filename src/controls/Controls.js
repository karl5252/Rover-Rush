class Controls{
    constructor(scene) {
        this.scene = scene;
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.jumpKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);        
    }

    update(player){
        
        const { left, right, up, down } = this.cursors;
        const onFloor = player.body.onFloor();

        // Check if the player falls out of the world bounds
        if (this.y > this.scene.sys.game.config.height) {
            player.playerDeath('fall');
            console.log('Player died by falling');
        }

        if (left.isDown) {
            player.setVelocityX(-player.playerSpeed);
            player.setFlipX(true);
        } else if (right.isDown) {
            player.setVelocityX(player.playerSpeed);
            player.setFlipX(false);
        } else {
            player.setVelocityX(0);
        }

        if ((up.isDown || this.jumpKey.isDown) && onFloor) {
            player.setVelocityY(-player.playerSpeed * 2.1);
        }
        if(down.isDown) {
            player.playerPhaseInOut();
        }

        if (onFloor) {
            if (player.body.velocity.x !== 0 && !player.phaseActive) {
                player.play('walk', true);
            } else if (this.phaseActive) {
                player.play('hide', true);

            }else {
                player.play('idle', true);
            }
        } else {
            player.play('jump', true);
        }
    }
}
export default Controls;