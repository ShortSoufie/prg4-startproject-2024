import { Actor, SpriteSheet, Vector, Shape, CollisionType, Timer } from 'excalibur';
import { Resources } from './resources.js';

export class BossEnemy extends Actor {
    constructor(){
        super({
            pos: new Vector(722, 647), // Specific position
            vel: new Vector(80, 0), // Specific velocity
            collider: Shape.Box(32, 32),
            collisionType: CollisionType.Active
        });

        this.direction = 1; // Set direction based on initial velocity
        
        // Ensure that Resources.enemyKingSlime is correctly defined
        if (!Resources.enemyKingSlime) {
            throw new Error('Resources.enemyKingSlime is not defined.');
        }

        Resources.enemyKingSlime.load().then(() => {
            const spritesheet = SpriteSheet.fromImageSource({
                image: Resources.enemyKingSlime, // Ensure this is the correct resource
                grid: { rows: 1, columns: 1, spriteWidth: 32, spriteHeight: 32 },
            });

            const down = spritesheet.getSprite(0, 0);
            this.graphics.use(down);
        });
    }

    onInitialize(engine) {
        // Set up a timer to change direction every 2 seconds
        const timer = new Timer({
            fcn: () => this.changeDirection(),
            interval: 2000, // 2 seconds
            repeats: true
        });

        engine.currentScene.add(timer);
        timer.start();
    }

    changeDirection() {
        this.direction *= -1; // Change direction
        this.graphics.flipHorizontal = this.direction === 1; // Flip sprite horizontally if moving left
        this.vel.x = 80 * this.direction; // Update velocity based on the new direction
    }

    onPreUpdate(engine) {
        // The velocity is already set in the constructor or changed in changeDirection
    }
}