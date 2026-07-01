import { Matrix4, Object3D, Vector3 } from "three";
import Polyomino, { PolyominoTypeEnum, type PolyominoType } from "./Polyomino";
import type { Nullable } from "../types";
import { cloneDeep } from "es-toolkit";
import FixedCubeList from "./FixedCubeList";
import GameBoardFloor from "./GameBoardFloor";
import GameBoardWall from "./GameBoardWall";
// TODO:尝试编写单元测试案例，测试GameBoard类的功能，包括下落、碰撞检测、固定方块等
export class GameBoard extends Object3D {
  worldSize: { width: number; depth: number; height: number } = {
    width: 10,
    depth: 10,
    height: 20,
  };
  currentPolyomino: Nullable<Polyomino> = null;
  private lastDropTime: number = 0; // 上次下落时间（毫秒）
  private dropInterval: number = 1000; // 下落间隔（毫秒），默认1秒下落一格
  fixedCubeList: FixedCubeList;
  constructor() {
    super();
    // 创建地板
    const floor = new GameBoardFloor({
      width: this.worldSize.width,
      depth: this.worldSize.depth,
      height: this.worldSize.height,
    });
    this.add(floor);
    // 创建墙壁
    const walls = new GameBoardWall({
      width: this.worldSize.width,
      depth: this.worldSize.depth,
      height: this.worldSize.height,
    });
    this.add(walls);
    // 创建已固定方块列表
    this.fixedCubeList = new FixedCubeList();
    this.add(this.fixedCubeList);
  }

  /**
   * 更新游戏棋盘状态
   * @param time 当前时间（毫秒）
   */
  update(time: number) {
    if (!this.currentPolyomino) return;

    // 检查是否需要下落
    if (time - this.lastDropTime >= this.dropInterval) {
      // this.tryDrop(); // 尝试下落
      this.lastDropTime = time;
    }
  }

  /**
   * 尝试让当前方块下落一格
   */
  public tryDrop() {
    if (!this.currentPolyomino) return;

    // 检查是否可以下落（检测碰撞）
    const predictedBlockPositions = this.currentPolyomino.cubeList.map(
      (block) => {
        const worldPos = block.getWorldPosition(new Vector3());
        const predictedWorldPos = worldPos.clone().add(new Vector3(0, -1, 0));
        return predictedWorldPos;
      },
    );
    if (
      predictedBlockPositions.some((position) => this.checkCollision(position))
    ) {
      // 发生碰撞，无法下落
      this.lockPolyomino();
      this.spawnPolyomino();
    } else {
      this.currentPolyomino.position.y = this.currentPolyomino.position.y - 1;
    }
  }
  checkCollision(worldPosition: Vector3): boolean {
    const { x, y, z } = this.worldPositionToGameBoardPosition(worldPosition);
    // 边界检测
    if (x < 0 || x >= this.worldSize.width) return true;
    if (y < 0) return true; // Y轴向下无限（高度方向）
    if (z < 0 || z >= this.worldSize.depth) return true;

    // 与已固定方块的碰撞检测
    if (this.fixedCubeList.isBlocked(x, y, z)) return true;
    return false;
  }
  /**
   * 将世界坐标转换为棋盘坐标，方便碰撞检测和平移、旋转等操作
   *  棋盘坐标是整数坐标，表示方块在棋盘中的位置
   * @param worldPosition 世界坐标
   * @returns 棋盘坐标
   */
  worldPositionToGameBoardPosition(worldPosition: Vector3): Vector3 {
    const localPosition = this.worldToLocal(worldPosition.clone());
    const toInt = (val: number) => Math.round(val);
    const intX = toInt(localPosition.x);
    const intY = toInt(localPosition.y);
    const intZ = toInt(localPosition.z);
    const intPosition = new Vector3(intX, intY, intZ);
    return intPosition;
  }
  /**
   * 固定当前方块到游戏板
   */
  private lockPolyomino(): void {
    if (!this.currentPolyomino) return;
    const cubeList = this.currentPolyomino.cubeList.map((cube) => {
      const worldPosition = cube.getWorldPosition(new Vector3());
      return {
        config: cloneDeep(cube.config),
        position: this.worldPositionToGameBoardPosition(worldPosition),
      };
    });
    cubeList.forEach((cube) => {
      this.fixedCubeList.addCube(cube.position, cube.config);
    });

    // TODO: 检测并清除完整的层（俄罗斯方块逻辑）
    // this.clearFullLayers();
  }
  spawnPolyominoByType(type: PolyominoType) {
    // 移除旧的方块
    if (this.currentPolyomino) {
      this.remove(this.currentPolyomino);
    }
    // 生成新方块
    this.currentPolyomino = new Polyomino(type);
    this.add(this.currentPolyomino);
    // 设置初始位置（地图中心顶部）
    this.currentPolyomino.position.set(
      Math.floor(this.worldSize.width / 2) - 1,
      this.worldSize.height - 1,
      Math.floor(this.worldSize.depth / 2) - 1,
    );
  }
  /**
   * 生成新方块
   */
  spawnPolyomino() {
    // 随机选择一个方块类型
    const type =
      Object.values(PolyominoTypeEnum)[
        Math.floor(Math.random() * Object.values(PolyominoTypeEnum).length)
      ];
    console.log(type);
    this.spawnPolyominoByType(type);
  }
  /**
   * 绕中心旋转棋盘
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
      .setPosition(point1) // 平移到原点
      .multiply(rotationMatrix) // 旋转
      .multiply(new Matrix4().setPosition(point1.clone().negate())); // 平移到原位置

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
    // 预测连块中所有方块的世界位置
    const predictedCubePositions = this.currentPolyomino.cubeList.map(
      (block) => {
        const worldPos = block.getWorldPosition(new Vector3());
        const predictedWorldPos = worldPos.clone().add(new Vector3(x, y, z));
        return predictedWorldPos;
      },
    );
    if (
      predictedCubePositions.some((position) => this.checkCollision(position))
    ) {
      // 发生碰撞，无法移动
      return;
    }
    // 整体移动连块，而不是每个方块单独移动
    // 获取当前连块的世界位置
    const oldWorldPosition = this.currentPolyomino.getWorldPosition(
      new Vector3(),
    );
    // 预测连块新的世界位置
    const predictedWorldPosition = oldWorldPosition
      .clone()
      .add(new Vector3(x, y, z));
    // 连块的世界位置转棋盘位置
    const newBoardPosition = this.worldPositionToGameBoardPosition(
      predictedWorldPosition.clone(),
    );
    this.currentPolyomino.position.copy(newBoardPosition);
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
