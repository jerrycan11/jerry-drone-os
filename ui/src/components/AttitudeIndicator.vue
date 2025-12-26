<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  pitch: number // degrees
  roll: number // degrees
}>()

const horizonStyle = computed(() => {
  return {
    transform: `rotate(${-props.roll}deg) translateY(${props.pitch * 2}px)`
  }
})
</script>

<template>
  <div class="attitude-indicator">
    <div class="sky"></div>
    <div class="ground"></div>
    <div class="horizon" :style="horizonStyle">
      <div class="horizon-line"></div>
    </div>
    <div class="hud-overlay">
      <div class="center-cross"></div>
      <div class="roll-ring"></div>
    </div>
  </div>
</template>

<style scoped>
.attitude-indicator {
  position: relative;
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: 10px;
  background: #000;
  border: 2px solid #555;
}

.sky {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 300px;
  background: linear-gradient(#00BFFF, #1E90FF);
  transform: translateY(-50%); /* Start centered-ish */
  z-index: 1;
}

.ground {
  /* Using sky/ground as background of the moving horizon container instead? 
     Let's try a simpler approach: A single rotating/translating container.
  */
  display: none; 
}

/* Simplified approach: The horizon container rotates and moves */
.horizon {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(to bottom, #1E90FF 50%, #8B4513 50%);
  z-index: 0;
  /* transform set in script */
  transition: transform 0.1s linear;
}

.horizon-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: white;
}

.hud-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-cross {
  width: 20px;
  height: 20px;
  border: 2px solid yellow;
  border-radius: 50%;
}

.roll-ring {
  position: absolute;
  top: 10px;
  width: 180px;
  height: 180px;
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 50%;
  clip-path: polygon(0 0, 100% 0, 100% 40%, 0 40%); /* Top arc */
}
</style>
