import { AxesHelper, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import CubeGroup, { CubeGroupTypeEnum, type CubeGroupType } from "./CubeGroup";
import ThreeSidedGrid from "./ThreeSidedGrid";
import Floor from "./Floor";

export default class Game {
  scene: Scene;
  renderer: WebGLRenderer;
  camera: PerspectiveCamera;

  constructor(canvas: HTMLCanvasElement) {
    const renderer = new WebGLRenderer({ antialias: true, canvas });
    const scene = new Scene();
    const width = 750;
    const height = 1624;

    const camera = new PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      3000,
    );
    this.camera = camera;
    // camera.position.set(200, 200, 200);
    camera.position.x = -10;
    camera.position.y = 10;
    camera.position.z = 10;
    camera.lookAt(0, 0, 0);
    // const axesHelper = new AxesHelper(100);
    // axesHelper.setColors("red", "green", "blue"); // 设置坐标轴颜色

    // // 2. 将坐标轴添加到场景中
    // scene.add(axesHelper);

    const floor = new Floor(scene, 4, 4, 5);

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

    function animate(time: number) {
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      cubeGroupList.forEach((cubeGroup) => {
        cubeGroup.group.rotation.x = time / 2000;
        cubeGroup.group.rotation.y = time / 1000;
      });
      // threeSidedGrid.group.rotation.y = time / 1000;
      // threeSidedGrid.group.rotation.x = time / 2000;

      // floor.group.rotation.y = time / 1000;
      // floor.group.rotation.x = time / 2000;
      // floor.floor.rotation.z = time / 1000;
      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);
    this.scene = scene;
    this.renderer = renderer;
  }
}
