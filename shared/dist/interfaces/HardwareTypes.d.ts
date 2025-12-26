import { IVector3 } from '../types';
export interface IMotor {
    id: number;
    position: IVector3;
    direction: 'CW' | 'CCW';
    maxRPM: number;
    currentRPM: number;
    throttle: number;
}
export interface IBattery {
    voltage: number;
    current: number;
    capacitymAh: number;
    remainingmAh: number;
    cellCount: number;
    temperature: number;
}
export interface IGPSData {
    latitude: number;
    longitude: number;
    altitude: number;
    satellites: number;
    hdop: number;
    fixType: 'NO_FIX' | '2D_FIX' | '3D_FIX';
}
export interface IIMUData {
    acceleration: IVector3;
    gyro: IVector3;
    temperature: number;
}
export interface IBarometerData {
    pressure: number;
    temperature: number;
    altitude: number;
}
