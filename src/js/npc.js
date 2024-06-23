// npc.js

import { Actor, SpriteSheet, Vector, Shape, CollisionType, Timer } from 'excalibur';
import { Resources } from './resources.js';

export class GenericNPC extends Actor {
    constructor(spriteInfo) {
        super({
            // Define initial properties of the actor
            pos: spriteInfo.initialPosition || new Vector(200, 966), // Set initial position
            collider: Shape.Box(16, 16),
            collisionType: CollisionType.Active
        });

        this.direction = 1; // Start moving right initially
        this.spriteLoaded = false; // Track whether sprite is loaded

        // Load sprite based on provided spriteInfo
        const spriteSheetName = spriteInfo.spriteSheet;
        const spriteSheetResource = Resources[spriteSheetName];
        
        if (!spriteSheetResource) {
            throw new Error(`Sprite sheet '${spriteSheetName}' not found in Resources.`);
        }

        spriteSheetResource.load().then(() => {
            const spritesheet = SpriteSheet.fromImageSource({
                image: spriteSheetResource,
                grid: { rows: 1, columns: spriteInfo.columns, spriteWidth: 16, spriteHeight: 16 },
            });

            const sprite = spritesheet.getSprite(spriteInfo.row, 0);
            this.graphics.add("default", sprite);
            this.graphics.use("default");
            this.spriteLoaded = true; // Mark sprite as loaded

            // Set up a timer to change direction every 2 seconds
            this.setupTimer();
        });
    }

    setupTimer() {
        // Check if the actor is added to a scene
        if (!this.isInitialized) {
            this.on('initialize', () => this.setupTimer());
            return;
        }

        // Set up a timer to change direction every 2 seconds
        const timer = new Timer({
            fcn: () => this.toggleDirection(),
            interval: 2000, // 2 seconds
            repeats: true
        });

        this.scene.add(timer); // Use this.scene to add timer to the current scene
        timer.start();
    }

    toggleDirection() {
        // Toggle direction between 1 (right) and -1 (left)
        this.direction *= -1;

        // Flip sprite horizontally based on direction
        this.graphics.flipHorizontal = this.direction === 1;

        // Update velocity based on the current direction
        this.vel.x = 20 * this.direction;
    }

    onPreUpdate(engine, delta) {
        if (!this.spriteLoaded) {
            return; // Skip update if sprite is not loaded yet
        }

        // Apply velocity to position based on delta time
        this.pos.x += this.vel.x * delta / 1000; // delta is in milliseconds, convert to seconds
        this.pos.y += this.vel.y * delta / 1000; // delta is in milliseconds, convert to seconds
    }
}
