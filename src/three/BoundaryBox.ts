import type Game from "./Game";
import GameObject from "./GameObject";

export class BoundaryBox extends GameObject {
  constructor(game: Game) {
    super(game);
  }
}
