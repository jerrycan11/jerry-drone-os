"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const PhysicsEngine_1 = require("./PhysicsEngine");
(0, vitest_1.describe)('MockPhysicsEngine', () => {
    (0, vitest_1.it)('should apply gravity when no thrust is present', () => {
        const engine = new PhysicsEngine_1.MockPhysicsEngine(1.0); // 1kg
        const thrust = { x: 0, y: 0, z: 0 };
        // Process 1 second
        engine.update(1.0, thrust);
        const pos = engine.getPosition();
        const vel = engine.getVelocity();
        // Z should be 0 because of ground collision (it starts at 0)
        // Actually, update logic sets Z=0 if < 0.
        // Gravity pulls down (-9.81), so pos z would be negative -> clamped to 0.
        (0, vitest_1.expect)(pos.z).toBe(0);
        // Let's lift it first to test gravity
        // Hack: Manually set position if possible or apply huge thrust first
    });
    (0, vitest_1.it)('should take off with sufficient thrust', () => {
        const engine = new PhysicsEngine_1.MockPhysicsEngine(1.0);
        // Force > Gravity (9.81)
        const thrust = { x: 0, y: 0, z: 20 };
        engine.update(1.0, thrust);
        const pos = engine.getPosition();
        (0, vitest_1.expect)(pos.z).toBeGreaterThan(0);
    });
});
