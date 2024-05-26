import Phaser from 'phaser';
import initAnims from '../anims/playerAnims';
import collidbable from '../mixins/collidbable';

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        Object.assign(this, collidbable);
        this.alive = true;
        this.phased = false;
        this.scene = scene;

        this.init();
        this.eventListeners();
    }

    init() {
        this.gravity = 500;
        this.playerSpeed = 200;
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.jumpKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);
        this.setOrigin(0.5, 1);
        this.body.setSize(this.width * 0.5, this.height, true);

        initAnims(this.scene.anims);
    }

    eventListeners() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update() {
        if (!this.alive) {
            return;
        }

        const { left, right } = this.cursors;
        const onFloor = this.body.onFloor();

        // Check if the player falls out of the world bounds
        if (this.y > this.scene.sys.game.config.height) {
            this.playerDeath('fall');
            console.log('Player died by falling');
        }

        if (left.isDown) {
            this.setVelocityX(-this.playerSpeed);
            this.setFlipX(true);
        } else if (right.isDown) {
            this.setVelocityX(this.playerSpeed);
            this.setFlipX(false);
        } else {
            this.setVelocityX(0);
        }

        if ((this.cursors.up.isDown || this.jumpKey.isDown) && onFloor) {
            this.setVelocityY(-this.playerSpeed * 2.1);
        }
        if(this.cursors.down.isDown) {
            this.playerPhaseInOut();
        }

        if (onFloor) {
            if (this.body.velocity.x !== 0 && !this.phaseActive) {
                this.play('walk', true);
            } else if (this.phaseActive) {
                this.play('hide', true);

            }else {
                this.play('idle', true);
            }
        } else {
            this.play('jump', true);
        }
    }

    playerDeath(initiator) {
        if (this.phaseActive) {
            return;
        }
    
        console.log('Player died by', initiator);
        this.alive = false;
        //this.setTint(0xff0000); // Optional: Set red tint to indicate death
        this.anims.play('hurt', true); // Play hurt animation
        this.anims.stop(); // Stop animations
        this.scene.physics.pause(); // Pause physics
        this.setVelocity(0, 0); // Stop player movement

        let text = '';
        if (initiator === 'fall') {
            text = 'WASTED';
        } else {
            text = 'BUSTED!';
        }
        // add text pverhead the ninja saying "You were caught!"
        this.scene.add.text(this.x - 50, this.y - 60, text, {
            fontSize: '32px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 2,
            fontWeigth: 'bold'
            
        });

        // Restart the scene after a short delay
        this.scene.time.delayedCall(2000, () => {
            this.setVisible(false); // Hide the player sprite
            this.scene.scene.restart();
        });
    }

    playerPhaseInOut() {
        // If the phase in/out is currently active, do nothing
        if (this.phaseActive || !this.body.blocked.down) {
            return;
        }
    
        console.log('Player phase in and out to avoid enemy');
        this.phaseActive = true; // Set the flag to true
        this.phased = !this.phased;

        // Disable the player's physics body during the phase out
        if (this.phased) {
            this.body.enable = false;
        }
    
        // After 1 second, reset the phase in/out
        this.scene.time.delayedCall(1500, () => {
            this.phased = !this.phased;
            console.log(this.phased ? 'Player phased out' : 'Player phased in');

            // Re-enable the player's physics body when the phase in is complete
            if (!this.phased) {
                this.body.enable = true;
            }
    
            // After another 1 second1, allow the phase in/out to be triggered again
            this.scene.time.delayedCall(250, () => {
                console.log('Player phase in/out reset');
                this.phaseActive = false;
            });
        });
    }
}

export default Player;
