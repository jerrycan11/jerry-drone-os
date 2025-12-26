"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockIMU = void 0;
class MockIMU {
    physicsEngine;
    temperature = 40.0; // Steady state operating temp
    // Noise config (standard deviation)
    accelNoiseSigma = 0.05; // m/s^2
    gyroNoiseSigma = 0.01; // rad/s
    biasDriftRate = 0.0001; // rad/s per second
    gyroBias = { x: 0, y: 0, z: 0 };
    constructor(physicsEngine) {
        this.physicsEngine = physicsEngine;
    }
    async init() {
        console.log('Mock IMU initialized.');
    }
    async read() {
        return this.readData();
    }
    async readData() {
        const trueAccel = this.physicsEngine.getAcceleration();
        // In a real IMU, the accelerometer also measures gravity as an upward force when stationary on earth
        // Gravity in ENU is -9.81 Z. Accelerometer reacting to normal force measures +9.81 Z when sitting flat.
        // Simplifying: Accel_measured = True_Accel - Gravity_Vector + Noise
        // Gravity Vector is (0, 0, -9.81)
        // We need to inject noise
        const noisyAccel = {
            x: trueAccel.x + this.gaussianNoise(0, this.accelNoiseSigma),
            y: trueAccel.y + this.gaussianNoise(0, this.accelNoiseSigma),
            z: trueAccel.z + 9.81 + this.gaussianNoise(0, this.accelNoiseSigma) // Adding gravity component
        };
        // Gyro measures angular velocity.
        // Physics engine doesn't explicitly track angular, let's assume 0 for now unless we upgrade physics
        const trueAngularVelocity = { x: 0, y: 0, z: 0 };
        // Drift update (simplified random walk)
        this.gyroBias.x += this.gaussianNoise(0, this.biasDriftRate);
        this.gyroBias.y += this.gaussianNoise(0, this.biasDriftRate);
        this.gyroBias.z += this.gaussianNoise(0, this.biasDriftRate);
        const noisyGyro = {
            x: trueAngularVelocity.x + this.gyroBias.x + this.gaussianNoise(0, this.gyroNoiseSigma),
            y: trueAngularVelocity.y + this.gyroBias.y + this.gaussianNoise(0, this.gyroNoiseSigma),
            z: trueAngularVelocity.z + this.gyroBias.z + this.gaussianNoise(0, this.gyroNoiseSigma),
        };
        return {
            acceleration: noisyAccel,
            gyro: noisyGyro,
            temperature: this.temperature + Math.random() * 0.5
        };
    }
    async write(data) { }
    async dispose() { }
    // Box-Muller transform for Gaussian noise
    gaussianNoise(mean, stdDev) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return z0 * stdDev + mean;
    }
}
exports.MockIMU = MockIMU;
