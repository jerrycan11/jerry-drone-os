export interface IVector3 {
    x: number;
    y: number;
    z: number;
}
export interface ITelemetry {
    attitude: IVector3;
    position: IVector3;
    velocity: IVector3;
    batteryLevel: number;
}
