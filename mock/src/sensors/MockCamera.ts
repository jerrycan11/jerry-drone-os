import { ISensorAdapter, IHardwareAdapter, IVector3 } from '@drone-os/shared';
import { MockPhysicsEngine } from '../physics/PhysicsEngine';

export interface IVIOData {
    deltaPosition: IVector3; // Movement since last frame
    confidence: number;
}

export class MockCamera implements ISensorAdapter<IVIOData>, IHardwareAdapter {
    id = "cam_0";
    type: 'CAMERA' = 'CAMERA' as any;

    private lastPos: IVector3 = {x:0, y:0, z:0};

    constructor(private physics: MockPhysicsEngine) {
        this.lastPos = { ...physics.getPosition() };
    }

    async init(): Promise<void> {}
    async read(): Promise<IVIOData> { return this.readData(); }
    
    async readData(): Promise<IVIOData> {
        const current = this.physics.getPosition();
        
        // Calculate true delta
        const delta = {
            x: current.x - this.lastPos.x,
            y: current.y - this.lastPos.y,
            z: current.z - this.lastPos.z
        };

        this.lastPos = { ...current };

        // Add Noise (Optical Flow error)
        // 1% error
        const noiseX = (Math.random() - 0.5) * 0.01;
        const noiseY = (Math.random() - 0.5) * 0.01;

        return {
            deltaPosition: {
                x: delta.x + noiseX,
                y: delta.y + noiseY,
                z: delta.z
            },
            confidence: 0.9 + Math.random() * 0.1
        };
    }

    async write(): Promise<void> {}
    async dispose(): Promise<void> {}
}
