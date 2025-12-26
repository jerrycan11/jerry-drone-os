import { describe, it, expect } from 'vitest';
import { MockIMU } from './MockIMU';
import { MockPhysicsEngine } from '../physics/PhysicsEngine';

describe('MockIMU', () => {
  it('should return approximately gravity on Z axis when stationary', async () => {
    const physics = new MockPhysicsEngine(1.0);
    const imu = new MockIMU(physics);
    
    const data = await imu.read();
    
    // Stationary: Accel Z should be ~9.81 (reaction force) +/- noise
    expect(data.acceleration.z).toBeGreaterThan(9.0);
    expect(data.acceleration.z).toBeLessThan(11.0);
    
    expect(data.acceleration.x).toBeCloseTo(0, 0); // 0 decimals means +/- 0.5? No, checks closeness.
    // 0.05 noise sigma, so checking within 0.5 is safe
    expect(Math.abs(data.acceleration.x)).toBeLessThan(0.5);
  });
});
