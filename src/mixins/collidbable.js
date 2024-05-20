export default{
    addCollider(object, callback, context){
        this.scene.physics.add.collider(this, object, callback, null, context || this);
        return this;
    },
    addOverlap(otherGameobject, callback, context) {
        this.scene.physics.add.overlap(this, otherGameobject, callback, null, context || this);
        return this;
    },
      
}