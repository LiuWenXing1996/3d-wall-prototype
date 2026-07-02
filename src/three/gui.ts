import GUI from "lil-gui";
import type Game from "./Game";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GridHelper } from "three";
import CustomAxesHelper from "./CustomAxesHelper";
import { PolyominoTypeEnum } from "./Polyomino";
const gui = new GUI({
  title: "开发测试",
  closeFolders: true,
});
gui.domElement.style.maxHeight = "500px";
/**
 * 添加开发用的gui
 * @param game 游戏实例
 */
export const addSceneGui = (game: Game) => {
  const folder = gui.addFolder("场景管理");
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
export const addGameGui = (game: Game) => {
  const folder = gui.addFolder("游戏控制");
  // 开始游戏
  {
    folder
      .add(
        {
          start: () => {
            game.start();
          },
        },
        "start",
      )
      .name("开始游戏");
  }
  // 暂停游戏
  {
    folder
      .add(
        {
          pause: () => {
            game.pause();
          },
        },
        "pause",
      )
      .name("暂停游戏");
  }
  // 继续游戏
  {
    folder
      .add(
        {
          resume: () => {
            game.resume();
          },
        },
        "resume",
      )
      .name("继续游戏");
  }
  // 关闭自由下落
  {
    folder
      .add(
        {
          disableAutoDrop: () => {
            game.gameBoard.setEnableAutoDrop(false);
          },
        },
        "disableAutoDrop",
      )
      .name("关闭自由下落");
  }
  // 开启自由下落
  {
    folder
      .add(
        {
          enableAutoDrop: () => {
            game.gameBoard.setEnableAutoDrop(true);
          },
        },
        "enableAutoDrop",
      )
      .name("开启自由下落");
  }
};
export const addBoardGui = (game: Game) => {
  const folder = gui.addFolder("棋盘调试");
  // 左转
  {
    folder
      .add(
        {
          rotateLeft: () => {
            game.gameBoard.stepRotateOnCenter(-1);
          },
        },
        "rotateLeft",
      )
      .name("左转");
  }
  // 右转
  {
    folder
      .add(
        {
          rotateRight: () => {
            game.gameBoard.stepRotateOnCenter(1);
          },
        },
        "rotateRight",
      )
      .name("右转");
  }
};
export const addPolyominoGui = (game: Game) => {
  const folder = gui.addFolder("连块调试");
  // 添加连块
  {
    const addPolyominoFolder = folder.addFolder("添加连块");
    addPolyominoFolder
      .add(
        {
          spawnPolyomino: () => {
            game.gameBoard.spawnPolyomino();
          },
        },
        "spawnPolyomino",
      )
      .name("随机添加连块");
    Object.values(PolyominoTypeEnum).map((type) => {
      addPolyominoFolder
        .add(
          {
            spawnPolyominoByType: () => {
              game.gameBoard.spawnPolyominoByType(type);
            },
          },
          "spawnPolyominoByType",
        )
        .name(`添加${type}型连块`);
    });
  }
  // 连块移动控制
  {
    const movePolyominoFolder = folder.addFolder("连块移动控制");
    ["X", "Y", "Z"].map((axis) => {
      [1, -1].map((step) => {
        movePolyominoFolder
          .add(
            {
              move: () => {
                if (axis === "X") {
                  game.gameBoard.stepMoveCurrentPolyominoX(step);
                } else if (axis === "Y") {
                  game.gameBoard.stepMoveCurrentPolyominoY(step);
                } else if (axis === "Z") {
                  game.gameBoard.stepMoveCurrentPolyominoZ(step);
                }
              },
            },
            `move`,
            step,
          )
          .name(`向${axis}轴${step > 0 ? "正向" : "负向"}移动`);
      });
    });
  }
  // 连块旋转控制
  {
    const rotatePolyominoFolder = folder.addFolder("连块旋转控制");
    ["X", "Y", "Z"].map((axis) => {
      [1, -1].map((step) => {
        rotatePolyominoFolder
          .add(
            {
              rotate: () => {
                if (axis === "X") {
                  game.gameBoard.stepRotateCurrentPolyominoX(step);
                } else if (axis === "Y") {
                  game.gameBoard.stepRotateCurrentPolyominoY(step);
                } else if (axis === "Z") {
                  game.gameBoard.stepRotateCurrentPolyominoZ(step);
                }
              },
            },
            `rotate`,
            step,
          )
          .name(`以${axis}轴${step > 0 ? "顺时针" : "逆时针"}旋转`);
      });
    });
  }
  // 连块旋转预览
  {
    const previewPolyominoFolder = folder.addFolder("连块旋转预览");
    ["X", "Y", "Z"].map((axis) => {
      [1, -1].map((step) => {
        previewPolyominoFolder
          .add(
            {
              preview: () => {
                if (axis === "X") {
                  game.gameBoard.stepRotateCurrentPolyominoPreview(step, 0, 0);
                } else if (axis === "Y") {
                  game.gameBoard.stepRotateCurrentPolyominoPreview(0, step, 0);
                } else if (axis === "Z") {
                  game.gameBoard.stepRotateCurrentPolyominoPreview(0, 0, step);
                }
              },
            },
            `preview`,
            step,
          )
          .name(`预览${axis}轴${step > 0 ? "顺时针" : "逆时针"}旋转`);
      });
    });
  }
};

export const initGui = (game: Game) => {
  addSceneGui(game);
  addGameGui(game);
  addBoardGui(game);
  addPolyominoGui(game);
};
