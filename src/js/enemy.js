import { Actor, SpriteSheet, Vector, Shape, CollisionType, Timer } from 'excalibur';
import { Resources } from './resources';

export class Enemy extends Actor {
    constructor(pos, vel, scene) {
        super({
            pos: pos,
            vel: vel,
            collider: Shape.Box(16, 16),
            collisionType: CollisionType.Active
        });

        this.direction = vel.x > 0 ? 1 : -1; // Set direction based on initial velocity
        this.scene = scene; // Store reference to the scene

        // Load sprite (replace with your actual sprite loading logic)
        Resources.enemySlime.load().then(() => {
            const spritesheet = SpriteSheet.fromImageSource({
                image: Resources.enemySlime,
                grid: { rows: 1, columns: 1, spriteWidth: 16, spriteHeight: 16 },
            });

            const down = spritesheet.getSprite(0, 0);
            this.graphics.use(down);
        });
    }

    onInitialize(engine) {
        // Set up a timer to change direction every 2 seconds (your existing logic)
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
        // Optional: Add logic before update
    }

    // Method to destroy the enemy and reward the player
    killAndReward() {
        this.kill(); // Call base kill method of Actor
        if (this.scene) {
            this.scene.score += 100;
            console.log(this.scene.score)
        }
    }
}
