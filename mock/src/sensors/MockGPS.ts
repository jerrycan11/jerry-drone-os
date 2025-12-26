import { ISensorAdapter, IGPSData, IVector3, IHardwareAdapter } from '@drone-os/shared';
import { MockPhysicsEngine } from '../physics/PhysicsEngine';

export class MockGPS implements ISensorAdapter<IGPSData>, IHardwareAdapter {
  private physicsEngine: MockPhysicsEngine;
  
  // Base location (e.g., San Francisco)
  private readonly originLat = 37.7749;
  private readonly originLon = -122.4194;
  private readonly metersPerDegreeLat = 111320;
  
  // Drift config
  private gpsDrift: IVector3 = { x: 0, y: 0, z: 0 };
  private readonly driftSpeed = 0.5; // m/s wandering

  constructor(physicsEngine: MockPhysicsEngine) {
    this.physicsEngine = physicsEngine;
  }

  async init(): Promise<void> {
    console.log('Mock GPS initialized.');
  }

  async read(): Promise<IGPSData> {
      return this.readData();
  }

  async readData(): Promise<IGPSData> {
    const localPos = this.physicsEngine.getPosition();
    
    // Update drift (random walk)
    this.gpsDrift.x += (Math.random() - 0.5) * this.driftSpeed;
    this.gpsDrift.y += (Math.random() - 0.5) * this.driftSpeed;
    this.gpsDrift.z += (Math.random() - 0.5) * (this.driftSpeed * 0.2); // Less drift in vertical

    const totalX = localPos.x + this.gpsDrift.x;
    const totalY = localPos.y + this.gpsDrift.y;
    
    // Convert local meters to Lat/Lon
    const metersPerDegreeLon = this.metersPerDegreeLat * Math.cos(this.originLat * (Math.PI / 180));
    
    const lat = this.originLat + (totalY / this.metersPerDegreeLat);
    const lon = this.originLon + (totalX / metersPerDegreeLon);
    const alt = localPos.z + this.gpsDrift.z;

    return {
      latitude: lat,
      longitude: lon,
      altitude: alt,
      satellites: 8 + Math.floor(Math.random() * 4), // 8-12 sats
      hdop: 1.0 + Math.random() * 0.5,
      fixType: '3D_FIX'
    };
  }

  async write(data: unknown): Promise<void> {}
  async dispose(): Promise<void> {}
}
