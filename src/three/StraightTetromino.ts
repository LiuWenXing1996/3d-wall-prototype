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

export const StraightTetrominoStateEnum = {
  initial: "initial",
  // 所有旋转均为顺时针
  rotateX90: "rotateX90",
} as const;
const straightTetrominoStateOrderList = [
  StraightTetrominoStateEnum.initial,
  StraightTetrominoStateEnum.rotateX90,
];
export type StraightTetrominoState =
  (typeof StraightTetrominoStateEnum)[keyof typeof StraightTetrominoStateEnum];

export const StraightTetrominoStates: Record<
  StraightTetrominoState,
  { blocks: { position: { x: number; y: number; z: number }; color: string }[] }
> = {
  initial: {
    blocks: [
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
    ],
  },
  rotateX90: {
    blocks: [
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
        position: { x: 2, y: 0, z: -1 },
        color: "#ff626a",
      },
    ],
  },
};

export default class StraightTetrominoTest extends GameObject {
  labelColor: string = "#ff9562";
  state: StraightTetrominoState = StraightTetrominoStateEnum.initial;
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
    this.reGenerateBoxList();
    // this.group.translateX(0.5);
  }
  calculateBound(positionsList: Vector3[]) {
    // 根据世界坐标计算边界框
    // const blockListWorldPosition = positionsList.map((position) =>
    //   this.group.position.clone().add(position.clone()).clone(),
    // );
    // console.log("this.group.position", this.group.position.toArray());
    // console.log("blockListWorldPosition", blockListWorldPosition);

    const minX = Math.min(...positionsList.map((position) => position.x));
    const maxX = Math.max(...positionsList.map((position) => position.x));
    const minY = Math.min(...positionsList.map((position) => position.y));
    const maxY = Math.max(...positionsList.map((position) => position.y));
    const minZ = Math.min(...positionsList.map((position) => position.z));
    const maxZ = Math.max(...positionsList.map((position) => position.z));
    return { minX, maxX, minY, maxY, minZ, maxZ };
  }
  /**
   * 计算边界
   */
  calculateBoundary() {
    // 根据世界坐标计算边界框
    const blockListWorldPosition = this.blockList.map((block) =>
      block.position.clone().applyMatrix4(block.matrixWorld).clone(),
    );
    console.log("this.group.position", this.group.position.toArray());
    console.log("blockListWorldPosition", blockListWorldPosition);

    const minX = Math.min(
      ...blockListWorldPosition.map((position) => position.x),
    );
    const maxX = Math.max(
      ...blockListWorldPosition.map((position) => position.x),
    );
    const minY = Math.min(
      ...blockListWorldPosition.map((position) => position.y),
    );
    const maxY = Math.max(
      ...blockListWorldPosition.map((position) => position.y),
    );
    const minZ = Math.min(
      ...blockListWorldPosition.map((position) => position.z),
    );
    const maxZ = Math.max(
      ...blockListWorldPosition.map((position) => position.z),
    );
    return { minX, maxX, minY, maxY, minZ, maxZ };
  }
  reGenerateBoxList() {
    this.group.clear();
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
  showBoundary() {
    const boundary = this.calculateBoundary();
    console.log(boundary);
    const boundaryBox = new Box(this.game, {
      width: boundary.maxX - boundary.minX,
      height: boundary.maxY - boundary.minY,
      depth: boundary.maxZ - boundary.minZ,
      color: "red",
      lineSegments: {
        color: "red",
      },
    });
    boundaryBox.group.position.copy(this.group.position.clone());
    // const boxGeometry = new BoxGeometry(
    //   boundary.maxX - boundary.minX + 1,
    //   boundary.maxY - boundary.minY + 1,
    //   boundary.maxZ - boundary.minZ + 1,
    // );
    // const box = new Mesh(boxGeometry, new MeshBasicMaterial({ color: "red" }));
    // box.position.set(boundary.minX, boundary.minY, boundary.minZ);
    // this.game.scene.add(box);
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
    // 检查是否超出边界
    const boundary = this.calculateBound(
      this.blockList.map((block) =>
        block.position.clone().add(newPosition.clone()),
      ),
    );
    const mapSize = this.game.mapSize;
    if (
      boundary.minX < 0 ||
      boundary.maxX >= mapSize.width ||
      boundary.minY < 0 ||
      boundary.maxY >= mapSize.height ||
      boundary.minZ < 0 ||
      boundary.maxZ >= mapSize.depth
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
    // 检查是否超出边界
    const boundary = this.calculateBound(
      predictedPositions.map((position) =>
        position.clone().add(this.group.position.clone()),
      ),
    );
    const mapSize = this.game.mapSize;
    if (
      boundary.minX < 0 ||
      boundary.maxX >= mapSize.width ||
      boundary.minY < 0 ||
      boundary.maxY >= mapSize.height ||
      boundary.minZ < 0 ||
      boundary.maxZ >= mapSize.depth
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
