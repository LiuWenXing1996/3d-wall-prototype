import {
  BoxGeometry,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  type ColorRepresentation,
} from "three";
import GameObject from "./GameObject";
import type Game from "./Game";

export default class Box extends GameObject {
  boxGeometry: BoxGeometry;
  material: MeshBasicMaterial;
  mesh: Mesh;
  constructor(
    game: Game,
    config: {
      width: number;
      height: number;
      depth: number;
      color: ColorRepresentation;
      lineSegments: {
        color: ColorRepresentation;
      };
    },
  ) {
    super(game);
    this.boxGeometry = new BoxGeometry(
      config.width,
      config.height,
      config.depth,
    );
    this.material = new MeshBasicMaterial({ color: config.color });
    this.mesh = new Mesh(this.boxGeometry, this.material);
    const lineSegments = new LineSegments(
      new EdgesGeometry(this.boxGeometry),
      new LineBasicMaterial({ color: config.lineSegments.color }),
    );
    // // 坐标中心对齐到原点
    // this.mesh.position.set(
    //   config.width / 2,
    //   config.height / 2,
    //   config.depth / 2,
    // );
    // lineSegments.position.set(
    //   config.width / 2,
    //   config.height / 2,
    //   config.depth / 2,
    // );

    this.group.add(this.mesh);
    this.group.add(lineSegments);
  }
}
