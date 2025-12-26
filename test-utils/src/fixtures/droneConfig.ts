/**
 * Test Fixtures: Drone Configuration
 * 
 * Pre-defined drone configurations for testing various scenarios.
 */

export interface DroneConfig {
  id: string;
  type: 'QUADCOPTER' | 'HEXACOPTER' | 'OCTOCOPTER' | 'FIXEDWING';
  motorCount: number;
  maxThrust: number;      // Newtons per motor
  mass: number;           // kg
  maxSpeed: number;       // m/s
  maxAltitude: number;    // meters
  batteryCapacity: number;// mAh
  batteryCells: number;
  sensorConfig: SensorConfig;
  safetyLimits: SafetyLimits;
}

export interface SensorConfig {
  hasGPS: boolean;
  hasIMU: boolean;
  hasBarometer: boolean;
  hasMagnetometer: boolean;
  hasLidar: boolean;
  hasCamera: boolean;
  hasOpticalFlow: boolean;
}

export interface SafetyLimits {
  maxRollAngle: number;    // degrees
  maxPitchAngle: number;   // degrees
  maxYawRate: number;      // degrees/second
  minBatteryVoltage: number;
  rthBatteryPercent: number;
  geofenceRadius: number;  // meters
  maxWindSpeed: number;    // m/s
}

/**
 * Standard quadcopter configuration.
 */
export const STANDARD_QUADCOPTER: DroneConfig = {
  id: 'drone-quad-01',
  type: 'QUADCOPTER',
  motorCount: 4,
  maxThrust: 15,
  mass: 1.5,
  maxSpeed: 20,
  maxAltitude: 120,
  batteryCapacity: 5000,
  batteryCells: 4,
  sensorConfig: {
    hasGPS: true,
    hasIMU: true,
    hasBarometer: true,
    hasMagnetometer: true,
    hasLidar: false,
    hasCamera: true,
    hasOpticalFlow: false
  },
  safetyLimits: {
    maxRollAngle: 45,
    maxPitchAngle: 45,
    maxYawRate: 180,
    minBatteryVoltage: 13.2,
    rthBatteryPercent: 20,
    geofenceRadius: 500,
    maxWindSpeed: 10
  }
};

/**
 * Enterprise survey drone with full sensor suite.
 */
export const ENTERPRISE_DRONE: DroneConfig = {
  id: 'drone-ent-01',
  type: 'HEXACOPTER',
  motorCount: 6,
  maxThrust: 20,
  mass: 3.5,
  maxSpeed: 15,
  maxAltitude: 150,
  batteryCapacity: 10000,
  batteryCells: 6,
  sensorConfig: {
    hasGPS: true,
    hasIMU: true,
    hasBarometer: true,
    hasMagnetometer: true,
    hasLidar: true,
    hasCamera: true,
    hasOpticalFlow: true
  },
  safetyLimits: {
    maxRollAngle: 35,
    maxPitchAngle: 35,
    maxYawRate: 120,
    minBatteryVoltage: 19.8,
    rthBatteryPercent: 25,
    geofenceRadius: 1000,
    maxWindSpeed: 8
  }
};

/**
 * Racing/agility drone configuration.
 */
export const RACING_DRONE: DroneConfig = {
  id: 'drone-race-01',
  type: 'QUADCOPTER',
  motorCount: 4,
  maxThrust: 25,
  mass: 0.8,
  maxSpeed: 40,
  maxAltitude: 100,
  batteryCapacity: 1500,
  batteryCells: 4,
  sensorConfig: {
    hasGPS: true,
    hasIMU: true,
    hasBarometer: true,
    hasMagnetometer: true,
    hasLidar: false,
    hasCamera: true,
    hasOpticalFlow: false
  },
  safetyLimits: {
    maxRollAngle: 75,
    maxPitchAngle: 75,
    maxYawRate: 360,
    minBatteryVoltage: 13.2,
    rthBatteryPercent: 15,
    geofenceRadius: 200,
    maxWindSpeed: 15
  }
};

/**
 * Minimal/degraded configuration for failsafe testing.
 */
export const DEGRADED_DRONE: DroneConfig = {
  id: 'drone-degraded-01',
  type: 'QUADCOPTER',
  motorCount: 4,
  maxThrust: 15,
  mass: 1.5,
  maxSpeed: 10,
  maxAltitude: 50,
  batteryCapacity: 5000,
  batteryCells: 4,
  sensorConfig: {
    hasGPS: false,      // GPS denied
    hasIMU: true,
    hasBarometer: true,
    hasMagnetometer: false,  // Interference
    hasLidar: false,
    hasCamera: false,
    hasOpticalFlow: true     // Fallback navigation
  },
  safetyLimits: {
    maxRollAngle: 30,
    maxPitchAngle: 30,
    maxYawRate: 90,
    minBatteryVoltage: 14.0,  // More conservative
    rthBatteryPercent: 30,
    geofenceRadius: 100,
    maxWindSpeed: 5
  }
};

/**
 * Creates a swarm of identical drones with unique IDs.
 */
export function createDroneSwarm(
  baseConfig: DroneConfig,
  count: number
): DroneConfig[] {
  const swarm: DroneConfig[] = [];
  
  for (let i = 1; i <= count; i++) {
    swarm.push({
      ...baseConfig,
      id: `${baseConfig.id}-swarm-${i.toString().padStart(3, '0')}`
    });
  }
  
  return swarm;
}

/**
 * Creates a drone config with specific sensor failures.
 */
export function createSensorFailureConfig(
  baseConfig: DroneConfig,
  failedSensors: (keyof SensorConfig)[]
): DroneConfig {
  const sensorConfig = { ...baseConfig.sensorConfig };
  
  for (const sensor of failedSensors) {
    sensorConfig[sensor] = false;
  }
  
  return {
    ...baseConfig,
    id: `${baseConfig.id}-sensor-failure`,
    sensorConfig
  };
}
