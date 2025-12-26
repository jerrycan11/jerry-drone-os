export enum PayloadPowerState {
    OFF = 'OFF',
    STANDBY = 'STANDBY',
    ON = 'ON'
}

export interface IPayload {
    id: string;
    type: string;
    
    initialize(): Promise<boolean>;
    powerOn(): Promise<void>;
    powerOff(): Promise<void>;
    getPowerState(): PayloadPowerState;
    
    executeCommand(command: string, params?: any): Promise<any>;
    getHealth(): { status: 'OK' | 'FAULT', info?: string };
}
