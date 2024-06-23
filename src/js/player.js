import { Actor, SpriteSheet, Vector, Input, Animation, Keys, CollisionType, Shape, Label, TextAlign } from 'excalibur';
import { Resources } from './resources.js';
import { Enemy } from './enemy.js'; // Import the Enemy class
import { BossEnemy } from './bossenemy.js'; // Import the BossEnemy class

export class Player extends Actor {
  constructor(){
    super({
      pos: new Vector(70, 116),
      vel: new Vector(0, 0),
      collider: Shape.Box(16, 16), // Assuming player sprite is 16x16
      collisionType: CollisionType.Active
    });

    this.currentAnimation = ""; // Initialize currentAnimation variable
    this.isAttacking = false; // Track if player is currently attacking

    // Ensure that the image is loaded before creating the sprite sheet
    Resources.Player.load().then(() => {
      const spritesheet = SpriteSheet.fromImageSource({
          image: Resources.Player,
          grid: { rows: 4, columns: 3, spriteWidth: 16, spriteHeight: 16 },
      });

      const attackDown = Animation.fromSpriteSheet(spritesheet, [9], 200);
      const attackUp = Animation.fromSpriteSheet(spritesheet, [10], 200);
      const attackSide = Animation.fromSpriteSheet(spritesheet, [11], 200);

      const downIdle = spritesheet.getSprite(0, 0); // Frame 0 for downIdle
      const upIdle = spritesheet.getSprite(1, 0); // Frame 0 for upIdle
      const sideIdle = spritesheet.getSprite(2, 0); // Frame 0 for sideIdle

      const downWalk = Animation.fromSpriteSheet(spritesheet, [1, 2], 200);
      const upWalk = Animation.fromSpriteSheet(spritesheet, [4, 5], 200);
      const sideWalk = Animation.fromSpriteSheet(spritesheet, [7, 8], 200);

      this.graphics.add("downIdle", downIdle);
      this.graphics.add("upIdle", upIdle);
      this.graphics.add("sideIdle", sideIdle);

      this.graphics.add("downWalk", downWalk);
      this.graphics.add("upWalk", upWalk);
      this.graphics.add("sideWalk", sideWalk);

      this.graphics.add("attackDown", attackDown);
      this.graphics.add("attackUp", attackUp);
      this.graphics.add("attackSide", attackSide);

      this.currentAnimation = "upIdle"; // Set initial animation state
      this.graphics.use(this.currentAnimation); // Use initial animation
    });

    // Collision event handler for the player
    this.on('precollision', (evt) => {
      if (evt.other instanceof Enemy && this.isAttacking) {
        evt.other.killAndReward(); // Call killAndReward method on enemy
        this.emit('enemyKilled'); // Emit event when enemy is killed
      }

      if (evt.other instanceof BossEnemy && this.isAttacking) {
        evt.other.kill(); // Destroy the boss enemy when attacked
        this.scene.engine.goToScene('end'); // Transition to the "end" scene
      }
    });
  }

  showDialog(message) {
    // Create a label for the dialog message
    const dialogLabel = new Label({
      text: message,
      pos: this.pos.add(new Vector(0, -20)), // Position just above the player
      fontFamily: 'Arial',
      fontSize: 4,
      color: 'white',
      textAlign: TextAlign.Center,
      anchor: Vector.Half
    });

    // Add the dialog label to the scene
    this.scene.add(dialogLabel);

    // Remove the dialog label after 3 seconds (adjust as needed)
    setTimeout(() => {
      dialogLabel.kill();
    }, 3000);
  }

  onPreUpdate(engine) {
    let xspeed = 0;
    let yspeed = 0;
  
    if (engine.input.keyboard.isHeld(Keys.D) || engine.input.keyboard.isHeld(Keys.Right)) {
      xspeed = 80;
      this.currentAnimation = this.isAttacking ? "attackSide" : "sideWalk";
      this.graphics.flipHorizontal = true;
    }
  
    if (engine.input.keyboard.isHeld(Keys.A) || engine.input.keyboard.isHeld(Keys.Left)) {
      xspeed = -80;
      this.currentAnimation = this.isAttacking ? "attackSide" : "sideWalk";
      this.graphics.flipHorizontal = false;
    }
  
    if (engine.input.keyboard.isHeld(Keys.W) || engine.input.keyboard.isHeld(Keys.Up)) {
      yspeed = -80;
      this.currentAnimation = this.isAttacking ? "attackUp" : "upWalk";
    }
  
    if (engine.input.keyboard.isHeld(Keys.S) || engine.input.keyboard.isHeld(Keys.Down)) {
      yspeed = 80;
      this.currentAnimation = this.isAttacking ? "attackDown" : "downWalk";
    }
  
    if (xspeed === 0 && yspeed === 0) {
      // Determine which idle animation to use when standing still
      if (this.isAttacking) {
        // Use attack animation when attacking and standing still
        if (this.currentAnimation === "downIdle") this.currentAnimation = "attackDown";
        else if (this.currentAnimation === "upIdle") this.currentAnimation = "attackUp";
        else if (this.currentAnimation === "sideIdle") this.currentAnimation = "attackSide";
      } else {
        // Use idle animations based on facing direction when not attacking
        if (this.vel.y > 0) this.currentAnimation = "downIdle"; // Down
        else if (this.vel.y < 0) this.currentAnimation = "upIdle"; // Up
        else if (this.vel.x !== 0) {
          // Side, flip based on horizontal movement
          this.currentAnimation = this.graphics.flipHorizontal ? "sideIdle" : "sideIdle";
        } else {
          // Default to downIdle if no animation set
          this.currentAnimation = "downIdle";
        }
      }
    }
  
    if (engine.input.keyboard.wasPressed(Keys.Space)) {
      // Handle attack logic
      if (!this.isAttacking) {
        this.isAttacking = true;
        this.graphics.use(this.currentAnimation); // Switch to attack animation
        setTimeout(() => {
          this.isAttacking = false;
          // Return to idle animation after attack animation finishes
          if (xspeed === 0 && yspeed === 0) {
            if (this.vel.y > 0) this.currentAnimation = "downIdle";
            else if (this.vel.y < 0) this.currentAnimation = "upIdle";
            else if (this.vel.x !== 0) this.currentAnimation = "sideIdle";
            else this.currentAnimation = "downIdle";
          }
          this.graphics.use(this.currentAnimation);
        }, 500); // Adjust duration as needed for your attack animation
      }
    }
  
    // Update graphics to use current animation
    this.graphics.use(this.currentAnimation);
    this.vel = new Vector(xspeed, yspeed);
  }  
}
