import { IBattery, IHardwareAdapter } from '@drone-os/shared';
export declare class MockBattery implements IBattery, IHardwareAdapter {
    voltage: number;
    current: number;
    capacitymAh: number;
    remainingmAh: number;
    cellCount: number;
    temperature: number;
    private readonly maxVoltagePerCell;
    private readonly minVoltagePerCell;
    private readonly internalResistance;
    constructor(cellCount: number, capacitymAh: number);
    init(): Promise<void>;
    read(): Promise<IBattery>;
    write(data: unknown): Promise<void>;
    dispose(): Promise<void>;
    update(deltaTimeSeconds: number, currentLoadAmps: number): void;
}
