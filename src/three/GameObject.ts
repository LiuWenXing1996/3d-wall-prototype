import { Group, Scene } from "three";
import type Game from "./Game";

export default class GameObject {
  scene: Scene;
  group: Group;
  game: Game;
  constructor(game: Game) {
    this.scene = game.scene;
    this.game = game;
    this.group = new Group();
    game.scene.add(this.group);
  }
  destroy() {
    this.scene.remove(this.group);
  }
  hide() {
    this.group.visible = false;
  }
  show() {
    this.group.visible = true;
  }
}
