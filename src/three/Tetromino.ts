import { BoxGeometry, Group, Mesh, MeshBasicMaterial, type Scene } from "three";
import GameObject from "./GameObject";
import type Game from "./Game";
import Cube from "./Cube";
import Box from "./Box";

export default class StraightTetromino extends GameObject {
  blockList: Group[];
  constructor(game: Game) {
    super(game);
    const allColor = "#ff9562";
    const blocks = [
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
    this.blockList = [];
    for (const block of blocks) {
      const { x, y, z } = block.position;
      const cube = new Cube(game.scene, block.color);
      cube.group.position.set(x, y, z);
      this.blockList.push(cube.group);
      this.group.add(cube.group);
    }
  }
  /**
   * 计算边界
   */
  calculateBoundary() {
    const minX = Math.min(...this.blockList.map((block) => block.position.x));
    const maxX = Math.max(...this.blockList.map((block) => block.position.x));
    const minY = Math.min(...this.blockList.map((block) => block.position.y));
    const maxY = Math.max(...this.blockList.map((block) => block.position.y));
    const minZ = Math.min(...this.blockList.map((block) => block.position.z));
    const maxZ = Math.max(...this.blockList.map((block) => block.position.z));
    return { minX, maxX, minY, maxY, minZ, maxZ };
  }
  showBoundary() {
    const boundary = this.calculateBoundary();
    console.log(boundary);
    const boundaryBox = new Box(this.game, {
      width: boundary.maxX - boundary.minX + 1,
      height: boundary.maxY - boundary.minY + 1,
      depth: boundary.maxZ - boundary.minZ + 1,
      color: "red",
      lineSegments: {
        color: "red",
      },
    });
    boundaryBox.group.position.set(boundary.minX, boundary.minY, boundary.minZ);
    // const boxGeometry = new BoxGeometry(
    //   boundary.maxX - boundary.minX + 1,
    //   boundary.maxY - boundary.minY + 1,
    //   boundary.maxZ - boundary.minZ + 1,
    // );
    // const box = new Mesh(boxGeometry, new MeshBasicMaterial({ color: "red" }));
    // box.position.set(boundary.minX, boundary.minY, boundary.minZ);
    // this.game.scene.add(box);
  }

  stepMoveX(x: number) {
    this.blockList.forEach((block) => {
      block.position.x += x;
    });
    // const targetX = this.group.position.x + x;
    // const mapSize = this.game.mapSize;
    // if (targetX > mapSize.width - 3) {
    //   return;
    // }
    // if (targetX < 0) {
    //   return;
    // }
    // this.group.position.x = targetX;
  }
  stepMoveY(y: number) {
    this.blockList.forEach((block) => {
      block.position.y += y;
    });
    // const targetY = this.group.position.y + y;
    // if (targetY < 0) {
    //   return;
    // }
    // this.group.position.y = targetY;
  }
  stepMoveZ(z: number) {
    this.blockList.forEach((block) => {
      block.position.z += z;
    });
    // const targetZ = this.group.position.z + z;
    // const mapSize = this.game.mapSize;
    // if (targetZ > mapSize.depth - 3) {
    //   return;
    // }
    // if (targetZ < 0) {
    //   return;
    // }
    // this.group.position.z = targetZ;
  }
  stepRotateX(x: number) {
    this.group.rotateX((x * Math.PI) / 2);
  }
  stepRotateY(y: number) {
    this.group.rotateY((y * Math.PI) / 2);
  }
  stepRotateZ(z: number) {
    this.group.rotateZ((z * Math.PI) / 2);
  }
  logPosition() {
    console.log(this.group.position);
    console.log(this.group.rotation);
    console.log(this.blockList.map((block) => block.position));
  }
}
