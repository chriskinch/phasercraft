class Character extends Phaser.GameObjects.DOMElement {
	constructor({scene, x, y, element, style, innerText}) {
        super(scene, x, y, element, style, innerText);
        
        // Pass event data on so we can do stuff with data-attrs
        this.on('click', (event) => { this.clickHandler(event) });

        // Menus by default start out hidden
        this.setVisible(false).setDepth(this.scene.depth_group.TOP);

        scene.add.existing(this);
    }

    clickHandler(event){
        // NOW WE ARE IN BUSINESS!
        console.log("INTERNAL HANDLER: ", event.target.getAttribute('data-tab'));
	}
    
    toggleVisibility() {
        console.log("TOGGLE");
        this.setVisible(!this.visible);

        const {health, resource, ...stats} = this.scene.player.stats;

		Object.entries(stats).forEach(s => {
			const el = this.node.querySelector(`.${s[0]}-value`);
			if(el) el.innerText = s[1];
		});	
    }
}

export default Character;