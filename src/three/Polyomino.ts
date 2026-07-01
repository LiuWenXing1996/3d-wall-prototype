import { Euler, Matrix4, Object3D, Quaternion, Vector3 } from "three";
import PolyominoCube from "./PolyominoCube";

export default class Polyomino extends Object3D {
  cubeList: PolyominoCube[] = [];
  constructor(type: PolyominoType) {
    super();
    this.cubeList = [];
    const blocks = PolyominoTypes[type].cubes;
    const color = PolyominoTypes[type].color;
    for (const block of blocks) {
      const { x, y, z } = block.position;
      const cube = new PolyominoCube({ boxColor: color });
      // const cube = new PolyominoCube({ boxColor: block.color });
      cube.position.set(x, y, z);
      this.add(cube);
      this.cubeList.push(cube);
    }
  }
  /**
   * TODO:在 GameWorld 中实现旋转后，删除此方法
   * 在指定轴方向上旋转
   * @param x 旋转角度
   * @param y 旋转角度
   * @param z 旋转角度
   */
  rotate(x?: number, y?: number, z?: number) {
    const targetRotation = new Euler(x || 0, y || 0, z || 0, "XYZ");
    const targetQuaternion = new Quaternion().setFromEuler(targetRotation);
    const predictedPositions: Vector3[] = [];

    this.cubeList.forEach((block) => {
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
    const newBlockPositions = predictedPositions.map((position) =>
      position.clone().add(this.position.clone()),
    );
    // 检查是否发生碰撞
    if (false) {
      return;
    }
    predictedPositions.forEach((predictedLocalPos, index) => {
      const block = this.cubeList[index];
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
    console.log("位置:", this.position.toArray());
    const worldPosition = this.getWorldPosition(new Vector3());
    const intWorldPosition = new Vector3(
      Number(worldPosition.x.toFixed(2)),
      Number(worldPosition.y.toFixed(2)),
      Number(worldPosition.z.toFixed(2)),
    );
    console.log("世界位置:", worldPosition.toArray());
    console.log("整数世界位置:", intWorldPosition.toArray());
    // cubeList的位置
    console.log(
      "cubeList位置:",
      this.cubeList.map((block) => block.position.toArray()),
    );
  }
}

export const PolyominoTypeEnum = {
  I: "I",
  O: "O",
  T: "T",
  J: "J",
  L: "L",
  S: "S",
  Z: "Z",
} as const;

export type PolyominoType =
  (typeof PolyominoTypeEnum)[keyof typeof PolyominoTypeEnum];

export interface PolyominoDefine {
  cubes: {
    position: {
      x: number;
      y: number;
      z: number;
    };
    color: string;
  }[];
  color: string;
}

export const PolyominoTypes: Record<PolyominoType, PolyominoDefine> = {
  /*
    □□□□
   */
  I: {
    cubes: [
      { position: { x: 0, y: 0, z: 0 }, color: "#62ff91" },
      { position: { x: -1, y: 0, z: 0 }, color: "#6289ff" },
      { position: { x: 1, y: 0, z: 0 }, color: "#ff62ed" },
      { position: { x: 2, y: 0, z: 0 }, color: "#ff626a" },
    ],
    color: "#3fdcd5",
  },
  /*
    □□
    □□
   */
  O: {
    cubes: [
      { position: { x: 0, y: 0, z: 0 }, color: "#62ff91" },
      { position: { x: 1, y: 0, z: 0 }, color: "#6289ff" },
      { position: { x: 0, y: -1, z: 0 }, color: "#ff62ed" },
      { position: { x: 1, y: -1, z: 0 }, color: "#ff626a" },
    ],
    color: "#ffff4d",
  },
  /*
     □
    □□□
   */
  T: {
    cubes: [
      { position: { x: 0, y: 0, z: 0 }, color: "#62ff91" },
      { position: { x: 0, y: -1, z: 0 }, color: "#6289ff" },
      { position: { x: -1, y: -1, z: 0 }, color: "#ff62ed" },
      { position: { x: 1, y: -1, z: 0 }, color: "#ff626a" },
    ],
    color: "#c183ff",
  },
  /*
      □
    □□□
   */
  J: {
    cubes: [
      { position: { x: 0, y: 0, z: 0 }, color: "#62ff91" },
      { position: { x: 1, y: 0, z: 0 }, color: "#6289ff" },
      { position: { x: 2, y: 0, z: 0 }, color: "#ff62ed" },
      { position: { x: 2, y: 1, z: 0 }, color: "#ff626a" },
    ],
    color: "#ff9562",
  },
  /*
    □ 
    □□□
   */
  L: {
    cubes: [
      { position: { x: -1, y: 0, z: 0 }, color: "#62ff91" },
      { position: { x: 0, y: -1, z: 0 }, color: "#6289ff" },
      { position: { x: 1, y: -1, z: 0 }, color: "#ff62ed" },
      { position: { x: -1, y: -1, z: 0 }, color: "#ff626a" },
    ],
    color: "#5eaeff",
  },
  /*
     □□
    □□
   */
  S: {
    cubes: [
      { position: { x: 0, y: 0, z: 0 }, color: "#62ff91" },
      { position: { x: 1, y: 0, z: 0 }, color: "#6289ff" },
      { position: { x: 0, y: -1, z: 0 }, color: "#ff62ed" },
      { position: { x: -1, y: -1, z: 0 }, color: "#ff626a" },
    ],

    color: "#79dd53",
  },
  /*
    □□
     □□
   */
  Z: {
    cubes: [
      { position: { x: 0, y: 0, z: 0 }, color: "#62ff91" },
      { position: { x: -1, y: 0, z: 0 }, color: "#6289ff" },
      { position: { x: 0, y: -1, z: 0 }, color: "#ff62ed" },
      { position: { x: 1, y: -1, z: 0 }, color: "#ff626a" },
    ],
    color: "#ff8398",
  },
};
