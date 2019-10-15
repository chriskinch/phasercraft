import Character from './Character';

class Menu extends Phaser.GameObjects.DOMElement {
	constructor({scene, x, y, element, style, innerText, key}) {
        super(scene, x, y, element, style, innerText);

        // Toggle on key binding
        scene.input.keyboard.on(`keydown-${key}`, this.toggleVisibility, this);
        
        // Pass event data on so we can do stuff with data-attrs
        this.on('click', (event) => { this.clickHandler(event) });

        // Menus by default start out hidden
        this.setVisible(false).setDepth(this.scene.depth_group.UI);

        scene.add.existing(this);

        Object.assign(this, this.setIcon());
        
        const config = { scene: scene, x: x, y: y };
        this.character = new Character(config).createFromCache('character').addListener('click');
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
        
        this.character.toggleVisibility();
    }

    tabButton(tab) {
        console.log("TAB: ", tab, this);
    }

    setIcon() {
        const menu_button = this.scene.add.sprite(0, 0, 'icon', 'icon_0021_charm')
            .setInteractive()
            .setDepth(this.scene.depth_group.UI)
            .setScale(2);

        Phaser.Display.Align.In.BottomRight(menu_button, this.scene.zone);
        
        menu_button.on('pointerdown', this.toggleVisibility, this);
        
        return {menu_button: menu_button};
    }
}

export default Menu;