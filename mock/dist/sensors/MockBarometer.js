"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockBarometer = void 0;
class MockBarometer {
    physicsEngine;
    seaLevelPressure = 1013.25; // hPa
    constructor(physicsEngine) {
        this.physicsEngine = physicsEngine;
    }
    async init() {
        console.log('Mock Barometer initialized.');
    }
    async read() {
        return this.readData();
    }
    async readData() {
        const altitude = this.physicsEngine.getPosition().z;
        // Simple barometric formula approximation
        // P = P0 * (1 - L*h/T0)^(g*M / R*L)
        // Simplified: P drops ~1hPa per 8.4m at sea level
        const pressure = this.seaLevelPressure * Math.pow((1 - (2.25577e-5 * altitude)), 5.25588);
        // Add some noise
        const noisyPressure = pressure + (Math.random() - 0.5) * 0.1;
        return {
            pressure: noisyPressure,
            temperature: 20 + Math.random(), // 20C
            altitude: altitude // In real sensor this is calculated from pressure, but here we return "true" altitude derived from pressure logic
        };
    }
    async write(data) { }
    async dispose() { }
}
exports.MockBarometer = MockBarometer;
