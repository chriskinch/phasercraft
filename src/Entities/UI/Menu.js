import { GameObjects, Display } from 'phaser';

class Menu extends GameObjects.DOMElement {
	constructor({scene, x, y, element, style, innerText, key}) {
        super(scene, x, y, element, style, innerText);
        
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

        Object.assign(this, this.setIcon());
    }

    clickHandler(event){
        // NOW WE ARE IN BUSINESS!
        // console.log("INTERNAL HANDLER: ", event.target.getAttribute('data-tab'));

        const close = event.target.getAttribute('data-close');
        if(typeof close === "string") this.toggleVisibility();

        const tab = event.target.getAttribute('data-tab');
        if(typeof tab === "string") this.tabButton(tab);
    }
    
    toggleVisibility() {
        console.log("TOGGLE");
        const scene_manager = this.scene.scene;
        this.setVisible(!this.visible);
        (this.visible) ? scene_manager.pause() : scene_manager.resume();
    }

    tabButton(tab) {
        console.log("TAB: ", tab);
    }

    setIcon() {
        const menu_button = this.scene.add.sprite(0, 0, 'icon', 'icon_0021_charm')
            .setInteractive()
            .setDepth(this.scene.depth_group.UI);

        Display.Align.In.BottomRight(menu_button, this.scene.zone);
        
        menu_button.on('pointerdown', this.toggleVisibility, this);
        
        return {menu_button: menu_button};
    }
}

export default Menu;