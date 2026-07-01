<template>
    <canvas class="game-canvas" ref="canvas"></canvas>
    <!-- <div ref="container"></div> -->
    <div class="ui-controller">
        <div>游戏控制</div>
        <button @click="game?.start">开始游戏</button>
        <button @click="game?.pause">暂停游戏</button>
        <button @click="game?.resume">继续游戏</button>
        <div>方块控制</div>
        <div>
            <button @click="game?.gameWorld?.stepMoveCurrentPolyominoZ(1)">↙️左下移</button>
            <button @click="game?.gameWorld?.stepMoveCurrentPolyominoZ(-1)">↗️右上移</button>
            <button @click="game?.gameWorld?.stepMoveCurrentPolyominoX(-1)">↖️左上移</button>
            <button @click="game?.gameWorld?.stepMoveCurrentPolyominoX(1)">↘️右下移</button>
            <button @click="game?.gameWorld?.tryDrop()">⬇️下移</button>
            <button @click="game?.gameWorld?.stepMoveCurrentPolyominoY(1)">⬆️上移</button>
        </div>
        <div>
            <button @click="game?.currentTetromino?.rotate(-1)">
                <img :src="rotateImg" class="base" width="30" height="30" alt="" />
                <span>竖直-右旋</span>
            </button>
        </div>
        <div>整体控制</div>
        <button @click="game?.gameWorld?.stepRotateOnCenter(1)">左转</button>
        <button @click="game?.gameWorld?.stepRotateOnCenter(-1)">右转</button>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue';
import Game from '../three/Game';
import { initGui } from '../three/gui';
import rotateImg from '../assets/竖直-右旋.svg'
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