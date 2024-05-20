import Phaser from 'phaser';
import collidable from '../mixins/collidbable';

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.platformsCollidersLayer = null;
    this.alive = true;
    this.isCastingRay = true; // Flag to control raycasting

    Object.assign(this, collidable);

    this.init();
    this.eventListeners();
  }

  init() {
    this.gravity = 500;
    this.playerSpeed = 30;

    this.rayGraphics = this.scene.add.graphics({ lineStyle: { width: 2, color: 0x00FFFF } });
    this.previousRayX = this.x; // Store the initial x position for raycasting

    this.body.setGravityY(this.gravity);
    this.setCollideWorldBounds(true);
    this.setImmovable(true);
    this.setOrigin(0.5, 1);
    this.body.setSize(this.width * 0.5, this.height, true);
    this.setVelocityX(this.playerSpeed || 0);
  }

  update(time, delta) {
    if (!this.alive || !this.body) {
      return;
    }

    // Move the enemy in the current direction
    this.setVelocityX(this.playerSpeed || 0);

    // Check if the enemy hits the left or right bounds of the world
    if (this.body.blocked.left || this.body.blocked.right) {
      this.changeDirection(); // Handle direction change
    }

    // Check if the enemy falls out of the world bounds
    if (this.y > this.scene.sys.game.config.height) {
      this.die(); // Call die method
    }

    // Perform raycast to detect ledges or obstacles only if the enemy is on the ground and raycasting is enabled
    if (this.body.onFloor() && this.isCastingRay) {
      console.debug('Casting ray!');
      const { ray, hasHit } = this.raycast(this.body, this.platformsCollidersLayer, 30, 10);

      if (!hasHit) {
        console.debug('Hitting void!');
        this.changeDirection(); // Handle direction change
      }

      this.rayGraphics.clear();
      this.rayGraphics.strokeLineShape(ray);
    }
  }

  raycast(body, layer, rayLength = 30, precision = 10) {
    const { x, y, width, height } = body;
    const halfHeight = height / 2;
    const distanceTraveled = Math.abs(this.previousRayX - x);
    if (this.previousHit !== undefined && distanceTraveled < precision) {
      return { ray: this.previousRay, hasHit: this.previousHit };
    }

    let line = new Phaser.Geom.Line();
    if (this.flipX) {
      // Cast ray to the left
      line.setTo(x, y + halfHeight, x - rayLength, y + halfHeight + rayLength);
    } else {
      // Cast ray to the right
      line.setTo(x + width, y + halfHeight, x + width + rayLength, y + halfHeight + rayLength);
    }

    const hits = layer.getTilesWithinShape(line);

    let hasHit = false;
    if (hits.length > 0) {
      hasHit = hits.some(hit => hit.index !== -1);
    }

    this.previousRay = line;
    this.previousHit = hasHit;
    this.previousRayX = x; // Update the x position for the next raycast

    return { ray: line, hasHit };
  }

  changeDirection() {
    this.setFlipX(!this.flipX); // Flip the sprite
    this.playerSpeed = -this.playerSpeed; // Reverse direction
    this.setVelocityX(this.playerSpeed); // Apply new velocity
    this.isCastingRay = false; // Disable raycasting temporarily

    // Set a timer to re-enable raycasting after a brief delay
    this.scene.time.delayedCall(500, () => {
      this.isCastingRay = true;
    });
  }

  die() {
    this.alive = false; // Set alive property to false
    this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this); // Unsubscribe from update event
    this.destroy(); // Destroy the enemy sprite
  }

  setPlatformColliders(platformsCollidersLayer) {
    this.platformsCollidersLayer = platformsCollidersLayer;
  }

  eventListeners() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }
}

export default Enemy;
