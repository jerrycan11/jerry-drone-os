import { IVector3 } from '@drone-os/shared';
export declare class MockPhysicsEngine {
    private position;
    private velocity;
    private acceleration;
    private readonly GRAVITY;
    private readonly DRAG_COEFFICIENT;
    private massKg;
    constructor(massKg: number);
    update(deltaTimeSeconds: number, thrustVector: IVector3): void;
    getPosition(): IVector3;
    getVelocity(): IVector3;
    getAcceleration(): IVector3;
}
