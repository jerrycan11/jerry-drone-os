import { ISensorAdapter, IBarometerData, IHardwareAdapter } from '@drone-os/shared';
import { MockPhysicsEngine } from '../physics/PhysicsEngine';

export class MockBarometer implements ISensorAdapter<IBarometerData>, IHardwareAdapter {
  private physicsEngine: MockPhysicsEngine;
  private readonly seaLevelPressure = 1013.25; // hPa
  
  constructor(physicsEngine: MockPhysicsEngine) {
    this.physicsEngine = physicsEngine;
  }

  async init(): Promise<void> {
      console.log('Mock Barometer initialized.');
  }

  async read(): Promise<IBarometerData> {
      return this.readData();
  }

  async readData(): Promise<IBarometerData> {
    const altitude = this.physicsEngine.getPosition().z;
    
    // Simple barometric formula approximation
    // P = P0 * (1 - L*h/T0)^(g*M / R*L)
    // Simplified: P drops ~1hPa per 8.4m at sea level
    
    const pressure = this.seaLevelPressure * Math.pow((1 - (2.25577e-5 * altitude)), 5.25588);
    // Add some noise
    const noisyPressure = pressure + (Math.random() - 0.5) * 0.1;

    return {
      pressure: noisyPressure,
      temperature: 20 + Math.random(), // 20C
      altitude: altitude // In real sensor this is calculated from pressure, but here we return "true" altitude derived from pressure logic
    };
  }

  async write(data: unknown): Promise<void> {}
  async dispose(): Promise<void> {}
}
