export default{
    addCollider(object, callback){
        this.scene.physics.add.collider(this, object, callback, null, this);
        return this;
    }
}