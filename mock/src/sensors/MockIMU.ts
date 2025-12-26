import { ISensorAdapter, IIMUData, IVector3, IHardwareAdapter } from '@drone-os/shared';
import { MockPhysicsEngine } from '../physics/PhysicsEngine';

export class MockIMU implements ISensorAdapter<IIMUData>, IHardwareAdapter {
  private physicsEngine: MockPhysicsEngine;
  private temperature: number = 40.0; // Steady state operating temp

  // Noise config (standard deviation)
  private readonly accelNoiseSigma = 0.05; // m/s^2
  private readonly gyroNoiseSigma = 0.01; // rad/s
  private readonly biasDriftRate = 0.0001; // rad/s per second

  private gyroBias: IVector3 = { x: 0, y: 0, z: 0 };

  constructor(physicsEngine: MockPhysicsEngine) {
    this.physicsEngine = physicsEngine;
  }

  async init(): Promise<void> {
    console.log('Mock IMU initialized.');
  }

  async read(): Promise<IIMUData> {
    return this.readData();
  }

  async readData(): Promise<IIMUData> {
    const trueAccel = this.physicsEngine.getAcceleration();
    // In a real IMU, the accelerometer also measures gravity as an upward force when stationary on earth
    // Gravity in ENU is -9.81 Z. Accelerometer reacting to normal force measures +9.81 Z when sitting flat.
    // Simplifying: Accel_measured = True_Accel - Gravity_Vector + Noise
    // Gravity Vector is (0, 0, -9.81)
    
    // We need to inject noise
    const noisyAccel: IVector3 = {
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

    const noisyGyro: IVector3 = {
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

  async write(data: unknown): Promise<void> {}
  async dispose(): Promise<void> {}

  // Box-Muller transform for Gaussian noise
  private gaussianNoise(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdDev + mean;
  }
}
