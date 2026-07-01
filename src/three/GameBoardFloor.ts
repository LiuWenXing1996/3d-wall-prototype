import { Object3D } from "three";
import { GameBoardPlaneGrid } from "./GameBoardPlane";

/**
 * 游戏棋盘的地板
 */
export default class GameBoardFloor extends Object3D {
  floor: GameBoardPlaneGrid;
  /**
   * @param config - 游戏板配置参数
   * @param config.width - 游戏板宽度（X轴方向），默认为 0
   * @param config.depth - 游戏板深度（Z轴方向），默认为 0
   * @param config.height - 游戏板高度（Y轴方向），默认为 0
   */
  constructor(config?: { width: number; depth: number; height: number }) {
    super();
    const { width = 0, depth = 0 } = config ?? {};

    // 地板
    {
      this.floor = new GameBoardPlaneGrid({
        width,
        height: depth,
        color: "#FFFFFF",
      });
      // 旋转调整
      this.floor.rotation.x = -Math.PI / 2;
      // 位置调整
      this.floor.position.y = -0.5;
      this.floor.position.z = depth - 1;
      this.add(this.floor);
    }
  }
}
