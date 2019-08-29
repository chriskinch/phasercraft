class Menu extends Phaser.GameObjects.DOMElement {
	constructor({scene, x, y, element, style, innerText, key}) {
        super(scene, x, y, element, style, innerText);
        
        Phaser.Display.Align.In.Center(this, scene.zone);

		this.bounds = {
			top: this.height * -0.5,
			left: this.width * -0.5,
			bottom: this.height * 0.5,
			right: this.width * 0.5,
			padding: 28
		}

        // Toggle on key binding
        scene.input.keyboard.on(`keydown-${key}`, this.toggleVisibility, this);
        
        // Pass event data on so we can do stuff with data-attrs
        this.on('click', (event) => { this.clickHandler(event); });

        // Menus by default start out hidden
        this.setVisible(false);

        scene.add.existing(this);
    }

    clickHandler(event){
        // NOW WE ARE IN BUSINESS!
        console.log(event.target, event.target.getAttribute('data-value'));
    }

	toggleVisibility() {
        this.setVisible((this.visible) ? false : true);
	}
}

export default Menu;