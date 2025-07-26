import { GameObjects, Display, Scene } from "phaser";
import store from "@store";

interface SpellConfig {
	scene: Scene;
	x: number;
	y: number;
	key: string;
	player: any;
	cost: { [key: string]: number };
	cooldown: number;
	name: string;
	icon_name: string;
	hotkey: string;
	slot: number;
	loop?: boolean;
	cooldownDelay?: boolean;
	cooldownDelayAll?: boolean;
}

interface SpellValue {
	crit: boolean;
	amount: number;
}

class Spell extends GameObjects.Sprite {
	public player: any;
	public cost: { [key: string]: number };
	public typedCost: number;
	public hasAnimation: boolean;
	public enabled: boolean;
	public cooldown: number;
	public name: string;
	public icon_name: string;
	public hotkey: string;
	public slot: number;
	public loop: boolean;
	public cooldownDelay: boolean;
	public cooldownDelayAll: boolean;
	public button: GameObjects.Sprite;
	public text: GameObjects.Text;
	public cooldownTimer: Phaser.Tweens.Tween;
	public target: any;
	public animation: any;

	constructor({scene, x, y, key, ...config}: SpellConfig) {
		super(scene, x, y, key);	
        Object.assign(this, config);
        
        this.typedCost = this.cost[this.player.resource.name];
        this.hasAnimation = true;
        this.enabled = false;
        // Placeholder empty function for clearing last spell
        this.player.clearLastPrimedSpell = () => {};
        
        this.setAnimation();
        Object.assign(this, this.setIcon());
        // Initial state is assumed to be off so monitor spell.
        this.monitorSpell();
        
        this.scene.events.on('spell:disableall', this.killSpell, this);
        this.scene.events.on('spell:enableall', this.monitorSpell, this);
        this.scene.add.existing(this).setDepth(1000).setVisible(false);
    }

    checkResource(): boolean {
		return (this.typedCost <= this.player.resource.getValue());
    }
    
    checkCooldown(): boolean {
		return (!this.cooldownTimer || !this.cooldownTimer?.getValue() || this.cooldownTimer.getValue() === this.cooldown);
    }
    
    checkReady(): boolean {
        return (this.checkResource() && this.checkCooldown());
    }

    onResourceChangeHandler(): void {
        this.checkReady() ? this.enableSpell() : this.disableSpell("resource change");
    }

    enableSpell(): void {
        if(!this.enabled) {
            this.button.setAlpha(1);
            this.setButtonEvents('on');
            this.enabled = true;
        }
    }

    monitorSpell(): void {
        this.player.resource.on('change', this.onResourceChangeHandler, this);
        if(this.checkReady()) this.enableSpell();
    }

    disableSpell(from: string): void {
        if(this.enabled) {
            this.button.setAlpha(0.4);
            this.setButtonEvents('off');
            this.setCastEvents('off');
            this.out();
            this.player.clearLastPrimedSpell = () => {};
            this.enabled = false;
        }
    }

    killSpell(): void {
        this.player.resource.off('change', this.onResourceChangeHandler, this);
        this.disableSpell("kill spell");
    }

    clearSpell(): void {
        this.out();
        this.setCastEvents('off');
        this.setButtonEvents('on');
        this.scene.events.emit('spell:cleared', this);
    }

    setCooldown(): Phaser.Tweens.Tween {
        return this.scene.tweens.addCounter({
			from: 0,
			to: this.cooldown,
			duration: this.cooldown * 1000,
			onStart: () => {
                this.text.setVisible(true);
			},
			onUpdate: () => {
                const time = this.cooldown - Math.floor(this.cooldownTimer.getValue() ?? 0);
                this.text.setText(time.toString());
            },
			onComplete: () => {
                this.text.setVisible(false);
                this.onResourceChangeHandler();
            }
        });
    }
    
    castSpell(target: any): void {
        this.target = target;
        this.effect(target);
        // Charge the player some resource
        this.player.resource.adjustValue(-this.typedCost);
        // Do the animation
        this.animation = (this.hasAnimation) ? this.startAnimation() : null;
        // Check if cooldown should be trigger automatically. Other wise spell must handle this.
		if(!this.cooldownDelayAll) {
            if(!this.cooldownDelay) {
                this.cooldownTimer = this.setCooldown();
            }else{
                this.killSpell();
            }
        }else{
            this.scene.events.emit('spell:disableall', this);
        }
		this.scene.events.emit('spell:cast', this);
	}
	
	clearLastPrimedSpell(): void {
		this.player.clearLastPrimedSpell();
		this.player.clearLastPrimedSpell = () => this.clearSpell();
	}
    
    setPrimed(): void {
		this.clearLastPrimedSpell();
        this.scene.events.emit('spell:primed', this);
        this.setButtonEvents('off');
        this.setCastEvents('on');
		this.button.setTint(0xff9955);
    }

    over(): void {
		this.button.setTint(0x55ff55);
	}

	out(): void {
        // For some reason this doesn't work as this.button.setTint(); ???
		// this.scene.time.delayedCall(0, () => this.button.setTint(), [], this);
		this.button.setTint();
    }

    setButtonEvents(state: 'on' | 'off'): void {
        this.button[state]('pointerover', this.over, this);
        this.button[state]('pointerout', this.out, this);
        this.button[state]('pointerdown', this.setPrimed, this);
        if (this.button?.scene.input.keyboard) {
            this.button.scene.input.keyboard[state](`keydown-${this.hotkey}`, this.setPrimed, this);
        }
    }

    setCastEvents(state: 'on' | 'off'): void {
        // This method should be implemented by subclasses
    }

    effect(target: any): void {
        // This method should be implemented by subclasses
    }

    setIcon(): { button: GameObjects.Sprite; text: GameObjects.Text } {
        const button = this.scene.add.sprite(0, 0, 'icon', this.icon_name)
            .setInteractive()
            .setDepth((this.scene as any).depth_group.UI)
            .setAlpha(0.4)
            .setScale(1.5);

		let styles = {
			font: '16px monospace',
			fill: '#ffffff',
			align: 'center'
		};
		const text = this.scene.add.text(-2, -2, this.cooldown.toString(), styles).setOrigin(0.5).setDepth((this.scene as any).depth_group.UI).setVisible(false);

		Display.Align.In.BottomLeft(button, (this.scene as any).UI.frames[this.slot]);
        Display.Align.In.Center(text, button, 0, 0);
        
        return {button: button, text: text};
    }

    setAnimation(): void {
        this.scene.anims.create({
			key: this.name + '-animation',
			frames: this.scene.anims.generateFrameNumbers(this.name + '-effect', { start: 0, end: 24 }),
			frameRate: 24,
			repeat: this.loop ? -1 : 0,
			showOnStart: true,
            hideOnComplete: true
        });
        this.on('animationstart', this.animationStart);
        this.on('animationupdate', this.animationUpdate);
        this.on('animationcomplete', this.animationComplete);
    }

    // Holding functions
    animationStart(): void {}
    animationUpdate(): void {}
    animationComplete(): void {}

    startAnimation(): void {
		this.anims.play(this.name + '-animation');
    }
    
    setValue({base, key, reducer = (v: number) => v}: {base: number; key: string; reducer?: (v: number) => number}): SpellValue {
        const power = store.getState().game.stats[key];
		// Value based on base + scaled percentage of base from power + flat percent of power
		const scaled = base + (base * (power/100)) + power/10;
		// Check for crit
		const crit = this.player.isCritical();
		const total = reducer(crit ? scaled * 1.5 : scaled);
		return { crit: crit, amount: total };
	}
}

export default Spell;