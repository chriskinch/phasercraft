export default function dropIn(name, item, offset, { gravity = 200, bounce = 0.3, immovable = true}){
    item.body.setFriction(0,0).setDrag(0).setGravityY(gravity).setBounce(bounce);

    const spawn_stop = item.scene.physics.add.staticImage(item.x, offset, 'blank-gif');

    item.scene.physics.add.collider(spawn_stop, item);

    const updateHandler = () => {
        if(item.body.touching.down && item.body.wasTouching.down) {
            item.body.immovable = immovable;
            item.body.setVelocity(0);
            item.body.setGravityY(0);
            spawn_stop.destroy();
            item.spawned = true;
            item.scene.events.off('update', updateHandler);
            item.emit(`${name}:spawned`);
        }
    }

    item.scene.events.on('update', updateHandler);
}