import Phaser from 'phaser';
import Collectible from '../entities/Collectible';

class Collectibles extends Phaser.Physics.Arcade.StaticGroup {
    constructor(scene) {
        super(scene.physics.world, scene);
        this.scene = scene;

        this.createFromConfig({
            classType: Collectible
    });
    }

    mapProperties(propertiesList){

        if (!propertiesList || propertiesList.length === 0) { return {};}
        return propertiesList.reduce((map, obj) => {
            map[obj.name] = obj.value;
            return map;
        }, {})
    }
    
    addFromLayer(layer) {
        const layerProperties = this.mapProperties(layer.properties);
    
        layer.objects.forEach(collectibleObject => {
          const objectProperties = this.mapProperties(collectibleObject.properties);
    
          // Prioritize object properties over layer properties
          const type = objectProperties.collType || layerProperties.collType;
          const value = objectProperties.scoringValue || layerProperties.scoringValue || 1;
    
          // Create the collectible at the specified position with the specified type
          const collectible = new Collectible(this.scene, collectibleObject.x, collectibleObject.y, type);
          collectible.value = value;
          collectible.type = type;
    
          if (type === 'egg') {
            this.scene.totalEggs++;
          }
    
          this.add(collectible);
        });
    }
}
export default Collectibles;