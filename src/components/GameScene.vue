<template>
    <canvas class="game-canvas" ref="canvas"></canvas>
    <div class="ui-controller">
        <div>游戏控制</div>
        <button @click="game?.start">开始游戏</button>
        <button @click="game?.pause">暂停游戏</button>
        <button @click="game?.resume">继续游戏</button>
        <div>方块移动控制</div>
        <div>
            <button @click="game?.gameBoard?.stepMoveCurrentPolyominoZ(1)">↙️左下移</button>
            <button @click="game?.gameBoard?.stepMoveCurrentPolyominoZ(-1)">↗️右上移</button>
            <button @click="game?.gameBoard?.stepMoveCurrentPolyominoX(-1)">↖️左上移</button>
            <button @click="game?.gameBoard?.stepMoveCurrentPolyominoX(1)">↘️右下移</button>
            <button @click="game?.gameBoard?.tryDrop()">⬇️下移</button>
            <button @click="game?.gameBoard?.stepMoveCurrentPolyominoY(1)">⬆️上移</button>
        </div>
        <div>方块旋转控制</div>
        <div>
            <button @click="game?.gameBoard?.stepRotateCurrentPolyominoX(1)">X 轴逆</button>
            <button @click="game?.gameBoard?.stepRotateCurrentPolyominoX(-1)">X 轴顺</button>
            <button @click="game?.gameBoard?.stepRotateCurrentPolyominoY(1)">Y 轴逆</button>
            <button @click="game?.gameBoard?.stepRotateCurrentPolyominoY(-1)">Y 轴顺</button>
            <button @click="game?.gameBoard?.stepRotateCurrentPolyominoZ(1)">Z 轴逆</button>
            <button @click="game?.gameBoard?.stepRotateCurrentPolyominoZ(-1)">Z 轴顺</button>
        </div>
        <div>整体控制</div>
        <button @click="game?.gameBoard?.stepRotateOnCenter(1)">左转</button>
        <button @click="game?.gameBoard?.stepRotateOnCenter(-1)">右转</button>
        <button @click="game?.gameBoard?.hardDrop()">硬降</button>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue';
import Game from '../three/Game';
import { initGui } from '../three/gui';
const canvas = ref<HTMLCanvasElement | null>(null);
const game = shallowRef<Game | null>(null);

onMounted(() => {
    game.value = new Game(canvas.value!);
    if (game.value) {
        initGui(game.value);
    }
});
</script>
<style lang="less" scoped>
.game-canvas {
    width: 100%;
    height: 100%;
    display: block;
}

.ui-controller {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: rgba(255, 255, 255, 0.8);
}
</style>