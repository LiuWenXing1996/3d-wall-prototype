import {
  BoxGeometry,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  type ColorRepresentation,
} from "three";
/**
 * PolyominoCube 配置类型
 */
export interface PolyominoCubeConfig {
  /** 立方体填充颜色，默认为白色 "#FFFFFF" */
  boxColor?: ColorRepresentation;
  /** 立方体边缘线条颜色，默认为黑色 "#000000" */
  lineColor?: ColorRepresentation;
}
/**
 * 多格骨牌单个立方体，一个带边缘高亮的立方体网格对象，大小为 1x1x1
 */
export default class PolyominoCube extends Object3D {
  public readonly config: Readonly<PolyominoCubeConfig>;

  /**
   * @param config - 配置参数
   */
  constructor(config?: PolyominoCubeConfig) {
    super();
    this.config = Object.freeze(config ?? {});
    const { boxColor = "#FFFFFF", lineColor = "#000000" } = this.config;
    const boxGeometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: boxColor });
    const mesh = new Mesh(boxGeometry, material);
    const lineSegments = new LineSegments(
      new EdgesGeometry(boxGeometry),
      new LineBasicMaterial({ color: lineColor }),
    );
    this.add(mesh);
    this.add(lineSegments);
  }
}
