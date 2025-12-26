import { ISensorAdapter, IBarometerData, IHardwareAdapter } from '@drone-os/shared';
import { MockPhysicsEngine } from '../physics/PhysicsEngine';
export declare class MockBarometer implements ISensorAdapter<IBarometerData>, IHardwareAdapter {
    private physicsEngine;
    private readonly seaLevelPressure;
    constructor(physicsEngine: MockPhysicsEngine);
    init(): Promise<void>;
    read(): Promise<IBarometerData>;
    readData(): Promise<IBarometerData>;
    write(data: unknown): Promise<void>;
    dispose(): Promise<void>;
}
