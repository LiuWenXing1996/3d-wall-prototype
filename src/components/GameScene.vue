<template>
    <canvas class="game-canvas" ref="canvas"></canvas>
    <!-- <div ref="container"></div> -->
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as THREE from 'three';
import Cube from '../three/Cube';
import Game from '../three/Game';
import CubeGroup, { CubeGroupTypeEnum, type CubeGroupType } from '../three/CubeGroup';
import { addDevGui } from '../three/gui';
const container = ref<HTMLDivElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
// document.body.appendChild(renderer.domElement);

const box = new THREE.Group()

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const material2 = new THREE.MeshStandardMaterial({
    color: 0x999999,
    metalness: 1.0,//金属度
    roughness: 0.3,//粗糙度
    envMapIntensity: 1.0,
});
const cube = new THREE.Mesh(geometry, material2);
// const cube2 = new Cube(scene, 0x00ff00);
const cubeGroup = new CubeGroup(scene, CubeGroupTypeEnum.OrangeRicky);

Object.keys(CubeGroupTypeEnum).forEach((key, index) => {
    const cubeGroupType = key as CubeGroupType;
    const cubeGroup = new CubeGroup(scene, cubeGroupType);
    cubeGroup.group.position.set(index * 2 - 1, index, 0);
});
// scene.add(cube);

camera.position.z = 5;

function animate(time: number) {

    cubeGroup.group.rotation.x = time / 2000;
    cubeGroup.group.rotation.y = time / 1000;

    renderer.render(scene, camera);

}

onMounted(() => {
    // scene = new THREE.Scene();
    // camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // renderer = new THREE.WebGLRenderer();
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // container.value?.appendChild?.(renderer.domElement);
    const game = new Game(canvas.value!);
    addDevGui(game);

    // scene.add(camera);
    // camera.position.z = 5;
    // sphere = new THREE.SphereGeometry(1, 32, 32);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const sphereMesh = new THREE.Mesh(sphere, material);
    // scene.add(sphereMesh);
});
</script>
<style lang="less" scoped>
.game-canvas {
    width: 100%;
    height: 100%;
    display: block;
}
</style>