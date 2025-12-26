"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const PhysicsEngine_1 = require("../physics/PhysicsEngine");
const MockLidar_1 = require("./MockLidar");
(0, vitest_1.describe)('MockLidar', () => {
    (0, vitest_1.it)('should detect obstacles', async () => {
        console.log('TEST: Starting MockLidar test');
        const physics = new PhysicsEngine_1.MockPhysicsEngine();
        console.log('TEST: Physics Engine created');
        // Add a wall at x=10
        physics.addObstacle(9.5, 10.5, -10, 10, -10, 10);
        console.log('TEST: Obstacle added');
        const lidar = new MockLidar_1.MockLidar(physics);
        console.log('TEST: Lidar created, reading data...');
        const scan = await lidar.readData();
        console.log(`TEST: Data read. Points: ${scan.points.length}`);
        // We expect at least one point near x=9.5 for the forward ray (1,0,0)
        const hit = scan.points.find(p => p.x > 9.0 && p.x < 10.0 && Math.abs(p.y) < 1);
        (0, vitest_1.expect)(hit).toBeDefined();
        if (hit) {
            (0, vitest_1.expect)(hit.x).toBeCloseTo(9.5, 0);
        }
    });
    (0, vitest_1.it)('should return empty if no obstacles', async () => {
        const physics = new PhysicsEngine_1.MockPhysicsEngine(); // Empty world
        const lidar = new MockLidar_1.MockLidar(physics);
        const scan = await lidar.readData();
        (0, vitest_1.expect)(scan.points.length).toBe(0);
    });
});
