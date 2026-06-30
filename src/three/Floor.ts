import {
  DoubleSide,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  type Scene,
} from "three";

/**
 * 地板与外墙
 */
export default class Floor {
  scene: Scene;
  floor: Group;
  wallL: Group;
  wallB: Group;
  wallR: Group;
  wallF: Group;
  group: Group<import("three").Object3DEventMap>;
  constructor(scene: Scene, width: number, depth: number, height: number) {
    this.scene = scene;
    this.group = new Group();
    scene.add(this.group);

    // 地板
    this.floor = this.renderPlaneGrid(width, depth);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = -0.5;
    this.floor.position.z = depth - 1;
    this.group.add(this.floor);

    // 左墙
    this.wallL = this.renderPlaneGrid(depth, height);
    this.wallL.rotation.y = Math.PI / 2;
    this.wallL.position.z = depth - 1;
    this.wallL.position.x = -0.5;
    this.group.add(this.wallL);
    // 右墙
    this.wallR = this.renderPlaneGrid(depth, height);
    this.wallR.rotation.y = -Math.PI / 2;
    this.wallR.position.x = width - 0.5;
    this.wallR.position.z = 0;
    this.group.add(this.wallR);
    // 前墙
    this.wallF = this.renderPlaneGrid(width, height);
    this.wallF.position.z = -0.5;
    this.group.add(this.wallF);
    // 后墙
    this.wallB = this.renderPlaneGrid(width, height);
    this.wallB.rotation.y = Math.PI;
    this.wallB.position.z = depth - 0.5;
    this.wallB.position.x = width - 1;
    this.group.add(this.wallB);
  }

  renderPlane() {
    const group = new Group();
    const geometry = new PlaneGeometry(0.9, 0.9);
    const material = new MeshBasicMaterial({
      color: "white",
      // side: DoubleSide,
    });
    const lineSegments = new LineSegments(
      new EdgesGeometry(geometry),
      new LineBasicMaterial({ color: "red" }),
    );

    const line = new Mesh(geometry, material);
    // 顶点对齐到原点
    // line.position.set(0.5, 0.5, 0);
    // lineSegments.position.set(0.5, 0.5, 0);

    group.add(line);
    // group.add(lineSegments);
    // line.material.uniforms.u_color.value = new THREE.Color(CFG.enclosure.color);
    // line.material.uniforms.u_factor.value = CFG.enclosure.noiseFactor;
    // line.material.side = THREE.DoubleSide;
    // line.material.depthTest = false;
    // line.rotation.x = Math.PI / 2;
    return group;
  }
  renderPlaneGrid(w: number, h: number) {
    const group = new Group();
    for (let x = 0; x < w; x += 1) {
      for (let y = 0; y < h; y += 1) {
        const p = this.renderPlane();
        p.position.x = x;
        p.position.y = y;
        group.add(p);
      }
    }
    return group;
  }
}
