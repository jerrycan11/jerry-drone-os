"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockMotor = void 0;
class MockMotor {
    id;
    position;
    direction;
    maxRPM;
    currentRPM = 0;
    throttle = 0;
    // Simulation parameters
    spinUpTimeSeconds = 0.5; // Time to reach full speed
    constructor(id, position, direction, maxRPM = 10000) {
        this.id = id;
        this.position = position;
        this.direction = direction;
        this.maxRPM = maxRPM;
    }
    // IHardwareAdapter implementation
    async init() {
        console.log(`Motor ${this.id} initialized.`);
    }
    async read() {
        return { rpm: this.currentRPM };
    }
    async write(data) {
        // no-op, use setThrottle
    }
    async dispose() {
        this.currentRPM = 0;
        console.log(`Motor ${this.id} shutdown.`);
    }
    // IMotorAdapter implementation
    async setThrottle(percent) {
        this.throttle = Math.max(0, Math.min(1.0, percent));
    }
    async getRPM() {
        return this.currentRPM;
    }
    // Simulation tick
    update(deltaTimeSeconds) {
        const targetRPM = this.throttle * this.maxRPM;
        const rpmRef = this.currentRPM;
        // Simple exponential approach to target RPM
        const step = (targetRPM - rpmRef) * (deltaTimeSeconds / this.spinUpTimeSeconds);
        this.currentRPM += step;
        if (this.currentRPM < 0)
            this.currentRPM = 0;
    }
}
exports.MockMotor = MockMotor;
