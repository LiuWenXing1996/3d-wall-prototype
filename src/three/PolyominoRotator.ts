import { Vector3, Quaternion, Euler, Group, Matrix4 } from "three";
import type { GameBoard } from "./GameBoard";
import type Polyomino from "./Polyomino";
import PolyominoCube from "./PolyominoCube";

export default class PolyominoRotator {
  gameBoard: GameBoard;
  previewCubeList: Group;
  constructor(gameBoard: GameBoard) {
    this.gameBoard = gameBoard;
    this.previewCubeList = new Group();
    gameBoard.add(this.previewCubeList);
  }

  /**
   * 在指定轴方向上旋转
   * @param polyomino 要旋转的连块
   * @param angle 旋转角度
   * @param angle.x 旋转角度
   * @param angle.y 旋转角度
   * @param angle.z 旋转角度
   */
  rotate(polyomino: Polyomino, angle: { x?: number; y?: number; z?: number }) {
    const newQuat = this.calculateRotationQuaternion(polyomino, angle);
    const predictedRotateCubeList = this.predictedRotateCubeList(
      polyomino,
      angle,
    );
    if (
      predictedRotateCubeList.some((item) => {
        const { position } = item;
        return this.gameBoard.checkCollision(position);
      })
    ) {
      // 发生碰撞，无法旋转
      return;
    }
    polyomino.quaternion.copy(newQuat);
  }
  /**
   * 将旋转步数转换为旋转角度
   * @param step 旋转步数，单步旋转角度步数为π/2度
   * @returns 旋转角度
   */
  stepToAngle(step?: number) {
    return ((step || 0) * Math.PI) / 2;
  }
  /**
   * 在指定轴方向上按规定角度间隔分步旋转
   * @param polyomino 要旋转的连块
   * @param step 旋转步数，单步旋转角度为π/2度
   */
  stepRotate(
    polyomino: Polyomino,
    step: { x?: number; y?: number; z?: number },
  ) {
    const { x, y, z } = step;
    const angle = {
      x: this.stepToAngle(x),
      y: this.stepToAngle(y),
      z: this.stepToAngle(z),
    };
    this.rotate(polyomino, angle);
  }
  /**
   * 预览旋转后的方块位置
   * @param polyomino 要旋转的连块
   * @param angle 旋转角度
   * @param angle.x 旋转角度
   * @param angle.y 旋转角度
   * @param angle.z 旋转角度
   */
  rotatePreview(
    polyomino: Polyomino,
    angle: { x?: number; y?: number; z?: number },
  ) {
    this.previewCubeList.clear();
    const list = this.predictedRotateCubeList(polyomino, angle);
    list.forEach((item) => {
      const { position, config } = item;
      const gameBoardPosition =
        this.gameBoard.worldPositionToGameBoardPosition(position);
      const cube = new PolyominoCube({
        ...config,
        opacity: 0.5,
        lineColor: "#FFFFFF",
      });
      // const cube = new PolyominoCube({ boxColor: block.color });
      cube.position.copy(gameBoardPosition);
      this.previewCubeList.add(cube);
    });
  }
  /**
   * 预览按步旋转后的方块位置
   * @param polyomino 要旋转的连块
   * @param step 旋转步数，单步旋转角度为π/2度
   * @param step.x 旋转步数
   * @param step.y 旋转步数
   * @param step.z 旋转步数
   */
  stepRotatePreview(
    polyomino: Polyomino,
    step: { x?: number; y?: number; z?: number },
  ) {
    const { x, y, z } = step;
    const angle = {
      x: this.stepToAngle(x),
      y: this.stepToAngle(y),
      z: this.stepToAngle(z),
    };
    this.rotatePreview(polyomino, angle);
  }
  /**
   * 计算Polyomino需要旋转的四元数
   * @param polyomino 要旋转的连块
   * @param angle 旋转角度
   * @param angle.x 旋转角度
   * @param angle.y 旋转角度
   * @param angle.z 旋转角度
   * @returns 四元数
   */
  calculateRotationQuaternion(
    polyomino: Polyomino,
    angle: { x?: number; y?: number; z?: number },
  ) {
    const { x, y, z } = angle;
    // 1. 获取 gameBoard 当前的世界旋转（四元数）
    this.gameBoard.updateMatrixWorld(true);
    const tempPos = new Vector3();
    const gameBoardQuat = new Quaternion();
    const tempScale = new Vector3();
    this.gameBoard.matrixWorld.decompose(tempPos, gameBoardQuat, tempScale);

    // 2. 计算 gameBoard 旋转的逆（用于抵消旋转）
    const invGameBoardQuat = gameBoardQuat.clone().invert();

    // 3. 保存 CurrentPolyomino 当前的旋转
    const currentQuat = polyomino.quaternion.clone();

    // 4. 抵消 gameBoard 旋转影响 → 应用新旋转 → 恢复 gameBoard 旋转影响
    // 最终旋转 = gameBoard旋转 × 新旋转 × gameBoard逆旋转 × 当前旋转
    const newQuat = new Quaternion()
      .multiply(gameBoardQuat) // 恢复 gameBoard 旋转
      .multiply(
        new Quaternion().setFromEuler(new Euler(x || 0, y || 0, z || 0, "XYZ")),
      ) // 应用新旋转
      .multiply(invGameBoardQuat) // 抵消 gameBoard 旋转
      .multiply(currentQuat); // 叠加当前旋转

    return newQuat;
  }

  /**
   * 预测旋转后的方块位置
   * @param polyomino 要旋转的连块
   * @param angle 旋转角度
   * @param angle.x 旋转角度
   * @param angle.y 旋转角度
   * @param angle.z 旋转角度
   */
  predictedRotateCubeList(
    polyomino: Polyomino,
    angle: { x?: number; y?: number; z?: number },
  ) {
    // 1. 获取 gameBoard（上层父对象）的世界矩阵
    this.gameBoard.updateMatrixWorld(true);
    const gameBoardWorldMatrix = this.gameBoard.matrixWorld.clone();

    // 2. 计算新旋转四元数
    const newQuat = this.calculateRotationQuaternion(polyomino, angle);

    // 3. 构建 polyomino（当前父对象）的新本地矩阵
    const polyNewLocalMatrix = new Matrix4();
    polyNewLocalMatrix.compose(
      polyomino.position.clone(),
      newQuat,
      polyomino.scale.clone(),
    );
    // 4. 计算 polyomino 的新世界矩阵
    const polyNewWorldMatrix = gameBoardWorldMatrix
      .clone()
      .multiply(polyNewLocalMatrix);

    // 5. 预测每个 cube（子对象）的新世界坐标
    return polyomino.cubeList.map((cube) => {
      const cubeLocalPos = cube.position.clone();
      const predictedWorldPos = cubeLocalPos.applyMatrix4(polyNewWorldMatrix);

      return {
        position: predictedWorldPos,
        config: cube.config,
      };
    });
  }
}
