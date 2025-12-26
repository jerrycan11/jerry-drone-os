import { IMotor, IMotorAdapter, IVector3 } from '@drone-os/shared';
export declare class MockMotor implements IMotor, IMotorAdapter {
    id: number;
    position: IVector3;
    direction: 'CW' | 'CCW';
    maxRPM: number;
    currentRPM: number;
    throttle: number;
    private readonly spinUpTimeSeconds;
    constructor(id: number, position: IVector3, direction: 'CW' | 'CCW', maxRPM?: number);
    init(): Promise<void>;
    read(): Promise<unknown>;
    write(data: unknown): Promise<void>;
    dispose(): Promise<void>;
    setThrottle(percent: number): Promise<void>;
    getRPM(): Promise<number>;
    update(deltaTimeSeconds: number): void;
}
