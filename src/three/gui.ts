import GUI from "lil-gui";
import type Game from "./Game";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { AxesHelper, GridHelper } from "three";
const gui = new GUI();

/**
 * 添加开发用的gui
 * @param game 游戏实例
 */
export const addDevGui = (game: Game) => {
  const folder = gui.addFolder("开发");
  // 斜向视角
  {
    const cameraOriginPosition = game.camera.position.clone();
    const cameraOriginRotation = game.camera.rotation.clone();
    folder
      .add(
        {
          cameraDownward: false,
        },
        "cameraDownward",
      )
      .name("斜向视角")
      .onChange((value: boolean) => {
        if (value) {
          game.camera.position.set(-10, 10, 10);
          game.camera.lookAt(0, 0, 0);
        } else {
          game.camera.position.copy(cameraOriginPosition);
          game.camera.rotation.copy(cameraOriginRotation);
        }
      });
  }
  // 支持自由视角切换
  {
    const controls = new OrbitControls(game.camera, game.renderer.domElement);
    controls.enabled = false;
    folder
      .add({ controlsEnabled: false }, "controlsEnabled")
      .name("开启自由视角")
      .onChange((value: boolean) => {
        controls.enabled = value;
        if (!value) {
          controls.reset();
        }
      });
  }
  // 显示坐标轴
  {
    const axesHelper = new AxesHelper(100);
    axesHelper.setColors("red", "green", "blue"); // 设置坐标轴颜色
    axesHelper.visible = false;
    game.scene.add(axesHelper);
    folder
      .add({ axisHelperVisible: false }, "axisHelperVisible")
      .name("显示坐标轴")
      .onChange((value: boolean) => {
        axesHelper.visible = value;
      });
  }
  // 显示网格线
  {
    const gridHelper = new GridHelper(100, 100);
    gridHelper.visible = false;
    game.scene.add(gridHelper);
    folder
      .add({ gridHelperVisible: false }, "gridHelperVisible")
      .name("显示网格线")
      .onChange((value: boolean) => {
        gridHelper.visible = value;
      });
  }
};
