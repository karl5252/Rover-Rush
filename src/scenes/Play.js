import Phaser from 'phaser';
import Player from '../entities/Player';
//import Samurai from '../entities/Samurai';
import Enemies from '../groups/Enemies';

class Play extends Phaser.Scene {

  constructor(config) {
    super('PlayScene');
    this.config = config;
  }

  create() {
    //const background = this.add.image(0, 0, 'bg').setOrigin(0, 0);
    const map = this.createMap();
    const layers = this.createLayers(map);
    const playerZones = this.getPlayerZones(layers.playerZones);

    const player = this.createPlayer(playerZones.start);
    const enemies = this.createEnemies(layers.enemySpawns);

//    this.playerSpeed = 200;
    //player.addCollider(layers.platformsColliders);

    //this.physics.add.collider(player, layers.platformsColliders);
    //enemy.addCollider(layers.platformsColliders);
    this.createPlayerColliders(player, { colliders: {
      platformsColliders: layers.platformsColliders
    }});
    this.createEnemyColliders(enemies, { colliders: {
      platformsColliders: layers.platformsColliders,
      player: player

    }});



    this.createEndZone(playerZones.end, player);
    this.setupFollowupCamera(player);
    //this.cameras.main.startFollow(player);
  }

  createMap() {
    const map = this.make.tilemap({key: 'map'});
    map.addTilesetImage('demo_build_1', 'tiles-1');
    return map;
  }

  createLayers(map) {
    const tileset = map.getTileset('demo_build_1');
    const platformsColliders = map.createStaticLayer('colliders', tileset);
    const environment = map.createStaticLayer('environment', tileset);
    const platforms = map.createStaticLayer('platforms', tileset);
    const playerZones = map.getObjectLayer('playerZones');
    const enemySpawns = map.getObjectLayer('enemySpawnPoints');


    platformsColliders.setCollisionByProperty({collides: true});

    return { environment, platforms, platformsColliders, playerZones, enemySpawns };
  }

createPlayer(start) {
    const player = new Player(this, start.x, start.y);
    //const player = this.physics.add.sprite(100, 250, 'player');
    //player.body.setGravityY(500);
    //.setCollideWorldBounds(true);
    return player;
  }

  createEnemies(spawnLayer) {
    const enemies = new Enemies(this);
    const enemyTypes = enemies.getTypes();

    spawnLayer.objects.forEach(spawnPoint => {
      const enemy = new enemyTypes[spawnPoint.type](this, spawnPoint.x, spawnPoint.y);
      enemies.add(enemy);
    })

    return enemies;
  }

createEnemyColliders(enemies, { colliders }) {
  enemies
    .addCollider(colliders.platformsColliders)
    .addCollider(colliders.player);
  }


createPlayerColliders(player, { colliders }) {
  player.addCollider(colliders.platformsColliders);
}

setupFollowupCamera(player) {
  const { width, height, mapOffset } = this.config;
  this.physics.world.setBounds(0, 0, width + mapOffset, height + 200);
  this.cameras.main.setBounds(0, 0, width + mapOffset, height).setZoom(2);

  this.cameras.main.startFollow(player);
}

getPlayerZones(playerZonesLayer) {
  //return map.getObjectLayer('playerZones').objects;
  const playerZones = playerZonesLayer.objects;
  return {
    start:playerZones.find(zone => zone.name === 'startZone'),
    end:playerZones.find(zone => zone.name === 'endZone')

  }
}
createEndZone(endZone, player) {

  const endOfLevel = this.physics.add.sprite(endZone.x, endZone.y + 5, 'end')
  .setAlpha(0)
  .setSize(endZone.width, endZone.height)
  .setOrigin(0.5, 1);

  const eoOverlap = this.physics.add.overlap(player, endOfLevel, () => {
    eoOverlap.active = false;
    // display a big text on the screen you won
    this.add.text(endZone.x - 75, endZone.y - 75, 'You Won!', {
      fontSize: '40px',
      color: '#ffffff'
    });
    //this.scene.restart();
  });
  }
}


export default Play;