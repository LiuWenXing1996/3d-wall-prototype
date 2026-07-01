import {
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
export default class GameBoardPlane extends Object3D {
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
      // side: DoubleSide,
      side,
    });
    const line = new Mesh(geometry, material);
    this.add(line);
  }
}
/**
 * 创建一个由多个 GameBoardPlane 组成的二维网格
 */
export class GameBoardPlaneGrid extends Object3D {
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
