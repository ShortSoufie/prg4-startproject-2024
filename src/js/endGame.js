import { Scene, Sprite, Vector, Actor } from 'excalibur';
import { Resources } from './resources.js';

export class EndScene extends Scene {
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
        backgroundImage.graphics.add(Resources.endScreen.toSprite());
        backgroundImage.anchor.setTo(0.5, 0.5); // Center the anchor point
        this.add(backgroundImage);
    }

    onActivate() {
        // Add logic to run when intro scene becomes active
    }

    onDeactivate() {
        // Add logic to run when intro scene becomes inactive
    }
}
