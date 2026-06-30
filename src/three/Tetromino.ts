import {
  BoxGeometry,
  Euler,
  Group,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Quaternion,
  Vector3,
  type Scene,
} from "three";
import GameObject from "./GameObject";
import type Game from "./Game";
import Cube from "./Cube";
import Box from "./Box";
import * as THREE from "three";
import { cloneDeep } from "es-toolkit";

export default class StraightTetromino extends GameObject {
  labelColor: string = "#ff9562";
  blocks = [
    {
      position: { x: 0, y: 0, z: 0 },
      color: "#62ff91",
    },
    {
      position: { x: 1, y: 0, z: 0 },
      color: "#6289ff",
    },
    {
      position: { x: 2, y: 0, z: 0 },
      color: "#ff62ed",
    },
    {
      position: { x: 2, y: 1, z: 0 },
      color: "#ff626a",
    },
  ];
  blockList: Group[] = [];
  constructor(game: Game) {
    super(game);
    this.blockList = [];
    const blocks = this.blocks;
    for (const block of blocks) {
      const { x, y, z } = block.position;
      const cube = new Cube(this.game.scene, block.color);
      cube.group.position.set(x, y, z);
      this.group.add(cube.group);
      this.blockList.push(cube.group);
    }
  }
  getWorldPositions(): { x: number; y: number; z: number }[] {
    return this.blockList.map((block) => {
      const worldPos = block.position.clone().add(this.group.position);
      return {
        x: Math.round(worldPos.x),
        y: Math.round(worldPos.y),
        z: Math.round(worldPos.z),
      };
    });
  }
  /**
   * 固定当前方块到游戏地图
   * 将方块的每个格子添加到已固定方块集合中
   */
  lock(): void {
    const positions = this.getWorldPositions();
    positions.forEach((pos) => {
      this.game.addFixedBlock(pos.x, pos.y, pos.z);
    });
  }

  /**
   * 销毁当前方块（从场景中移除）
   */
  destroy(): void {
    this.blockList.forEach((block) => {
      this.game.scene.remove(block);
    });
    this.group.removeFromParent();
    super.destroy();
  }

  calculateBound(positionsList: Vector3[]) {
    const minX = Math.min(...positionsList.map((position) => position.x));
    const maxX = Math.max(...positionsList.map((position) => position.x));
    const minY = Math.min(...positionsList.map((position) => position.y));
    const maxY = Math.max(...positionsList.map((position) => position.y));
    const minZ = Math.min(...positionsList.map((position) => position.z));
    const maxZ = Math.max(...positionsList.map((position) => position.z));
    return { minX, maxX, minY, maxY, minZ, maxZ };
  }
  /**
   * 检测是否会发生碰撞
   * @param x X轴位置,世界坐标
   * @param y Y轴位置,世界坐标
   * @param z Z轴位置,世界坐标
   * @returns 是否会发生碰撞
   */
  checkCollision(x: number, y: number, z: number): boolean {
    // 边界检测
    if (x < 0 || x >= this.game.mapSize.width) return true;
    if (y < 0) return true; // Y轴向下无限（高度方向）
    if (z < 0 || z >= this.game.mapSize.depth) return true;

    // 与已固定方块的碰撞检测
    if (this.game.isBlocked(x, y, z)) return true;
    return false;
  }
  /**
   * 在指定轴方向上移动
   * @param x 移动步数，正数为正向移动，负数为负向移动
   * @param y 移动步数，正数为正向移动，负数为负向移动
   * @param z 移动步数，正数为正向移动，负数为负向移动
   */
  stepMove(x?: number, y?: number, z?: number) {
    const oldPosition = this.group.position.clone();
    const newPosition = new Vector3(
      oldPosition.x + (x || 0),
      oldPosition.y + (y || 0),
      oldPosition.z + (z || 0),
    );
    // 检查是否发生碰撞
    const newBlockPositions = this.blockList.map((block) =>
      block.position.clone().add(newPosition.clone()),
    );
    if (
      newBlockPositions.some((position) =>
        this.checkCollision(position.x, position.y, position.z),
      )
    ) {
      return;
    }
    this.group.position.copy(newPosition);
  }
  /**
   * 在x轴方向上移动
   * @param step 移动步数，正数为正向移动，负数为负向移动
   */
  stepMoveX(step: number) {
    this.stepMove(step);
  }
  /**
   * 在y轴方向上移动
   * @param step 移动步数，正数为正向移动，负数为负向移动
   */
  stepMoveY(step: number) {
    this.stepMove(0, step);
  }
  /**
   * 在z轴方向上移动
   * @param step 移动步数，正数为正向移动，负数为负向移动
   */
  stepMoveZ(step: number) {
    this.stepMove(0, 0, step);
  }
  /**
   * 在指定轴方向上旋转
   * @param x 旋转角度
   * @param y 旋转角度
   * @param z 旋转角度
   */
  rotate(x?: number, y?: number, z?: number) {
    const targetRotation = new Euler(x || 0, y || 0, z || 0, "XYZ");
    const targetQuaternion = new Quaternion().setFromEuler(targetRotation);
    const predictedPositions: Vector3[] = [];

    this.blockList.forEach((block) => {
      block.updateMatrix();
      const childLocalMatrix = block.matrix.clone();
      const parentTargetMatrix = new Matrix4().makeRotationFromQuaternion(
        targetQuaternion,
      );
      const predictedLocalMatrix = new Matrix4().multiplyMatrices(
        parentTargetMatrix,
        childLocalMatrix,
      );
      const predictedLocalPos = new Vector3();
      predictedLocalPos.setFromMatrixPosition(predictedLocalMatrix);
      predictedPositions.push(predictedLocalPos);
    });
    // 检查是否发生碰撞
    const newBlockPositions = predictedPositions.map((position) =>
      position.clone().add(this.group.position.clone()),
    );
    if (
      newBlockPositions.some((position) =>
        this.checkCollision(position.x, position.y, position.z),
      )
    ) {
      return;
    }
    predictedPositions.forEach((predictedLocalPos, index) => {
      const block = this.blockList[index];
      block.position.set(
        Number(predictedLocalPos.x.toFixed(2)),
        Number(predictedLocalPos.y.toFixed(2)),
        Number(predictedLocalPos.z.toFixed(2)),
      );
    });
  }
  /**
   * 在x轴方向按规定角度间隔分步旋转
   * @param step 旋转角度步数，单步旋转角度为π/2度
   */
  stepRotateX(step: number) {
    this.rotate((step * Math.PI) / 2);
  }
  /**
   * 在y轴方向按规定角度间隔分步旋转
   * @param step 旋转角度步数，单步旋转角度为π/2度
   */
  stepRotateY(step: number) {
    this.rotate(0, (step * Math.PI) / 2);
  }
  /**
   * 在z轴方向按规定角度间隔分步旋转
   * @param step 旋转角度步数，单步旋转角度为π/2度
   */
  stepRotateZ(step: number) {
    this.rotate(0, 0, (step * Math.PI) / 2);
  }
  logPosition() {
    console.log(this.group.position.toArray());
    console.log(this.group.rotation.toArray());
    console.log(this.blockList.map((block) => block.position.toArray()));
    console.log(this.blockList.map((block) => block.rotation.toArray()));
  }
}
