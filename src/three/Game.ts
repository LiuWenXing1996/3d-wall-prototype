import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { GameBoard } from "./GameBoard";

export default class Game {
  // 地图大小: width, depth, height(宽度、深度、高度)
  readonly mapSize = Object.freeze({
    width: 10,
    depth: 10,
    height: 20,
  });
  scene: Scene;
  renderer: WebGLRenderer;
  camera: PerspectiveCamera;
  gameBoard: GameBoard;
  // 存储已固定的方块位置 {x,y,z} → true
  private fixedBlocks: Set<string> = new Set();
  // 暂停状态
  private isPaused: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    const renderer = new WebGLRenderer({ antialias: true, canvas });
    const scene = new Scene();
    this.scene = scene;
    this.renderer = renderer;
    const camera = new PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      3000,
    );
    this.camera = camera;
    camera.position.set(10, 20, 10);
    // camera.lookAt(5, 5, 5);
    this.gameBoard = new GameBoard();
    scene.add(this.gameBoard);

    function resizeRendererToDisplaySize(renderer: WebGLRenderer) {
      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = Math.floor(canvas.clientWidth * pixelRatio);
      const height = Math.floor(canvas.clientHeight * pixelRatio);
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }
    const game = this; // 保存引用供闭包使用

    function animate(time: number) {
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      if (!game.isPaused) {
        // 方块自动下落逻辑
        game.update(time);
      }

      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);
  }
  start() {
    // 生成第一个方块
    this.gameBoard.spawnPolyomino();
  }
  pause() {
    this.isPaused = true;
  }
  resume() {
    this.isPaused = false;
  }
  isGamePaused(): boolean {
    return this.isPaused;
  }
  /**
   * 更新游戏状态
   */
  update(time: number): void {
    this.gameBoard.update(time);
  }

  // 添加固定方块
  addFixedBlock(x: number, y: number, z: number): void {
    this.fixedBlocks.add(`${x},${y},${z}`);
  }
  // 检查位置是否已被占用
  isBlocked(x: number, y: number, z: number): boolean {
    return this.fixedBlocks.has(`${x},${y},${z}`);
  }
  // 清除完整层（消行逻辑）
  clearLayers() {
    // 实现消行逻辑时使用
  }
}
