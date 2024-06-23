// npcBoy.js

import { Vector, CollisionType } from 'excalibur';
import { GenericNPC } from './npc.js';
import { Timer } from 'excalibur';
import { Player } from './player.js';

export class NPCBoy extends GenericNPC {
    constructor() {
        const spriteInfo = {
            spriteSheet: 'npcBoy',
            row: 2,
            columns: 3,
            initialPosition: new Vector(200, 966), // initial position
            initialDirection: 1 // initial direction (1 for right, -1 for left)
        };
        super(spriteInfo);

        // Boolean flag to track current movement direction
        this.isMovingRight = true;

        // Set collision type
        this.collider.type = CollisionType.Passive;

        // Set up a timer to control movement direction
        this.on('initialize', () => {
            const movementTimer = new Timer({
                interval: 2000, // 2 seconds
                fcn: () => {
                    this.isMovingRight = !this.isMovingRight; // Toggle direction
                    this.updateMovement(); // Update movement direction
                },
                repeats: true // Repeat timer
            });

            this.scene.add(movementTimer); // Add timer to the scene when initialized
            movementTimer.start();

            // Call initial movement update
            this.updateMovement();
        });

        // Handle collision with player
        this.on('collisionstart', (event) => {
            const other = event.other;
            if (other instanceof Player) {
                other.showDialog("WATCH OUT FOR THE BIG SLIME AT THE END!!!!");
            }
        });
    }

    updateMovement() {
        const speed = 20; // Adjust speed as needed
        this.vel.x = this.isMovingRight ? speed : -speed; // Set velocity based on direction
    }
}
