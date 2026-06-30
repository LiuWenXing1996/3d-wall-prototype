<template>
    <canvas class="game-canvas" ref="canvas"></canvas>
    <!-- <div ref="container"></div> -->
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Game from '../three/Game';
import { initGui } from '../three/gui';
const canvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
    const game = new Game(canvas.value!);
    initGui(game);
});
</script>
<style lang="less" scoped>
.game-canvas {
    width: 100%;
    height: 100%;
    display: block;
}
</style>