import { Scene, Label, Color, TextAlign, Actor, Input, Vector } from 'excalibur';
import { MainScene } from './mainGame.js';
import { EndScene } from './endGame.js';
import { Resources } from './resources.js';

export class IntroScene extends Scene {
    constructor(engine) {
        super(engine);
    }

    onInitialize() {
        // Add background image
        const backgroundImage = new Actor({
            width: this.engine.drawWidth,
            height: this.engine.drawHeight,
            pos: new Vector(this.engine.drawWidth / 2, this.engine.drawHeight / 2) // Center the background
        });
        backgroundImage.graphics.add(Resources.menuScreen.toSprite());
        backgroundImage.anchor.setTo(0.5, 0.5); // Center the anchor point
        this.add(backgroundImage);

        // Create START label
        const startLabel = new Label({
            text: 'START',
            pos: new Vector(this.engine.drawWidth / 2, this.engine.drawHeight / 2 + 50),
            fontFamily: 'Arial',
            fontSize: 80, // Adjust the font size here
            textAlign: TextAlign.Center,
            color: Color.Black,
            // Optionally, add outline or shadow effects for better visibility
            // outlineWidth: 2,
            // outlineColor: Color.Black
        });

        startLabel.on('pointerup', () => {
            this.engine.goToScene('tutorial');
        });
        this.add(startLabel);

        // Handle input events
        this.on('pointerup', this.handlePointerUp.bind(this));
        this.on('keyup', this.handleKeyUp.bind(this));
    }

    handlePointerUp(evt) {
        // Check if the pointer was released on the START label
        if (evt.target && evt.target instanceof Label && evt.target.text === 'START') {
            // Navigate to the main game scene
            this.engine.goToScene('tutorial');
        }

        // Check if the pointer was released on the CONTROLS label
        if (evt.target && evt.target instanceof Label && evt.target.text === 'CONTROLS') {
            // Show controls
            console.log('WASD for moving');
            console.log('SPACEBAR for interacting/attacking');
        }
    }

    handleKeyUp(evt) {
        // Check if the spacebar was pressed
        if (evt.key === Input.Keys.Space) {
            // Navigate to the main game scene
            this.engine.goToScene('tutorial');
        }
    }

    onActivate() {
        // Add logic to run when intro scene becomes active
    }

    onDeactivate() {
        // Add logic to run when intro scene becomes inactive
    }
}
