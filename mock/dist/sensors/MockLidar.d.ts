import { ISensorAdapter, IHardwareAdapter, IVector3 } from '@drone-os/shared';
import { MockPhysicsEngine } from '../physics/PhysicsEngine';
export interface ILidarScan {
    points: IVector3[];
}
export declare class MockLidar implements ISensorAdapter<ILidarScan>, IHardwareAdapter {
    private physics;
    id: string;
    type: 'LIDAR';
    constructor(physics: MockPhysicsEngine);
    init(): Promise<void>;
    read(): Promise<ILidarScan>;
    readData(): Promise<ILidarScan>;
    write(): Promise<void>;
    dispose(): Promise<void>;
}
