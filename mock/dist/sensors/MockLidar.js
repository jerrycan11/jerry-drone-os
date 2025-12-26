"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockLidar = void 0;
class MockLidar {
    physics;
    id = "lidar_0";
    type = 'LIDAR'; // Using explicit cast or string if type union not updated yet
    constructor(physics) {
        this.physics = physics;
    }
    async init() { console.log('Mock Lidar Init'); }
    async read() { return this.readData(); }
    async readData() {
        const pos = this.physics.getPosition();
        const points = [];
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
    async write() { }
    async dispose() { }
}
exports.MockLidar = MockLidar;
