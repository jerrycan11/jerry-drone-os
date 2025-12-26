<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  altitude: number
  velocityZ: number
  voltage: number
  rssi: number
}>()

const battColor = computed(() => props.voltage < 14.0 ? 'red' : 'green')
</script>

<template>
  <div class="metrics-grid">
    <div class="metric">
        <label>Altitude</label>
        <span class="value">{{ altitude.toFixed(1) }} <small>m</small></span>
    </div>
    <div class="metric">
        <label>Vert Spd</label>
        <span class="value">{{ velocityZ.toFixed(1) }} <small>m/s</small></span>
    </div>
    <div class="metric">
        <label>Battery</label>
        <span class="value" :style="{ color: battColor }">{{ voltage.toFixed(1) }} <small>V</small></span>
    </div>
    <div class="metric">
        <label>RSSI</label>
        <span class="value">{{ rssi }} <small>dBm</small></span>
    </div>
  </div>
</template>

<style scoped>
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  background: #252526;
  padding: 10px;
  border-radius: 8px;
}

.metric {
  display: flex;
  flex-direction: column;
  background: #333;
  padding: 8px;
  border-radius: 4px;
}

.metric label {
  font-size: 0.8rem;
  color: #aaa;
  margin-bottom: 4px;
}

.metric .value {
  font-size: 1.2rem;
  font-weight: bold;
  font-family: monospace;
}

.metric small {
  font-size: 0.8rem;
  font-weight: normal;
  color: #888;
}
</style>
