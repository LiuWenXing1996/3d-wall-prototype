import {
  DoubleSide,
  FrontSide,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
  type ColorRepresentation,
  type Side,
} from "three";
/**
 * 用于渲染游戏棋盘的单个平面块
 */
class GameBoardPlane extends Object3D {
  /**
   * @param config 配置项
   * @param config.side 定义将渲染面的哪一侧 - 正面、背面或双面，默认正面
   * @param config.color 颜色, 默认白色("#FFFFFF")
   */
  constructor(config?: { side?: Side; color?: ColorRepresentation }) {
    super();
    const { side = FrontSide, color = "#FFFFFF" } = config ?? {};
    const geometry = new PlaneGeometry(0.9, 0.9);
    const material = new MeshBasicMaterial({
      color,
      side: DoubleSide,
    });
    const line = new Mesh(geometry, material);
    this.add(line);
  }
}
/**
 * 创建一个由多个 GameBoardPlane 组成的二维网格
 */
class GameBoardPlaneGrid extends Object3D {
  /**
   * @param config - 网格配置参数
   * @param config.width - 网格宽度（列数），默认为 0
   * @param config.height - 网格高度（行数），默认为 0
   * @param config.color - 平面颜色
   */
  constructor(config?: {
    width?: number;
    height?: number;
    color?: ColorRepresentation;
  }) {
    super();
    const { width = 0, height = 0, color } = config ?? {};
    for (let x = 0; x < width; x += 1) {
      for (let y = 0; y < height; y += 1) {
        const plane = new GameBoardPlane({ color });
        plane.position.x = x;
        plane.position.y = y;
        this.add(plane);
      }
    }
  }
}
/**
 * 立体游戏棋盘，一个由地板和四面墙壁组成的三维游戏空间
 */
export default class GameBoard extends Object3D {
  floor: GameBoardPlaneGrid;
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
