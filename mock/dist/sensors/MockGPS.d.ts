import { ISensorAdapter, IGPSData, IHardwareAdapter } from '@drone-os/shared';
import { MockPhysicsEngine } from '../physics/PhysicsEngine';
export declare class MockGPS implements ISensorAdapter<IGPSData>, IHardwareAdapter {
    private physicsEngine;
    private readonly originLat;
    private readonly originLon;
    private readonly metersPerDegreeLat;
    private gpsDrift;
    private readonly driftSpeed;
    constructor(physicsEngine: MockPhysicsEngine);
    init(): Promise<void>;
    read(): Promise<IGPSData>;
    readData(): Promise<IGPSData>;
    write(data: unknown): Promise<void>;
    dispose(): Promise<void>;
}
