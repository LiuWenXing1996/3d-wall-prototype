import GUI from "lil-gui";
import type Game from "./Game";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { AxesHelper, GridHelper, Line, LineBasicMaterial } from "three";
import StraightTetromino from "./Tetromino";
import type { Nullable } from "../types";
import CustomAxesHelper from "./CustomAxesHelper";
import Polyomino from "./Polyomino";
const gui = new GUI();

/**
 * 添加开发用的gui
 * @param game 游戏实例
 */
export const addDevGui = (game: Game) => {
  const folder = gui.addFolder("开发");
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
    const axesHelper = new CustomAxesHelper();
    // axesHelper.setColors("red", "green", "blue"); // 设置坐标轴颜色
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
export const addStraightTetrominoGui = (game: Game) => {
  const folder = gui.addFolder("直线骨牌");
  let testTetromino: Nullable<Polyomino> = null;
  // 添加一个测试直线骨牌
  {
    folder
      .add(
        {
          addTetromino: () => {
            if (!testTetromino) {
              testTetromino = new Polyomino();
              testTetromino.position.set(5, 20, 5);
              game.gameWorld.add(testTetromino);
            } else {
            }
          },
        },
        "addTetromino",
      )
      .name("添加测试骨牌");
  }
  // 移除测试骨牌
  {
    folder
      .add(
        {
          removeTestTetromino: () => {
            if (testTetromino) {
              testTetromino.destroy();
              testTetromino = null;
            }
          },
        },
        "removeTestTetromino",
      )
      .name("移除测试骨牌");
  }
  // 沿x轴正向移动测试骨牌
  {
    folder
      .add(
        {
          movePositiveX: () => {
            if (testTetromino) {
              testTetromino.stepMoveX(1);
            }
          },
        },
        "movePositiveX",
      )
      .name("沿x轴正向移动测试骨牌");
  }
  // 沿x轴负向移动测试骨牌
  {
    folder
      .add(
        {
          moveNegativeX: () => {
            if (testTetromino) {
              testTetromino.stepMoveX(-1);
            }
          },
        },
        "moveNegativeX",
      )
      .name("沿x轴负向移动测试骨牌");
  }
  // 沿y轴正向移动测试骨牌
  {
    folder
      .add(
        {
          movePositiveY: () => {
            if (testTetromino) {
              testTetromino.stepMoveY(1);
            }
          },
        },
        "movePositiveY",
      )
      .name("沿y轴正向移动测试骨牌");
  }
  // 沿y轴负向移动测试骨牌
  {
    folder
      .add(
        {
          moveNegativeY: () => {
            if (testTetromino) {
              testTetromino.stepMoveY(-1);
            }
          },
        },
        "moveNegativeY",
      )
      .name("沿y轴负向移动测试骨牌");
  }
  // 沿z轴正向移动测试骨牌
  {
    folder
      .add(
        {
          movePositiveZ: () => {
            if (testTetromino) {
              testTetromino.stepMoveZ(1);
            }
          },
        },
        "movePositiveZ",
      )
      .name("沿z轴正向移动测试骨牌");
  }
  // 沿z轴负向移动测试骨牌
  {
    folder
      .add(
        {
          moveNegativeZ: () => {
            if (testTetromino) {
              testTetromino.stepMoveZ(-1);
            }
          },
        },
        "moveNegativeZ",
      )
      .name("沿z轴负向移动测试骨牌");
  }
  // 沿x轴旋转测试骨牌
  {
    folder
      .add(
        {
          rotateX: () => {
            if (testTetromino) {
              testTetromino.stepRotateX(1);
            }
          },
        },
        "rotateX",
      )
      .name("沿x轴旋转测试骨牌");
  }
  // 沿y轴旋转测试骨牌
  {
    folder
      .add(
        {
          rotateY: () => {
            if (testTetromino) {
              testTetromino.stepRotateY(1);
            }
          },
        },
        "rotateY",
      )
      .name("沿y轴旋转测试骨牌");
  }
  // 沿z轴旋转测试骨牌
  {
    folder
      .add(
        {
          rotateZ: () => {
            if (testTetromino) {
              testTetromino.stepRotateZ(1);
            }
          },
        },
        "rotateZ",
      )
      .name("沿z轴旋转测试骨牌");
  }
  // 打印测试骨牌位置
  {
    folder
      .add(
        {
          logPosition: () => {
            if (testTetromino) {
              testTetromino.logPosition();
            }
          },
        },
        "logPosition",
      )
      .name("打印测试骨牌位置");
  }
  // 计算测试骨牌边界
  {
    folder
      .add(
        {
          calculateBoundary: () => {
            if (testTetromino) {
              testTetromino.calculateBoundary();
            }
          },
        },
        "calculateBoundary",
      )
      .name("计算测试骨牌边界");
  }
  // 显示测试骨牌边界
  {
    folder
      .add(
        {
          showBoundary: () => {
            if (testTetromino) {
              testTetromino.showBoundary();
            }
          },
        },
        "showBoundary",
      )
      .name("显示测试骨牌边界");
  }
};

export const initGui = (game: Game) => {
  addDevGui(game);
  addStraightTetrominoGui(game);
};
