<template>
    <canvas class="game-canvas" ref="canvas"></canvas>
    <!-- <div ref="container"></div> -->
    <div class="ui-controller">
        <div>游戏控制</div>
        <button @click="game?.start">开始游戏</button>
        <button @click="game?.pause">暂停游戏</button>
        <button @click="game?.resume">继续游戏</button>
        <div>产生新连块</div>
        <button @click="game?.gameBoard?.spawnPolyominoByType('I')">产生I连块</button>
        <button @click="game?.gameBoard?.spawnPolyominoByType('J')">产生J连块</button>
        <button @click="game?.gameBoard?.spawnPolyominoByType('L')">产生L连块</button>
        <button @click="game?.gameBoard?.spawnPolyominoByType('O')">产生O连块</button>
        <button @click="game?.gameBoard?.spawnPolyominoByType('S')">产生S连块</button>
        <button @click="game?.gameBoard?.spawnPolyominoByType('T')">产生T连块</button>
        <button @click="game?.gameBoard?.spawnPolyominoByType('Z')">产生Z连块</button>
        <div>方块控制</div>
        <div>
            <button @click="game?.gameBoard?.stepMoveCurrentPolyominoZ(1)">↙️左下移</button>
            <button @click="game?.gameBoard?.stepMoveCurrentPolyominoZ(-1)">↗️右上移</button>
            <button @click="game?.gameBoard?.stepMoveCurrentPolyominoX(-1)">↖️左上移</button>
            <button @click="game?.gameBoard?.stepMoveCurrentPolyominoX(1)">↘️右下移</button>
            <button @click="game?.gameBoard?.tryDrop()">⬇️下移</button>
            <button @click="game?.gameBoard?.stepMoveCurrentPolyominoY(1)">⬆️上移</button>
        </div>
        <div>
            <button @click="game?.gameBoard?.stepRotateCurrentPolyominoX(1)">x轴右旋</button>
            <button @click="game?.gameBoard?.stepRotateCurrentPolyominoPreview(1)">x轴预览右旋</button>
            <button @click="game?.gameBoard?.stepRotateCurrentPolyominoX(-1)">x轴左旋</button>
            <button @click="game?.gameBoard?.stepRotateCurrentPolyominoPreview(-1)">x轴预览左旋</button>
            <button @click="game?.gameBoard?.stepRotateCurrentPolyominoY(1)">y轴右旋</button>
            <button @click="game?.gameBoard?.stepRotateCurrentPolyominoPreview(0, 1)">y轴预览右旋</button>
            <button @click="game?.gameBoard?.stepRotateCurrentPolyominoY(-1)">y轴左旋</button>
            <button @click="game?.gameBoard?.stepRotateCurrentPolyominoPreview(0, -1)">y轴预览左旋</button>
            <button @click="game?.gameBoard?.stepRotateCurrentPolyominoZ(1)">z轴右旋</button>
            <button @click="game?.gameBoard?.stepRotateCurrentPolyominoPreview(0, 0, 1)">z轴预览右旋</button>
            <button @click="game?.gameBoard?.stepRotateCurrentPolyominoZ(-1)">z轴左旋</button>
            <button @click="game?.gameBoard?.stepRotateCurrentPolyominoPreview(0, 0, -1)">z轴预览左旋</button>
        </div>
        <div>整体控制</div>
        <button @click="game?.gameBoard?.stepRotateOnCenter(1)">左转</button>
        <button @click="game?.gameBoard?.stepRotateOnCenter(-1)">右转</button>
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