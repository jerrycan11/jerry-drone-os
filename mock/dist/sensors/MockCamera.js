"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockCamera = void 0;
class MockCamera {
    physics;
    id = "cam_0";
    type = 'CAMERA';
    lastPos = { x: 0, y: 0, z: 0 };
    constructor(physics) {
        this.physics = physics;
        this.lastPos = { ...physics.getPosition() };
    }
    async init() { }
    async read() { return this.readData(); }
    async readData() {
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
    async write() { }
    async dispose() { }
}
exports.MockCamera = MockCamera;
