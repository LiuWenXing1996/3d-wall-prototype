import { Object3D, Vector3 } from "three";
import PolyominoCube, { type PolyominoCubeConfig } from "./PolyominoCube";

/**
 * 已固定方块列表，负责管理和渲染所有已经固定到游戏板上的方块
 */
export default class FixedCubeList extends Object3D {
  /**
   * 存储已固定方块的映射表
   * key: "x,y,z" -> value: PolyominoCube
   */
  private cubeMap: Map<string, PolyominoCube> = new Map();
  constructor() {
    super();
  }

  /**
   * 生成唯一键
   */
  private getKey(x: number, y: number, z: number): string {
    return `${x},${y},${z}`;
  }

  /**
   * 添加一个固定方块
   * @param gameBoardPosition - 方块的棋盘位置
   * @param config - 方块配置项
   */
  addCube(gameBoardPosition: Vector3, config?: PolyominoCubeConfig): void {
    const { x, y, z } = gameBoardPosition;
    const key = this.getKey(x, y, z);

    // 如果位置已存在方块，先移除
    if (this.cubeMap.has(key)) {
      this.removeCube(x, y, z);
    }
    // 创建 PolyominoCube 并设置位置
    const cube = new PolyominoCube(config);
    cube.position.set(x, y, z);

    // 添加到映射表和场景
    this.cubeMap.set(key, cube);
    this.add(cube);
  }

  /**
   * 移除指定位置的方块
   * @param x X坐标
   * @param y Y坐标
   * @param z Z坐标
   */
  removeCube(x: number, y: number, z: number): void {
    const key = this.getKey(x, y, z);
    const cube = this.cubeMap.get(key);

    if (cube) {
      // 从场景中移除
      this.remove(cube);

      // 释放资源
      cube.traverse((child) => {
        if ((child as any).geometry) (child as any).geometry.dispose();
        if ((child as any).material) (child as any).material.dispose();
      });

      // 从映射表移除
      this.cubeMap.delete(key);
    }
  }

  /**
   * 检查某个位置是否被占用
   * @param x X坐标
   * @param y Y坐标
   * @param z Z坐标
   * @returns 是否被占用
   */
  isBlocked(x: number, y: number, z: number): boolean {
    const key = this.getKey(x, y, z);
    return this.cubeMap.has(key);
  }
}
