export declare enum PacketType {
    TELEMETRY = "TELEMETRY",
    COMMAND = "COMMAND",
    STATUS = "STATUS",
    ERROR = "ERROR",
    HANDSHAKE = "HANDSHAKE"
}
export interface IPacketHeader {
    version: number;
    type: PacketType;
    sequenceId: number;
    timestamp: number;
    sourceId: string;
    targetId?: string;
    nonce?: string;
}
export interface IPacket<T = unknown> {
    header: IPacketHeader;
    payload: T;
    signature?: string;
}
export interface ITelemetryPayload {
    gps?: {
        lat: number;
        lon: number;
        alt: number;
    };
    attitude?: {
        pitch: number;
        roll: number;
        yaw: number;
    };
    battery?: {
        voltage: number;
        percentage: number;
    };
    status: string;
}
export interface ICommandPayload {
    commandId: string;
    params: Record<string, unknown>;
}
