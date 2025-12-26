import { ISensorAdapter, IHardwareAdapter, IVector3 } from '@drone-os/shared';
import { MockPhysicsEngine } from '../physics/PhysicsEngine';

export interface ILidarScan {
    points: IVector3[];
}

export class MockLidar implements ISensorAdapter<ILidarScan>, IHardwareAdapter {
    id = "lidar_0";
    type: 'LIDAR' = 'LIDAR' as any; // Using explicit cast or string if type union not updated yet

    constructor(private physics: MockPhysicsEngine) {}

    async init(): Promise<void> { console.log('Mock Lidar Init'); }
    async read(): Promise<ILidarScan> { return this.readData(); }
    
    async readData(): Promise<ILidarScan> {
        const pos = this.physics.getPosition();
        const points: IVector3[] = [];
        
        // Simple 360 scan planar (2D lidar style for simplicity in this 3D world)
        // 8 rays
        const directions = [
            { x: 1, y: 0, z: 0 },
            { x: -1, y: 0, z: 0 },
            { x: 0, y: 1, z: 0 },
            { x: 0, y: -1, z: 0 },
            { x: 0.7, y: 0.7, z: 0 },
            { x: -0.7, y: 0.7, z: 0 },
            { x: 0.7, y: -0.7, z: 0 },
            { x: -0.7, y: -0.7, z: 0 }
        ];

        for (const dir of directions) {
            const dist = this.physics.raycast(pos, dir, 20); // 20m range
            if (dist > 0) {
                points.push({
                    x: pos.x + dir.x * dist,
                    y: pos.y + dir.y * dist,
                    z: pos.z + dir.z * dist
                });
            }
        }

        return { points };
    }

    async write(): Promise<void> {}
    async dispose(): Promise<void> {}
}
