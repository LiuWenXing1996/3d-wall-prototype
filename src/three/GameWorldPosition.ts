import { Vector3 } from "three";

/**
 * 游戏标准世界位置，用于统一表示游戏世界中的三维坐标位置，方便碰撞检测和位移、旋转等操作
 * 输入的坐标值会被四舍五入到整数，坐标系原点为(0, 0, 0)
 */
export default class GameWorldPosition extends Vector3 {
  /**
   * @param x X轴坐标
   * @param y Y轴坐标
   * @param z Z轴坐标
   */
  constructor(x?: number, y?: number, z?: number) {
    const toInt = (val: number) => Math.round(val);
    const superX = toInt(Number(x) ?? 0);
    const superY = toInt(Number(y) ?? 0);
    const superZ = toInt(Number(z) ?? 0);
    super(superX, superY, superZ);
  }
}
