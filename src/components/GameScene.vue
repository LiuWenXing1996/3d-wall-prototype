<template>
    <canvas class="game-canvas" ref="canvas"></canvas>
    <!-- <div ref="container"></div> -->
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
</style>