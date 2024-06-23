import { Scene, Label, Font, Color, Vector } from 'excalibur';
import { Resources } from './resources';
import { Player } from './player';
import { NPCBoy } from './npcBoy';
import { NPCGirl } from './npcGirl';
import { Enemy } from './enemy';
import { BossEnemy } from './bossenemy';

export class MainScene extends Scene {
    constructor(engine) {
        super(engine);
        this.score = 0; // Initialize score counter
        this.player = null; // Reference to the player instance
    }

    onInitialize() {
        this.startGame();
    
        // Create the score label
        this.scoreLabel = new Label({
            text: `Score: ${this.score}`,
            pos: new Vector(-370, -275), // Adjusted position to be in the upper left corner
            font: new Font({
                family: 'Arial',
                size: 10, // Increased font size for better visibility
                color: Color.White,
            }),
            z: 1000, // Higher zIndex to appear in front of other actors
        });
    
        // Add the score label to the scene
        this.add(this.scoreLabel);
    }

    startGame() {
        const player = new Player();
        this.player = player; // Store reference to the player instance
        Resources.World1Forest.addToScene(this);

        const npcBoy = new NPCBoy(); // Instantiate NPCBoy
        const npcGirl = new NPCGirl(); // Instantiate NPCGirl

        // Ensure NPCs are added after their sprites are fully loaded
        Promise.all([npcBoy.spriteLoadedPromise, npcGirl.spriteLoadedPromise]).then(() => {
            this.add(player);
            this.add(npcBoy);
            this.add(npcGirl);

            // Add multiple enemies with different positions and velocities
            const enemies = [
                { pos: new Vector(120, 300), vel: new Vector(0, 50) },
                { pos: new Vector(280, 80), vel: new Vector(0, 0) },
                { pos: new Vector(820, 80), vel: new Vector(0, 0) },
                { pos: new Vector(407, 573), vel: new Vector(0, 0) },
                { pos: new Vector(55, 622), vel: new Vector(0, 0) },
            ];

            for (const enemyData of enemies) {
                const enemy = new Enemy(enemyData.pos, enemyData.vel);
                this.add(enemy);
    
                // Listen for 'death' event on each enemy
                enemy.on('death', () => {
                    this.player.emit('enemyKilled'); // Emit 'enemyKilled' event to Player
                });
            }

            const bossEnemy = new BossEnemy(); // Instantiate BossEnemy
            this.add(bossEnemy);

            // Set up the camera
            const camera = this.camera;
            camera.strategy.lockToActor(player);

            // Adjust the camera's zoom to achieve a viewport size of 256x256
            camera.zoom = 4;

            // Disable image smoothing on the canvas
            // const ctx = this.canvas.getContext('2d');
        });

        // Listen for 'enemyKilled' event from player
        player.on('enemyKilled', () => {
            this.score += 100; // Increase score by 100
            this.updateScoreLabel(); // Update the score label text
        });
    }

    updateScoreLabel() {
        this.scoreLabel.text = `Score: ${this.score}`; // Update score label text
    }

    onActivate() {
        // Add logic to run when main scene becomes active
    }

    onDeactivate() {
        // Add logic to run when main scene becomes inactive
    }

    onPostUpdate(engine, delta) {
        // Update score label position to follow the player
        if (this.player) {
            this.scoreLabel.pos = this.player.pos.add(new Vector(-50, -50)); // Adjust offset as needed
            this.scoreLabel.update(); // Update the label position explicitly
        }
    }    
}
