import { IVector3 } from '../types';

export interface IMotor {
  id: number;
  position: IVector3; // Relative to center of mass
  direction: 'CW' | 'CCW';
  maxRPM: number;
  currentRPM: number;
  throttle: number; // 0.0 to 1.0
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
  acceleration: IVector3; // m/s^2
  gyro: IVector3; // rad/s
  temperature: number;
}

export interface IBarometerData {
  pressure: number; // hPa
  temperature: number;
  altitude: number; // calculated
}
