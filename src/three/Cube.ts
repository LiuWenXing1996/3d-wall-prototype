import {
  BoxGeometry,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  Scene,
  type ColorRepresentation,
} from "three";

export default class Cube {
  group: Group;
  boxGeometry: BoxGeometry;
  material: MeshBasicMaterial;
  mesh: Mesh;
  scene: Scene;
  constructor(scene: Scene, color: ColorRepresentation) {
    this.scene = scene;
    this.group = new Group();
    this.boxGeometry = new BoxGeometry(1, 1, 1);
    this.material = new MeshBasicMaterial({ color: color });
    this.mesh = new Mesh(this.boxGeometry, this.material);
    const lineSegments = new LineSegments(
      new EdgesGeometry(this.boxGeometry),
      new LineBasicMaterial({ color: "black" }),
    );
    this.group.add(this.mesh);
    this.group.add(lineSegments);
    this.scene.add(this.group);
  }
}

export const CubeTypes = {
  OrangeRicky: {
    blocks: [
      { x: 1, y: 0, z: 0 },
      { x: 0, y: -1, z: 0 },
      { x: 1, y: -1, z: 0 },
      { x: -1, y: -1, z: 0 },
    ],
    color: "#ff9562",
  },
};
