import {
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  type ColorRepresentation,
} from "three";
import GameObject from "./GameObject";
import type Game from "./Game";

/**
 * 游戏地图，立体的3D地图，包括地板、墙
 */
export default class GameMap extends GameObject {
  floor: Group = new Group();
  wallL: Group = new Group();
  wallB: Group = new Group();
  wallR: Group = new Group();
  wallF: Group = new Group();
  constructor(
    game: Game,
    config: {
      width: number;
      depth: number;
      height: number;
    },
  ) {
    super(game);
    const { width, depth, height } = config;
    // 地板
    {
      this.floor = this.renderPlaneGrid(width, depth, "#FFFFFF");
      // 位置调整, 地板中心在 (0, 0, 0)
      this.floor.position.x = -width / 2 + 0.5;
      this.floor.position.y = -0.5;
      this.floor.position.z = depth / 2 - 0.5;
      // 旋转调整
      this.floor.rotation.x = -Math.PI / 2;
      // 添加到场景中
      this.group.add(this.floor);
    }
    // 左墙
    {
      this.wallL = this.renderPlaneGrid(depth, height, "#d1420a");
      // 位置调整
      this.wallL.position.x = -width / 2;
      this.wallL.position.z = depth / 2 - 0.5;
      // 旋转调整
      this.wallL.rotation.y = Math.PI / 2;
      // 添加到场景中
      this.group.add(this.wallL);
    }
    // 右墙
    {
      this.wallR = this.renderPlaneGrid(depth, height, "#d78f63");
      // 位置调整
      this.wallR.position.x = width / 2;
      this.wallR.position.z = -depth / 2 + 0.5;
      // 旋转调整
      this.wallR.rotation.y = -Math.PI / 2;
      // 添加到场景中
      this.group.add(this.wallR);
    }

    // 前墙
    {
      this.wallF = this.renderPlaneGrid(width, height, "#a9d10a");
      // 位置调整
      this.wallF.position.x = -width / 2 + 0.5;
      this.wallF.position.z = -depth / 2;
      // 添加到场景中
      this.group.add(this.wallF);
    }

    // 后墙
    {
      this.wallB = this.renderPlaneGrid(width, height, "#0ad135");
      // 位置调整
      this.wallB.position.x = width / 2 - 0.5;
      this.wallB.position.z = depth / 2;
      // 旋转调整
      this.wallB.rotation.y = Math.PI;
      // 添加到场景中
      this.group.add(this.wallB);
    }
  }
  renderPlane(color: ColorRepresentation) {
    const group = new Group();
    const geometry = new PlaneGeometry(0.9, 0.9);
    const material = new MeshBasicMaterial({
      color,
      side: DoubleSide,
    });
    const line = new Mesh(geometry, material);
    group.add(line);
    return group;
  }
  renderPlaneGrid(w: number, h: number, color: ColorRepresentation) {
    const group = new Group();
    for (let x = 0; x < w; x += 1) {
      for (let y = 0; y < h; y += 1) {
        const p = this.renderPlane(color);
        p.position.x = x;
        p.position.y = y;
        group.add(p);
      }
    }
    return group;
  }
  /**
   * 在x轴方向按规定角度间隔分步旋转
   * @param step 旋转角度步数，单步旋转角度为π/2度
   */
  stepRotateX(step: number) {
    this.group.rotateX((step * Math.PI) / 2);
  }
  /**
   * 在y轴方向按规定角度间隔分步旋转
   * @param step 旋转角度步数，单步旋转角度为π/2度
   */
  stepRotateY(step: number) {
    this.group.rotateY((step * Math.PI) / 2);
  }
  /**
   * 在z轴方向按规定角度间隔分步旋转
   * @param step 旋转角度步数，单步旋转角度为π/2度
   */
  stepRotateZ(step: number) {
    this.group.rotateZ((step * Math.PI) / 2);
  }
  getRotation() {
    return this.group.rotation.toArray();
  }
}
