import {
  DoubleSide,
  Group,
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
    // this.floor.rotation.x = Math.PI / 2;
    this.group.add(this.floor);

    // 左墙
    // this.wallL = this.renderPlaneGrid(width, height);
    // this.wallL.rotation.z = Math.PI / 2;
    // this.wallL.rotation.x = Math.PI / 2;
    // this.wallL.position.y += width / 2;
    // this.wallL.position.x -= 0.5;
    // this.group.add(this.wallL);
    // 右墙
    // this.wallR = this.renderPlaneGrid(width, height);
    // this.wallR.rotation.z = Math.PI / 2;
    // this.wallR.rotation.x = Math.PI / 2;
    // this.wallR.position.y += width / 2;
    // this.wallR.position.x += width - 0.5;
    // this.group.add(this.wallR);
    // 前墙
    // this.wallF = this.renderPlaneGrid(width, height);
    // this.wallF.rotation.x = Math.PI / 2;
    // this.wallF.position.y += width / 2;
    // this.wallF.position.z += width - 0.5;
    // this.group.add(this.wallF);
    // 后墙
    // this.wallB = this.renderPlaneGrid(width, height);
    // this.wallB.rotation.x = Math.PI / 2;
    // this.wallB.position.y += width / 2;
    // this.wallB.position.z -= 0.5;
    // this.group.add(this.wallB);
  }

  renderPlane() {
    const scale = 0.95;
    const geometry = new PlaneGeometry(1, 1);
    const material = new MeshBasicMaterial({
      color: "white",
      side: DoubleSide,
    });
    const line = new Mesh(geometry, material);
    // line.material.uniforms.u_color.value = new THREE.Color(CFG.enclosure.color);
    // line.material.uniforms.u_factor.value = CFG.enclosure.noiseFactor;
    // line.material.side = THREE.DoubleSide;
    // line.material.depthTest = false;
    line.scale.set(scale, scale, scale);
    // line.rotation.x = Math.PI / 2;
    return line;
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
