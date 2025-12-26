import { IVector3 } from '@drone-os/shared';
export declare class MockPhysicsEngine {
    private position;
    private velocity;
    private acceleration;
    private lastTick;
    private obstacles;
    private readonly GRAVITY;
    private readonly DRAG_COEFFICIENT;
    private mass;
    constructor(mass?: number);
    addObstacle(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number): void;
    raycast(origin: IVector3, direction: IVector3, maxRange: number): number;
    update(deltaTimeSeconds: number, thrustVector: IVector3): void;
    getPosition(): IVector3;
    getVelocity(): IVector3;
    getAcceleration(): IVector3;
}
