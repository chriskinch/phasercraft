class CharacterSelect extends Phaser.GameObjects.DOMElement {
	constructor({scene, x, y, element, style, innerText}) {
        super(scene, x, y, element, style, innerText);

		this.bounds = {
			top: this.height * -0.5,
			left: this.width * -0.5,
			bottom: this.height * 0.5,
			right: this.width * 0.5,
			padding: 28
		}
        
        // Pass event data on so we can do stuff with data-attrs
        this.on('click', (event) => { this.clickHandler(event); });

        scene.add.existing(this);
    }

    clickHandler(event){
        // NOW WE ARE IN BUSINESS!
        // console.log("INTERNAL HANDLER: ", event.target, event.target.getAttribute('data-value'));
    }
}

export default CharacterSelect;