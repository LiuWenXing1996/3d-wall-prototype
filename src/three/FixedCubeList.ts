import { Object3D } from "three";
import PolyominoCube, { type PolyominoCubeConfig } from "./PolyominoCube";
import type GameWorldPosition from "./GameWorldPosition";

/**
 * 已固定方块列表，负责管理和渲染所有已经固定到游戏板上的方块
 */
export default class FixedCubeList extends Object3D {
  /**
   * 存储已固定方块的映射表
   * key: "x,y,z" -> value: PolyominoCube
   */
  private cubeMap: Map<string, PolyominoCube> = new Map();

  /**
   * 游戏世界尺寸
   */
  private worldSize: { width: number; depth: number; height: number };

  constructor(worldSize: { width: number; depth: number; height: number }) {
    super();
    this.worldSize = worldSize;
  }

  /**
   * 生成唯一键
   */
  private getKey(x: number, y: number, z: number): string {
    // FIXME: 当前场景旋转后，坐标会改变，会导致键值对不一致
    // 如果都用本地坐标呢？
    // 那就是说使用 GameWorld.worldToLocal 将所有的worldPosition=>GameWorldPosition
    // 这样所有的坐标都统一了。
    return `${x},${y},${z}`;
  }

  /**
   * 添加一个固定方块
   * @param x X坐标
   * @param y Y坐标
   * @param z Z坐标
   * @param color 方块颜色
   */
  addCube(position: GameWorldPosition, config?: PolyominoCubeConfig): void {
    const { x, y, z } = position;

    // 边界检查
    if (!this.isInBounds(x, y, z)) return;

    const key = this.getKey(x, y, z);

    // 如果位置已存在方块，先移除
    if (this.cubeMap.has(key)) {
      this.removeBlock(x, y, z);
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
  removeBlock(x: number, y: number, z: number): void {
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

  /**
   * 获取指定位置的方块
   * @param x X坐标
   * @param y Y坐标
   * @param z Z坐标
   * @returns PolyominoCube 或 undefined
   */
  getCube(x: number, y: number, z: number): PolyominoCube | undefined {
    const key = this.getKey(x, y, z);
    return this.cubeMap.get(key);
  }

  /**
   * 检查坐标是否在边界内
   * @param x X坐标
   * @param y Y坐标
   * @param z Z坐标
   * @returns 是否在边界内
   */
  private isInBounds(x: number, y: number, z: number): boolean {
    return (
      x >= 0 &&
      x < this.worldSize.width &&
      y >= 0 &&
      y < this.worldSize.height &&
      z >= 0 &&
      z < this.worldSize.depth
    );
  }

  /**
   * 获取所有已固定方块
   * @returns PolyominoCube 数组
   */
  getAllCubes(): PolyominoCube[] {
    return Array.from(this.cubeMap.values());
  }

  /**
   * 获取所有已固定方块的位置信息
   * @returns 位置和颜色数组
   */
  getAllBlockPositions(): Array<{
    x: number;
    y: number;
    z: number;
    color: string;
  }> {
    const result: Array<{ x: number; y: number; z: number; color: string }> =
      [];

    this.cubeMap.forEach((cube, key) => {
      const [x, y, z] = key.split(",").map(Number);
      // 从材质获取颜色
      const color =
        (cube.mesh?.material as any)?.color?.getHexString() || "#FFFFFF";
      result.push({ x, y, z, color: `#${color}` });
    });

    return result;
  }

  /**
   * 检测并清除完整的层
   * @returns 清除的层数
   */
  clearFullLayers(): number {
    let clearedLayers = 0;

    // 遍历所有Y层（从下往上）
    for (let y = 0; y < this.worldSize.height; y++) {
      if (this.isLayerFull(y)) {
        this.clearLayer(y);
        clearedLayers++;

        // 将上层方块下移
        this.shiftLayersDown(y + 1);
        y--; // 重新检查当前层
      }
    }

    return clearedLayers;
  }

  /**
   * 检查某一层是否已满
   * @param y Y层坐标
   * @returns 是否已满
   */
  private isLayerFull(y: number): boolean {
    for (let x = 0; x < this.worldSize.width; x++) {
      for (let z = 0; z < this.worldSize.depth; z++) {
        if (!this.isBlocked(x, y, z)) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * 清除指定层
   * @param y Y层坐标
   */
  private clearLayer(y: number): void {
    for (let x = 0; x < this.worldSize.width; x++) {
      for (let z = 0; z < this.worldSize.depth; z++) {
        this.removeBlock(x, y, z);
      }
    }
  }

  /**
   * 将指定层以上的所有方块下移一层
   * @param startY 起始层
   */
  private shiftLayersDown(startY: number): void {
    // 从上往下遍历，避免覆盖
    for (let y = this.worldSize.height - 1; y >= startY; y--) {
      for (let x = 0; x < this.worldSize.width; x++) {
        for (let z = 0; z < this.worldSize.depth; z++) {
          const cube = this.getCube(x, y, z);
          if (cube) {
            // 记录颜色
            const color =
              (cube.mesh?.material as any)?.color?.getHexString() || "#FFFFFF";

            // 移除原位置方块
            this.removeBlock(x, y, z);

            // 在新位置添加方块
            this.add(x, y - 1, z, `#${color}`);
          }
        }
      }
    }
  }

  /**
   * 获取已固定方块的数量
   * @returns 方块数量
   */
  getBlockCount(): number {
    return this.cubeMap.size;
  }

  /**
   * 清空所有已固定方块
   */
  clearAll(): void {
    // 移除所有子对象并释放资源
    this.traverse((child) => {
      if (child instanceof PolyominoCube) {
        child.traverse((grandchild) => {
          if ((grandchild as any).geometry)
            (grandchild as any).geometry.dispose();
          if ((grandchild as any).material)
            (grandchild as any).material.dispose();
        });
      }
    });

    // 清空映射表和子对象
    this.cubeMap.clear();
    this.remove(...this.children);
  }

  /**
   * 获取最高的已固定方块Y坐标
   * @returns 最高Y坐标，没有方块返回-1
   */
  getHighestBlockY(): number {
    let highestY = -1;

    this.cubeMap.forEach((_, key) => {
      const [, y] = key.split(",").map(Number);
      if (y > highestY) {
        highestY = y;
      }
    });

    return highestY;
  }
}
