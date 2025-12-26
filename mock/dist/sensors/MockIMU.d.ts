import { ISensorAdapter, IIMUData, IHardwareAdapter } from '@drone-os/shared';
import { MockPhysicsEngine } from '../physics/PhysicsEngine';
export declare class MockIMU implements ISensorAdapter<IIMUData>, IHardwareAdapter {
    private physicsEngine;
    private temperature;
    private readonly accelNoiseSigma;
    private readonly gyroNoiseSigma;
    private readonly biasDriftRate;
    private gyroBias;
    constructor(physicsEngine: MockPhysicsEngine);
    init(): Promise<void>;
    read(): Promise<IIMUData>;
    readData(): Promise<IIMUData>;
    write(data: unknown): Promise<void>;
    dispose(): Promise<void>;
    private gaussianNoise;
}
