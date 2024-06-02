import Phaser from 'phaser';
import Player from '../entities/Player';
import Enemies from '../groups/Enemies';
import Collectibles from '../groups/Collectibles';
import Hud from '../hud';

class Play extends Phaser.Scene {
  constructor(config) {
    super('PlayScene');
    this.config = config;
  }

  create() {
    console.log('Play scene create method called.');

    this.score = 0;
    this.totalEggs = 0;
    this.collectedEggs = 0;

    this.add.image(0, 0, 'bg').setOrigin(0).scrollFactorX = 0.5;

    const map = this.createMap();
    const layers = this.createLayers(map);
    const playerZones = this.getPlayerZones(layers.playerZones);

    const player = this.createPlayer(playerZones.start);
    this.player = player;

    const enemies = this.createEnemies(layers.enemySpawns, layers.platformsColliders);
    const collectables = this.createCollectibles(layers.collectibleLayer);

    this.hud = new Hud(this, 0, 0);

    this.createPlayerColliders(player, {
      colliders: {
        platformsColliders: layers.platformsColliders,
        enemies: enemies,
        collectables,
      },
    });

    this.createEnemyColliders(enemies, {
      colliders: {
        platformsColliders: layers.platformsColliders,
        player: player,
      },
    });

    this.createEndZone(playerZones.end, player);
    this.setupFollowupCamera(player);

    if (this.sys.game.device.os.android || this.sys.game.device.os.iOS) {
      this.createJoystick();
    }

    // Debug
    this.checkLeaderboardQualification(this.score).then(result => {
      console.log('Leaderboard qualification result:', result);
    });
  }

  createJoystick() {
    this.joystick = this.plugins.get('rexVirtualJoystick').add(this, {
      x: this.cameras.main.width / 2,
      y: this.cameras.main.height / 2,
      radius: 100,
      base: this.add.circle(0, 0, 100, 0x888888).setAlpha(0.3),
      thumb: this.add.circle(0, 0, 50, 0xffffff).setAlpha(0.8)
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

  async checkLeaderboardQualification(score) {
    try {
      console.log('About to fetch leaderboard:', this.config.leaderboardUrl);
      
      const response = await fetch(this.config.leaderboardUrl);
      console.log('Fetch response:', response);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const leaderboard = await response.json();
      console.log('Leaderboard data:', leaderboard);
      
      const top7 = leaderboard.sort((a, b) => b.score - a.score).slice(0, 7);
      const lowestScore = Math.min(...top7.map(entry => entry.score));
      
      return score > lowestScore || top7.length < 7;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return false;
    }
  }
  createMap() {
    const map = this.make.tilemap({ key: 'map' });
    map.addTilesetImage('tilemap', 'background_tiles');
    return map;
  }

  createLayers(map) {
    const tileset = map.getTileset('tilemap');
    const platformsColliders = map.createLayer('colliders', tileset).setAlpha(0);
    const environment = map.createLayer('environment', tileset);
    const platforms = map.createLayer('platforms', tileset);
    const playerZones = map.getObjectLayer('playerZones');
    const enemySpawns = map.getObjectLayer('enemySpawnPoints');
    const collectibleLayer = map.getObjectLayer('collectibles');

    platformsColliders.setCollisionByProperty({ collides: true });

    return {
      environment,
      platforms,
      platformsColliders,
      playerZones,
      enemySpawns,
      collectibleLayer
    };
  }

  createPlayer(start) {
    const player = new Player(this, start.x, start.y);
    return player;
  }

  createEnemies(spawnLayer, platformsColliders) {
    const enemies = new Enemies(this);
    const enemyTypes = enemies.getTypes();

    spawnLayer.objects.forEach(spawnPoint => {
      const enemy = new enemyTypes[spawnPoint.type](this, spawnPoint.x, spawnPoint.y);
      enemy.setPlatformColliders(platformsColliders);
      enemies.add(enemy);
    });

    return enemies;
  }

  createCollectibles(collectibleLayer) {
    const collectibles = new Collectibles(this).setDepth(-1);
    collectibles.addFromLayer(collectibleLayer);
    return collectibles;
  }

  onPlayerCollision(enemy, player) {
    console.log('Player collided with enemy');
    player.playerDeath(enemy);
  }

  onCollect(entity, collectable) {
    console.log('collected an item');
    this.score += collectable.value;
    this.hud.updateScoreboard(this.score);
    if (collectable.type === 'egg') {
      this.collectedEggs++;
      this.hud.updateEggs(this.collectedEggs, this.totalEggs);
    }
    collectable.disableBody(true, true);
  }

  createPlayerColliders(player, { colliders }) {
    player
      .addCollider(colliders.platformsColliders)
      .addOverlap(colliders.collectables, this.onCollect, this);
  }

  createEnemyColliders(enemies, { colliders }) {
    enemies
      .addCollider(colliders.platformsColliders)
      .addCollider(colliders.player, this.onPlayerCollision);
  }

  setupFollowupCamera(player) {
    const { height, width, mapOffset, zoomFactor } = this.config;
    console.debug('Camera setup:', height, width, mapOffset, zoomFactor);
    this.physics.world.setBounds(0, 0, width + mapOffset, height + 200);
    this.cameras.main.setBounds(0, 0, width + mapOffset, height).setZoom(zoomFactor);
    this.cameras.main.startFollow(player);
  }

  getPlayerZones(playerZonesLayer) {
    const playerZones = playerZonesLayer.objects;
    return {
      start: playerZones.find(zone => zone.name === 'startZone'),
      end: playerZones.find(zone => zone.name === 'endZone'),
    };
  }

  createEndZone(endZone, player) {
    const endOfLevel = this.physics.add.sprite(endZone.x, endZone.y + 5, 'end')
      .setAlpha(0)
      .setSize(endZone.width, endZone.height)
      .setOrigin(0.5, 1);

    const eoOverlap = this.physics.add.overlap(player, endOfLevel, async () => {
      let message;
      if (this.collectedEggs === this.totalEggs) {
        eoOverlap.active = false;
        player.alive = false;
        const qualifies = await this.checkLeaderboardQualification(this.score);
        if (qualifies) {
          this.scene.start('InputScoreScene', { message: 'You qualified for the leaderboard!', score: this.score });
        } else {
          this.scene.start('EndGameScene', { message: 'Thanks for playing!', score: this.score });
        }
      } else {
        message = this.add.text(endZone.x - 75, endZone.y - 75, `Need ${this.totalEggs - this.collectedEggs} eggs!`, {
          fontSize: '20px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 2,
          fontWeight: 'bold',
        });

        setTimeout(() => {
          message.destroy();
        }, 5000);
      }
    });
  }
}

export default Play;
