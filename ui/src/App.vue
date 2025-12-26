<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { comms } from './services/CommsLink'
import AttitudeIndicator from './components/AttitudeIndicator.vue'
import MetricsGrid from './components/MetricsGrid.vue'
import ControlPanel from './components/ControlPanel.vue'


const connected = ref(false)
const telemetry = reactive({
  pitch: 0,
  roll: 0,
  altitude: 0,
  velocityZ: 0,
  voltage: 0,
  rssi: -50
})

const decoder = new TextDecoder()

onMounted(() => {
  comms.onConnectionChange((status) => {
    connected.value = status
  })
  
  comms.onMessage((data) => {
    try {
      const text = decoder.decode(data)
      const msg = JSON.parse(text)
      
      telemetry.pitch = msg.pitch || 0
      telemetry.roll = msg.roll || 0
      telemetry.altitude = msg.alt || 0
      telemetry.velocityZ = msg.velZ || 0
      telemetry.voltage = msg.battVoltage || 0
      // Mocking RSSI variation on client for now if not in packet
      telemetry.rssi = -60 + (Math.random() * 5)
    } catch (e) {
      console.error('Failed to parse telemetry', e)
    }
  })

  comms.connect()
})
</script>

<template>
  <div class="layout">
    <header class="header">
      <div class="brand">
        <h1>Jerry Drone GCS</h1>
      </div>
      <div class="status">
        <span class="indicator" :class="{ active: connected }"></span>
        {{ connected ? 'ONLINE' : 'OFFLINE' }}
      </div>
    </header>
    
    <div class="container">
      <aside class="sidebar">
        <nav>
          <a href="#" class="active">Dashboard</a>
          <a href="#">Mission</a>
          <a href="#">Config</a>
        </nav>
      </aside>
      
      <main class="content">
        <div class="dashboard-grid" v-if="connected">
            <div class="panel">
                <h3>PFD</h3>
                <AttitudeIndicator :pitch="telemetry.pitch" :roll="telemetry.roll" />
            </div>
            
            <div class="panel">
                <h3>Telemetry</h3>
                <MetricsGrid 
                    :altitude="telemetry.altitude"
                    :velocityZ="telemetry.velocityZ"
                    :voltage="telemetry.voltage"
                    :rssi="telemetry.rssi"
                />
            </div>

            <div class="panel">
                <h3>Controls</h3>
                <ControlPanel />
            </div>
        </div>
        <div v-else class="waiting">
            <p>Waiting for Telemetry Link...</p>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #1e1e1e;
  color: #fff;
  font-family: 'Inter', sans-serif;
}

.header {
  height: 60px;
  background: #252526;
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.brand h1 {
  font-size: 1.2rem;
  margin: 0;
  color: #4CAF50;
}

.status {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #aaa;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f44336;
}

.indicator.active {
  background: #4CAF50;
  box-shadow: 0 0 8px #4CAF50;
}

.container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  background: #252526;
  border-right: 1px solid #333;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.sidebar a {
  color: #ccc;
  text-decoration: none;
  padding: 10px;
  border-radius: 4px;
  transition: background 0.2s;
}

.sidebar a:hover {
  background: #2d2d30;
  color: #fff;
}

.sidebar a.active {
  background: #37373d;
  color: #fff;
}

.content {
  flex: 1;
  padding: 20px;
  background: #1e1e1e;
}

.dashboard-grid {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.panel h3 {
    margin-top: 0;
    color: #888;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.waiting {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #555;
    font-size: 1.2rem;
}
</style>
