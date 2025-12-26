// Shared Type Definitions

export interface IVector3 {
    x: number;
    y: number;
    z: number;
}



export interface ITelemetry {
    attitude: IVector3; // Pitch, Roll, Yaw
    position: IVector3; // Lat, Lon, Alt (or x,y,z local)
    velocity: IVector3;
    batteryLevel: number;
}
