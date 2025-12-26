"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const MockIMU_1 = require("./MockIMU");
const PhysicsEngine_1 = require("../physics/PhysicsEngine");
(0, vitest_1.describe)('MockIMU', () => {
    (0, vitest_1.it)('should return approximately gravity on Z axis when stationary', async () => {
        const physics = new PhysicsEngine_1.MockPhysicsEngine(1.0);
        const imu = new MockIMU_1.MockIMU(physics);
        const data = await imu.read();
        // Stationary: Accel Z should be ~9.81 (reaction force) +/- noise
        (0, vitest_1.expect)(data.acceleration.z).toBeGreaterThan(9.0);
        (0, vitest_1.expect)(data.acceleration.z).toBeLessThan(11.0);
        (0, vitest_1.expect)(data.acceleration.x).toBeCloseTo(0, 0); // 0 decimals means +/- 0.5? No, checks closeness.
        // 0.05 noise sigma, so checking within 0.5 is safe
        (0, vitest_1.expect)(Math.abs(data.acceleration.x)).toBeLessThan(0.5);
    });
});
