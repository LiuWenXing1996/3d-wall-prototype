import { Group, Scene } from "three";
import Cube from "./Cube";

/**
 * 立方体组
 */
export default class CubeGroup {
  group: Group;
  scene: Scene;
  constructor(scene: Scene, type: CubeGroupType) {
    this.scene = scene;
    this.group = new Group();
    const config = CubeGroupTypes[type];
    const { blocks, color } = config;
    for (const block of blocks) {
      const cube = new Cube(this.scene, color);
      cube.group.position.set(block.x, block.y, block.z);
      this.group.add(cube.group);
    }
    this.scene.add(this.group);
  }
}

export const CubeGroupTypeEnum = {
  OrangeRicky: "OrangeRicky",
  BlueRicky: "BlueRicky",
  ClevelandZ: "ClevelandZ",
  RhodeIslandZ: "RhodeIslandZ",
  Hero: "Hero",
  Teewee: "Teewee",
  Smashboy: "Smashboy",
} as const;

export type CubeGroupType =
  (typeof CubeGroupTypeEnum)[keyof typeof CubeGroupTypeEnum];

export const CubeGroupTypes: Record<
  CubeGroupType,
  {
    blocks: { x: number; y: number; z: number }[];
    color: string;
  }
> = {
  /*
      □
    □□□
   */
  OrangeRicky: {
    blocks: [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 2, y: 0, z: 0 },
      { x: 2, y: 1, z: 0 },
    ],
    color: "#ff9562",
  },
  /*
    □ 
    □□□
   */
  BlueRicky: {
    blocks: [
      { x: -1, y: 0, z: 0 },
      { x: 0, y: -1, z: 0 },
      { x: 1, y: -1, z: 0 },
      { x: -1, y: -1, z: 0 },
    ],
    color: "#5eaeff",
  },
  /*
    □□
     □□
   */
  ClevelandZ: {
    blocks: [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: -1, z: 0 },
      { x: -1, y: -1, z: 0 },
    ],
    color: "#ff8398",
  },
  /*
     □□
    □□
   */
  RhodeIslandZ: {
    blocks: [
      { x: 0, y: 0, z: 0 },
      { x: -1, y: 0, z: 0 },
      { x: 0, y: -1, z: 0 },
      { x: 1, y: -1, z: 0 },
    ],
    color: "#79dd53",
  },
  /*
    □□□□
   */
  Hero: {
    blocks: [
      { x: 0, y: 0, z: 0 },
      { x: -1, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 2, y: 0, z: 0 },
    ],
    color: "#3fdcd5",
  },
  /*
     □
    □□□
   */
  Teewee: {
    blocks: [
      { x: 0, y: 0, z: 0 },
      { x: 0, y: -1, z: 0 },
      { x: -1, y: -1, z: 0 },
      { x: 1, y: -1, z: 0 },
    ],
    color: "#c183ff",
  },
  /*
    □□
    □□
   */
  Smashboy: {
    blocks: [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: -1, z: 0 },
      { x: 1, y: -1, z: 0 },
    ],
    color: "#ffff4d",
  },
};
