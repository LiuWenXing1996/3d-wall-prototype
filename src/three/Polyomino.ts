import { Object3D } from "three";
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
