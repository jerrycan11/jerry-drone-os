import { ISensorAdapter, IHardwareAdapter, IVector3 } from '@drone-os/shared';
import { MockPhysicsEngine } from '../physics/PhysicsEngine';
export interface IVIOData {
    deltaPosition: IVector3;
    confidence: number;
}
export declare class MockCamera implements ISensorAdapter<IVIOData>, IHardwareAdapter {
    private physics;
    id: string;
    type: 'CAMERA';
    private lastPos;
    constructor(physics: MockPhysicsEngine);
    init(): Promise<void>;
    read(): Promise<IVIOData>;
    readData(): Promise<IVIOData>;
    write(): Promise<void>;
    dispose(): Promise<void>;
}
