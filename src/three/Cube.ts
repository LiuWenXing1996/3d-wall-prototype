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

// TODO:待删除，把 cubeGroup 全部替换为 Polyomino后就可以删除了
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
    // this.boxGeometry.translate(0.5, 0.5, 0.5);
    this.material = new MeshBasicMaterial({ color: color });
    this.mesh = new Mesh(this.boxGeometry, this.material);
    const lineSegments = new LineSegments(
      new EdgesGeometry(this.boxGeometry),
      new LineBasicMaterial({ color: "black" }),
    );
    // 顶点对齐到原点
    // this.mesh.position.set(0.5, 0.5, 0.5);
    // lineSegments.position.set(0.5, 0.5, 0.5);

    this.group.add(this.mesh);
    this.group.add(lineSegments);
    this.scene.add(this.group);
  }
}
