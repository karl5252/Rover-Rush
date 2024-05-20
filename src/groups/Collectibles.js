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
        const {scoringValue: value, type} = this.mapProperties(layer.properties);

        layer.objects.forEach(collectibleObject => {
            const collectible = this.get(collectibleObject.x, collectibleObject.y, type);
            const colProperties = this.mapProperties(collectibleObject.properties);
            collectible.value = colProperties.scoringValue || 1;  //Uncaught TypeError: Cannot read properties of undefined (reading 'scoringValue')

        });
    }
}
export default Collectibles;