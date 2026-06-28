<script setup lang="ts">
import ThreeTest from './components/ThreeTest.vue'
import GameScene from './components/GameScene.vue'
</script>

<template>
  <!-- <ThreeTest /> -->
  <div class="game-container">
    <GameScene />
  </div>

</template>
<style lang="less" scoped>
.game-container {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}
</style>
