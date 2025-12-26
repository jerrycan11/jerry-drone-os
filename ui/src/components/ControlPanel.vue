<script setup lang="ts">
import { ref } from 'vue'
import { comms } from '../services/CommsLink'

const armed = ref(false)

function sendCommand(cmd: string) {
    const packet = JSON.stringify({ command: cmd })
    const encoder = new TextEncoder()
    comms.send(encoder.encode(packet))
    
    // Optimistic update for UI state (in reality, should wait for ack/telemetry)
    if (cmd === 'ARM') armed.value = true;
    if (cmd === 'DISARM') armed.value = false;
}
</script>

<template>
  <div class="control-panel">
    <div class="status-led" :class="{ armed: armed }">
        {{ armed ? 'ARMED' : 'DISARMED' }}
    </div>
    
    <div class="buttons">
        <button class="btn arm" @click="sendCommand('ARM')" :disabled="armed">ARM</button>
        <button class="btn disarm" @click="sendCommand('DISARM')" :disabled="!armed">DISARM</button>
    </div>
  </div>
</template>

<style scoped>
.control-panel {
    background: #252526;
    padding: 15px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.status-led {
    text-align: center;
    background: #333;
    padding: 10px;
    border-radius: 4px;
    font-weight: bold;
    color: #888;
    border: 2px solid #555;
}

.status-led.armed {
    background: #520000;
    color: #ff5555;
    border-color: #ff0000;
    animation: pulse 1s infinite;
}

.buttons {
    display: flex;
    gap: 10px;
}

.btn {
    flex: 1;
    padding: 15px;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    font-family: inherit;
    opacity: 0.8;
    transition: opacity 0.2s;
}

.btn:hover:not(:disabled) {
    opacity: 1;
}

.btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.arm {
    background: #4CAF50;
    color: white;
}

.disarm {
    background: #f44336;
    color: white;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
}
</style>
