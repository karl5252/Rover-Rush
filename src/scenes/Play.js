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
        this.score = 0;
        this.totalEggs = 0;
        this.collectedEggs = 0;

        //background resize to match the game size
        this.add.image(0, 0, 'bg').setOrigin(0).scrollFactorX = 0.5;

        const map = this.createMap();
        const layers = this.createLayers(map);
        const playerZones = this.getPlayerZones(layers.playerZones);

        const player = this.createPlayer(playerZones.start);
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
    }
    
    async checkLeaderboardQualification(score) {
      try {
        const response = await fetch(this.config.leaderboardUrl);
        const leaderboard = await response.json();
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

        //collectibleLayer.objects.forEach(collectible => {
            //collectables.get(collectible.x, collectible.y, 'stone').setDepth(-1);
            //collectables.add(new Collectible(this, collectible.x, collectible.y, 'stone'));
            //collectibles.get(collectible.x, collectible.y, 'stone');
       // });
        return collectibles;
    }

    onPlayerCollision(enemy, player) {
        console.log('Player collided with enemy');
        player.playerDeath(enemy);
    }

    onCollect(entity,collectable) {
        console.log('collected an item');
        //console.log(collectable.value);
        this.score += collectable.value;
        this.hud.updateScoreboard(this.score);
        if(collectable.type === 'egg') {
            this.collectedEggs++;
            this.hud.updateEggs(this.collectedEggs, this.totalEggs);
        }
        //debugger;
        //console.log(this.score);
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
            .addCollider(colliders.player, this.onPlayerCollision); // Ensure correct context
    }

    /*setupFollowupCamera(player) {
        const { width, height, mapOffset } = this.config;
        this.physics.world.setBounds(0, 0, width + mapOffset, height + 200);
        this.cameras.main.setBounds(0, 0, width + mapOffset, height).setZoom(2);

        this.cameras.main.startFollow(player);
    }*/
    setupFollowupCamera(player) {
        const { height, width, mapOffset, zoomFactor } = this.config;
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
    
            // Remove the text after 5 seconds
            setTimeout(() => {
              message.destroy();
            }, 5000);
          }
        });
      }
}

export default Play;
