import { Object3D } from "three";
import { GameBoardPlaneGrid } from "./GameBoardPlane";

/**
 * 游戏棋盘的四面墙壁
 */
export default class GameBoardWall extends Object3D {
  wallL: GameBoardPlaneGrid;
  wallB: GameBoardPlaneGrid;
  wallR: GameBoardPlaneGrid;
  wallF: GameBoardPlaneGrid;
  /**
   * @param config - 游戏板配置参数
   * @param config.width - 游戏板宽度（X轴方向），默认为 0
   * @param config.depth - 游戏板深度（Z轴方向），默认为 0
   * @param config.height - 游戏板高度（Y轴方向），默认为 0
   */
  constructor(config?: { width: number; depth: number; height: number }) {
    super();
    const { width = 0, depth = 0, height = 0 } = config ?? {};

    // 左墙
    {
      this.wallL = new GameBoardPlaneGrid({
        width: depth,
        height: height,
        color: "#d1420a",
      });
      // 旋转调整
      this.wallL.rotation.y = Math.PI / 2;
      // 位置调整
      this.wallL.position.x = -0.5;
      this.wallL.position.z = depth - 1;
      this.add(this.wallL);
    }
    // 右墙
    {
      this.wallR = new GameBoardPlaneGrid({
        width: depth,
        height: height,
        color: "#d78f63",
      });
      // 旋转调整
      this.wallR.rotation.y = -Math.PI / 2;
      // 位置调整
      this.wallR.position.x = width - 0.5;
      this.wallR.position.z = 0;
      this.add(this.wallR);
    }

    // 前墙
    {
      this.wallF = new GameBoardPlaneGrid({
        width: width,
        height: height,
        color: "#a9d10a",
      });
      // 位置调整
      this.wallF.position.z = -0.5;
      this.add(this.wallF);
    }

    // 后墙
    {
      this.wallB = new GameBoardPlaneGrid({
        width: width,
        height: height,
        color: "#0ad135",
      });
      // 旋转调整
      this.wallB.rotation.y = Math.PI;
      // 位置调整
      this.wallB.position.x = width - 1;
      this.wallB.position.z = depth - 0.5;
      this.add(this.wallB);
    }
  }
}
