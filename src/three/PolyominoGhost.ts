import { Object3D, Vector3 } from "three";
import type Polyomino from "./Polyomino";
import PolyominoCube, { type PolyominoCubeConfig } from "./PolyominoCube";
import type { GameBoard } from "./GameBoard";

/**
 * 方块落点预览类
 * 负责计算和显示方块的落点位置
 */
export default class PolyominoGhost extends Object3D {
  private ghostCubes: PolyominoCube[] = [];

  constructor() {
    super();
  }

  /**
   * 更新落点预览
   * @param polyomino 当前方块

   */
  update(gameBoard: GameBoard, polyomino: Polyomino): void {
    // 清除旧的预览
    this.clearGhost();

    // 计算落点距离
    const dropDistance = this.calculateDropDistance(gameBoard, polyomino);

    // 如果落点就在当前位置，不需要显示预览
    if (dropDistance === 0) return;

    // 在落点位置创建预览方块
    polyomino.cubeList.forEach((cube) => {
      const worldPosition = cube.getWorldPosition(new Vector3());
      const ghostWorldPosition = worldPosition
        .clone()
        .add(new Vector3(0, -dropDistance, 0));
      const ghostBoardPosition =
        gameBoard.worldPositionToGameBoardPosition(ghostWorldPosition);

      // 创建半透明预览方块
      const ghostConfig: PolyominoCubeConfig = {
        ...cube.config,
        opacity: 0.3,
      };
      const ghostCube = new PolyominoCube(ghostConfig);
      ghostCube.position.copy(ghostBoardPosition);

      this.add(ghostCube);
      this.ghostCubes.push(ghostCube);
    });
  }

  /**
   * 计算方块的落点距离
   */
  private calculateDropDistance(
    gameBoard: GameBoard,
    polyomino: Polyomino,
  ): number {
    let dropDistance = 0;

    while (dropDistance < gameBoard.worldSize.height) {
      const predictedBlockPositions = polyomino.cubeList.map((block) => {
        const worldPos = block.getWorldPosition(new Vector3());
        return worldPos.clone().add(new Vector3(0, -(dropDistance + 1), 0));
      });

      if (
        predictedBlockPositions.some((pos) => gameBoard.checkCollision(pos))
      ) {
        break;
      }

      dropDistance++;
    }

    return dropDistance;
  }

  /**
   * 清除预览
   */
  clearGhost(): void {
    this.ghostCubes.forEach((cube) => {
      // 释放资源
      cube.traverse((child) => {
        if ((child as any).geometry) (child as any).geometry.dispose();
        if ((child as any).material) (child as any).material.dispose();
      });
      this.remove(cube);
    });
    this.ghostCubes = [];
  }

  /**
   * 销毁
   */
  dispose(): void {
    this.clear();
  }
}
