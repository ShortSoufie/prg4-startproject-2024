import { Engine, DisplayMode } from 'excalibur';
import { IntroScene } from './introGame.js';
import { TutorialScene } from './tutorialGame.js';
import { MainScene } from './mainGame.js';
import { EndScene } from './endGame.js';
import { ResourceLoader } from './resources.js';
import { Player } from './player.js';

export class Game extends Engine {
    constructor() {
        super({
            width: 1024,
            height: 1024,
            maxFps: 60,
            displayMode: DisplayMode.FitScreen,
            antialiasing: false,
        });

        const introScene = new IntroScene(this);
        this.add('intro', introScene);

        const tutorialScene = new TutorialScene(this);
        this.add('tutorial', tutorialScene);

        const mainScene = new MainScene(this); // Instantiate MainScene
        this.add('main', mainScene);

        // Create and set EndScene
        const endScene = new EndScene(this); // Instantiate EndScene
        this.add('end', endScene);

        // Load resources
        this.start(ResourceLoader).then(() => {
            // Set initial scene to IntroScene
            this.gotoMyScene('intro');
        });
    } 

    gotoMyScene(sceneName) {
        switch (sceneName) {
            case 'intro':
                this.goToScene(sceneName);
                break;
            case 'tutorial':
                this.goToScene(sceneName);
                break;
            case 'main':
                this.goToScene(sceneName);
                break;
            case 'end':
                this.goToScene(sceneName);
                break;
            // Add cases for other scenes as needed
            default:
                console.error('Invalid scene name');
        }
    }
}    

// Need to build an engine to start
const game = new Game();