export enum PacketType {
  TELEMETRY = 'TELEMETRY',
  COMMAND = 'COMMAND',
  STATUS = 'STATUS',
  ERROR = 'ERROR',
  HANDSHAKE = 'HANDSHAKE',
}

export interface IPacketHeader {
  version: number;
  type: PacketType;
  sequenceId: number;
  timestamp: number;
  sourceId: string;
  targetId?: string;
  nonce?: string; // Random string for Replay Protection
}

export interface IPacket<T = unknown> {
  header: IPacketHeader;
  payload: T;
  signature?: string; // HMAC-SHA256
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
