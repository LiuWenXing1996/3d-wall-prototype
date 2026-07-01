import { Group, Matrix4, Object3D, Vector3 } from "three";
import GameBoard from "./GameBoard";
import Polyomino from "./Polyomino";
import type { Nullable } from "../types";
import { cloneDeep } from "es-toolkit";
import FixedCubeList from "./FixedCubeList";

export class GameWorld extends Object3D {
  worldSize: { width: number; depth: number; height: number } = {
    width: 10,
    depth: 10,
    height: 20,
  };
  currentPolyomino: Nullable<Polyomino> = null;
  private lastDropTime: number = 0; // 上次下落时间（毫秒）
  private dropInterval: number = 1000; // 下落间隔（毫秒），默认1秒下落一格
  fixedCubeList: FixedCubeList;
  // 包裹组，用于旋转世界
  //   private wrapperGroup: Group;

  constructor() {
    super();
    const gameBoard = new GameBoard({
      width: this.worldSize.width,
      depth: this.worldSize.depth,
      height: this.worldSize.height,
    });
    this.add(gameBoard);
    this.fixedCubeList = new FixedCubeList(this.worldSize);
    this.add(this.fixedCubeList);
  }

  /**
   * 更新游戏世界状态
   * @param time 当前时间（毫秒）
   */
  update(time: number) {
    if (!this.currentPolyomino) return;

    // 检查是否需要下落
    if (time - this.lastDropTime >= this.dropInterval) {
        this.tryDrop(); // 尝试下落
      this.lastDropTime = time;
    }
  }

  /**
   * 尝试让当前方块下落一格
   */
  private tryDrop() {
    if (!this.currentPolyomino) return;

    // 检查是否可以下落（检测碰撞）
    const predictedBlockPositions = this.currentPolyomino.cubeList.map(
      (block) => {
        const worldPos = block.getGameWorldPosition();
        return {
          x: worldPos.x + 0,
          y: worldPos.y + -1,
          z: worldPos.z + 0,
        };
      },
    );
    if (
      predictedBlockPositions.some((position) =>
        this.checkCollision(position.x, position.y, position.z),
      )
    ) {
      // 发生碰撞，无法下落
      this.lockPolyomino();
      this.spawnPolyomino();
    } else {
      this.currentPolyomino.position.y = this.currentPolyomino.position.y - 1;
    }
  }
  checkCollision(x: number, y: number, z: number): boolean {
    // 边界检测
    if (x < 0 || x >= this.worldSize.width) return true;
    if (y < 0) return true; // Y轴向下无限（高度方向）
    if (z < 0 || z >= this.worldSize.depth) return true;

    // 与已固定方块的碰撞检测
    if (this.fixedCubeList.isBlocked(x, y, z)) return true;
    return false;
  }
  /**
   * 固定当前方块到游戏板
   */
  private lockPolyomino(): void {
    if (!this.currentPolyomino) return;
    const currentPolyominoPosition = this.currentPolyomino.position.clone();
    const cubeList = this.currentPolyomino.cubeList.map((cube) => {
      return {
        config: cloneDeep(cube.config),
        position: cube.position.clone().add(currentPolyominoPosition),
      };
    });
    cubeList.forEach((cube) => {
      this.fixedCubeList.addCube(
        cube.position.x,
        cube.position.y,
        cube.position.z,
        cube.config,
      );
    });

    // TODO: 检测并清除完整的层（俄罗斯方块逻辑）
    // this.clearFullLayers();
  }

  /**
   * 生成新方块
   */
  spawnPolyomino() {
    // 移除旧的方块
    if (this.currentPolyomino) {
      this.remove(this.currentPolyomino);
    }
    // 生成新方块
    this.currentPolyomino = new Polyomino();
    this.add(this.currentPolyomino);
    // 设置初始位置（地图中心顶部）
    this.currentPolyomino.position.set(
      Math.floor(this.worldSize.width / 2) - 1,
      this.worldSize.height - 1,
      Math.floor(this.worldSize.depth / 2) - 1,
    );
  }
  /**
   * 绕中心旋转游戏世界
   * @param step 旋转角度步数，单步旋转角度为π/2度
   */
  stepRotateOnCenter(step: number) {
    const point1 = new Vector3(
      this.worldSize.width / 2 - 0.5,
      0,
      this.worldSize.depth / 2 - 0.5,
    );
    const point2 = new Vector3(
      this.worldSize.width / 2 - 0.5,
      5,
      this.worldSize.depth / 2 - 0.5,
    );
    const direction = point2.clone().sub(point1).normalize(); //
    const rotationMatrix = new Matrix4().makeRotationAxis(
      direction,
      (step * Math.PI) / 2,
    );
    const pivotMatrix = new Matrix4()
      .setPosition(point1) // 最后：平移回原位置
      .multiply(rotationMatrix) // 中间：旋转
      .multiply(new Matrix4().setPosition(point1.clone().negate())); // 最先：平移到原点

    this.applyMatrix4(pivotMatrix);
  }
  /**
   * 在指定轴方向上移动
   * @param x 移动步数，正数为正向移动，负数为负向移动
   * @param y 移动步数，正数为正向移动，负数为负向移动
   * @param z 移动步数，正数为正向移动，负数为负向移动
   */
  stepMoveCurrentPolyomino(x: number, y: number, z: number) {
    if (!this.currentPolyomino) return false;
    const oldLocalPosition = this.currentPolyomino.position.clone();
    console.log("currentPolyomino旧本地位置:", oldLocalPosition.toArray());
    const oldWorldPosition = this.currentPolyomino
      .getGameWorldPosition()
      .clone();
    console.log("currentPolyomino旧世界位置:", oldWorldPosition.toArray());
    const newPosition = new Vector3(
      oldWorldPosition.x + (x || 0),
      oldWorldPosition.y + (y || 0),
      oldWorldPosition.z + (z || 0),
    );
    // 世界位置转本地位置
    const newLocalPosition = this.worldToLocal(newPosition.clone());
    console.log("currentPolyomino新本地位置:", newLocalPosition.toArray());

    const predictedBlockPositions = this.currentPolyomino.cubeList.map(
      (block) => {
        const worldPos = block.getGameWorldPosition();
        console.log("cube旧世界位置:", worldPos.toArray());
        return {
          x: worldPos.x + x,
          y: worldPos.y + y,
          z: worldPos.z + z,
        };
      },
    );
    console.log(
      "cube预测位置:",
      predictedBlockPositions.map((position) => position),
    );
    if (
      predictedBlockPositions.some((position) =>
        this.checkCollision(position.x, position.y, position.z),
      )
    ) {
      // 发生碰撞，无法移动
      return;
    }
    // 移动
    this.currentPolyomino.position.copy(newLocalPosition);
  }
  /**
   * 在x轴方向上移动
   * @param step 移动步数，正数为正向移动，负数为负向移动
   */
  stepMoveCurrentPolyominoX(step: number) {
    this.stepMoveCurrentPolyomino(step, 0, 0);
  }
  /**
   * 在y轴方向上移动
   * @param step 移动步数，正数为正向移动，负数为负向移动
   */
  stepMoveCurrentPolyominoY(step: number) {
    this.stepMoveCurrentPolyomino(0, step, 0);
  }
  /**
   * 在z轴方向上移动
   * @param step 移动步数，正数为正向移动，负数为负向移动
   */
  stepMoveCurrentPolyominoZ(step: number) {
    this.stepMoveCurrentPolyomino(0, 0, step);
  }
}
