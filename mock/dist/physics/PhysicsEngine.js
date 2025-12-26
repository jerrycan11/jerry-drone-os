"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockPhysicsEngine = void 0;
class MockPhysicsEngine {
    position = { x: 0, y: 0, z: 0 };
    velocity = { x: 0, y: 0, z: 0 };
    acceleration = { x: 0, y: 0, z: 0 };
    GRAVITY = 9.81;
    DRAG_COEFFICIENT = 0.1;
    massKg = 1.0;
    constructor(massKg) {
        this.massKg = massKg;
    }
    update(deltaTimeSeconds, thrustVector) {
        // 1. Calculate gravity force (downward on Z axis, assuming Z is up)
        // Adjust frame of reference if needed, assuming simple Local ENU (East-North-Up)
        const gravityForce = { x: 0, y: 0, z: -this.GRAVITY * this.massKg };
        // 2. Drag force (simplified: -C * v^2 * direction)
        const speedSquared = this.velocity.x ** 2 + this.velocity.y ** 2 + this.velocity.z ** 2;
        const speed = Math.sqrt(speedSquared);
        const dragMagnitude = this.DRAG_COEFFICIENT * speedSquared;
        const dragForce = {
            x: speed > 0 ? -(this.velocity.x / speed) * dragMagnitude : 0,
            y: speed > 0 ? -(this.velocity.y / speed) * dragMagnitude : 0,
            z: speed > 0 ? -(this.velocity.z / speed) * dragMagnitude : 0,
        };
        // 3. Total Force
        // Thrust vector is assumed to be already rotated to world frame by the caller (or we can handle attitude here later)
        const netForce = {
            x: thrustVector.x + gravityForce.x + dragForce.x,
            y: thrustVector.y + gravityForce.y + dragForce.y,
            z: thrustVector.z + gravityForce.z + dragForce.z,
        };
        // 4. Update Acceleration (F = ma => a = F/m)
        this.acceleration = {
            x: netForce.x / this.massKg,
            y: netForce.y / this.massKg,
            z: netForce.z / this.massKg,
        };
        // 5. Update Velocity (v = v0 + at)
        this.velocity.x += this.acceleration.x * deltaTimeSeconds;
        this.velocity.y += this.acceleration.y * deltaTimeSeconds;
        this.velocity.z += this.acceleration.z * deltaTimeSeconds;
        // 6. Update Position (p = p0 + vt)
        // Simple Euler integration
        this.position.x += this.velocity.x * deltaTimeSeconds;
        this.position.y += this.velocity.y * deltaTimeSeconds;
        this.position.z += this.velocity.z * deltaTimeSeconds;
        // Ground collision constraint
        if (this.position.z < 0) {
            this.position.z = 0;
            this.velocity.z = 0;
            this.acceleration.z = 0;
        }
    }
    getPosition() { return { ...this.position }; }
    getVelocity() { return { ...this.velocity }; }
    getAcceleration() { return { ...this.acceleration }; }
}
exports.MockPhysicsEngine = MockPhysicsEngine;
