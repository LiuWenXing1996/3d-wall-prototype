import { AxesHelper, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import CubeGroup, { CubeGroupTypeEnum, type CubeGroupType } from "./CubeGroup";
import ThreeSidedGrid from "./ThreeSidedGrid";
import Floor from "./Floor";
import Cube from "./Cube";
import StraightTetromino from "./Tetromino";

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
  // 存储已固定的方块位置 {x,y,z} → true
  private fixedBlocks: Set<string> = new Set();
  // 当前活动方块
  private currentTetromino: StraightTetromino | null = null;
  // 下落速度控制（毫秒）
  private dropInterval: number = 1000;
  private lastDropTime: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    const renderer = new WebGLRenderer({ antialias: true, canvas });
    const scene = new Scene();
    this.scene = scene;
    this.renderer = renderer;

    const width = 750;
    const height = 1624;
    // const currentType = CubeGroupTypeEnum.OrangeRicky;
    // const cubeGroup = new CubeGroup(scene, currentType);
    // cubeGroup.group.position.set(0, 10, 0);

    const camera = new PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      3000,
    );
    this.camera = camera;

    camera.position.set(20, 30, 20);
    camera.lookAt(0, 0, 0);
    // const axesHelper = new AxesHelper(100);
    // axesHelper.setColors("red", "green", "blue"); // 设置坐标轴颜色

    // // 2. 将坐标轴添加到场景中
    // scene.add(axesHelper);

    const floor = new Floor(
      scene,
      this.mapSize.width,
      this.mapSize.depth,
      this.mapSize.height,
    );
    // 生成第一个方块
    this.spawnTetromino();
    // const straightTetromino = new StraightTetromino(this);

    // const threeSidedGrid = new ThreeSidedGrid(scene);
    // threeSidedGrid.group.rotateX(Math.PI / 3);
    // threeSidedGrid.group.rotateY(Math.PI / 3);

    const cubeGroupList: CubeGroup[] = [];
    // Object.keys(CubeGroupTypeEnum).forEach((key, index) => {
    //   const cubeGroupType = key as CubeGroupType;
    //   const cubeGroup = new CubeGroup(scene, cubeGroupType);
    //   cubeGroup.group.position.set(index * 2 - 1, index, 0);
    //   cubeGroupList.push(cubeGroup);
    // });
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

      // 方块自动下落逻辑
      game.update(time);

      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);
  }
  /**
   * 更新游戏状态
   */
  update(time: number): void {
    if (!this.currentTetromino) return;

    // 定时下落
    if (time - this.lastDropTime >= this.dropInterval) {
      this.drop();
      this.lastDropTime = time;
    }
  }
  /**
   * 方块下落一格
   */
  drop(): void {
    if (!this.currentTetromino) return;

    // 尝试向下移动
    this.currentTetromino.stepMoveY(-1);

    // 检查是否落地（无法继续下落）
    // 通过检查是否还能继续向下移动来判断
    const newPositions = this.currentTetromino.getWorldPositions();
    const canMoveDown = !newPositions.some((pos) => {
      const targetY = pos.y - 1;
      return targetY < 0 || this.isBlocked(pos.x, targetY, pos.z);
    });

    if (!canMoveDown) {
      // 落地了，固定方块并生成新方块
      this.currentTetromino.lock();
      // this.currentTetromino.destroy();
      this.currentTetromino = null;

      // 检查消行
      this.clearLayers();

      // 生成新方块
      this.spawnTetromino();
    }
  }
  hardDrop(): void {
    if (!this.currentTetromino) return;
    
    // 持续向下移动直到无法移动
    while (true) {
      const positions = this.currentTetromino.getWorldPositions();
      const canMoveDown = !positions.some(pos => {
        const targetY = pos.y - 1;
        return targetY < 0 || this.isBlocked(pos.x, targetY, pos.z);
      });
      
      if (!canMoveDown) break;
      
      this.currentTetromino.stepMoveY(-1);
    }
    
    // 固定方块
    this.currentTetromino.lock();
    // this.currentTetromino.destroy();
    this.currentTetromino = null;
    
    this.clearLayers();
    this.spawnTetromino();
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
  /**
   * 生成新方块
   */
  spawnTetromino() {
    this.currentTetromino = new StraightTetromino(this);
    // 设置初始位置（地图中心顶部）
    this.currentTetromino.group.position.set(
      Math.floor(this.mapSize.width / 2) - 1,
      this.mapSize.height - 1,
      Math.floor(this.mapSize.depth / 2) - 1,
    );
  }
}
