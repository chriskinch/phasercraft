console.log(Phaser)
class CustomPointer extends Phaser.Input.Mouse.MouseManager {

	constructor(event, handler, scope) {
		super(event, handler);
		console.log("hello");

	}
}

export default CustomPointer;
