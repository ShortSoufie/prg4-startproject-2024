import { ImageSource, Loader } from "excalibur";
import { TiledResource } from "@excaliburjs/plugin-tiled";

const Resources = {
  Player: new ImageSource("images/PlayerSpritesheet.png"),
  npcBoy: new ImageSource("images/npcBoy.png"),
  npcGirl: new ImageSource("images/npcGirl.png"),
  enemySlime: new ImageSource("images/Slime.png"),
  enemyKingSlime: new ImageSource("images/KingSlime.png"),
  tutorialScreen: new ImageSource("images/MenuExplain.png"),
  menuScreen: new ImageSource("images/MenuScreen.png"),
  endScreen: new ImageSource("images/EndScreen.png"),
  World1Forest: new TiledResource("images/TilemapTiled.tmx"),
};

const ResourceLoader = new Loader([
    Resources.Player,
    Resources.npcBoy,
    Resources.npcGirl,
    Resources.enemySlime,
    Resources.enemyKingSlime,
    Resources.tutorialScreen,
    Resources.menuScreen,
    Resources.World1Forest,
    Resources.endScreen,
]);

export { Resources, ResourceLoader };
