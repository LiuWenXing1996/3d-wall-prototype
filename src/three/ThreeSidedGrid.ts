import { GridHelper, Group, Scene } from "three";

export default class ThreeSidedGrid {
  group: Group;
  scene: Scene;
  constructor(scene: Scene) {
    this.group = new Group();
    this.scene = scene;
    const size = 6;
    const divisions = 6;
    const color = "gray";
    const bottomGrid = new GridHelper(size, divisions, "gray", "gray");

    bottomGrid.position.set(size / 2, 0, size / 2);
    this.group.add(bottomGrid);
    const leftGrid = new GridHelper(6, 12, "red", "red");
    leftGrid.position.set(size / 2, 2, size / 2);
    // leftGrid.rotation.x = Math.PI / 2;
    this.group.add(leftGrid);
    // const rightGrid = new GridHelper(size, divisions, color);
    // rightGrid.position.set(size, size / 2, size / 2);
    // rightGrid.rotation.x = Math.PI / 2;
    // this.group.add(rightGrid);
    // const backGrid = new GridHelper(size, divisions, color);
    // backGrid.position.set(size / 2, 0, -size / 2);
    // this.group.add(backGrid);
    this.scene.add(this.group);
  }
}
