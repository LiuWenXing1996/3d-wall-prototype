import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import CubeGroup, { CubeGroupTypeEnum, type CubeGroupType } from "./CubeGroup";

export default class Game {
  scene: Scene;
  renderer: WebGLRenderer;

  constructor(canvas: HTMLCanvasElement) {
    const renderer = new WebGLRenderer({ antialias: true, canvas });
    const scene = new Scene();

    const camera = new PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;

    const cubeGroupList: CubeGroup[] = [];
    Object.keys(CubeGroupTypeEnum).forEach((key, index) => {
      const cubeGroupType = key as CubeGroupType;
      const cubeGroup = new CubeGroup(scene, cubeGroupType);
      cubeGroup.group.position.set(index * 2 - 1, index, 0);
      cubeGroupList.push(cubeGroup);
    });
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

      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);
    this.scene = scene;
    this.renderer = renderer;
  }
}
