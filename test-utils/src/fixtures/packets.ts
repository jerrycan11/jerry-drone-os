/**
 * Test Fixtures: Packets
 * 
 * Pre-defined packet data for security and communication testing.
 */

import { IPacket, PacketType } from '@drone-os/shared';

/**
 * Valid command packets for testing.
 */
export const VALID_COMMANDS = {
  arm: createPacket(PacketType.COMMAND, { command: 'ARM', params: {} }),
  disarm: createPacket(PacketType.COMMAND, { command: 'DISARM', params: {} }),
  takeoff: createPacket(PacketType.COMMAND, { command: 'TAKEOFF', params: { altitude: 10 } }),
  land: createPacket(PacketType.COMMAND, { command: 'LAND', params: {} }),
  rth: createPacket(PacketType.COMMAND, { command: 'RTH', params: {} }),
  goto: createPacket(PacketType.COMMAND, { command: 'GOTO', params: { x: 10, y: 20, z: 15 } }),
  setMode: createPacket(PacketType.COMMAND, { command: 'SET_MODE', params: { mode: 'LOITER' } })
};

/**
 * Malformed packets for rejection testing.
 */
export const MALFORMED_PACKETS = {
  missingHeader: { payload: { data: 'test' } } as any,
  missingType: createPacketWithOverrides({ type: undefined as any }),
  invalidType: createPacketWithOverrides({ type: 999 as any }),
  missingTimestamp: createPacketWithOverrides({ timestamp: undefined as any }),
  missingNonce: createPacketWithOverrides({ nonce: undefined as any }),
  emptyNonce: createPacketWithOverrides({ nonce: '' }),
  futureTimestamp: createPacketWithOverrides({ timestamp: Date.now() + 60000 }),
  veryOldTimestamp: createPacketWithOverrides({ timestamp: Date.now() - 300000 }),
  invalidSourceId: createPacketWithOverrides({ sourceId: '' })
};

/**
 * Attack simulation packets.
 */
export const ATTACK_PACKETS = {
  /**
   * Replay attack: packet with a previously seen nonce
   */
  replay: (originalNonce: string) => createPacketWithOverrides({ nonce: originalNonce }),
  
  /**
   * Delayed replay: old packet replayed later
   */
  delayedReplay: createPacketWithOverrides({ timestamp: Date.now() - 20000 }),
  
  /**
   * Spoofed source: packet claiming to be from another drone
   */
  spoofedSource: createPacketWithOverrides({ sourceId: 'trusted-drone-01' }),
  
  /**
   * Injection attempt: malicious command
   */
  commandInjection: createPacket(PacketType.COMMAND, { 
    command: 'EXECUTE', 
    params: { code: 'rm -rf /' } 
  }),
  
  /**
   * Overflow attempt: extremely large payload
   */
  payloadOverflow: createPacket(PacketType.TELEMETRY, { 
    data: 'A'.repeat(1000000) 
  }),
  
  /**
   * Invalid version: unsupported protocol version
   */
  invalidVersion: createPacketWithOverrides({ version: 99 })
};

/**
 * Telemetry packet sequences for sensor testing.
 */
export const TELEMETRY_SEQUENCES = {
  /**
   * Normal stable flight telemetry
   */
  stableFlight: [
    createTelemetryPacket({ altitude: 10.0, velocity: 0.1 }),
    createTelemetryPacket({ altitude: 10.1, velocity: 0.0 }),
    createTelemetryPacket({ altitude: 10.0, velocity: -0.1 }),
    createTelemetryPacket({ altitude: 9.9, velocity: 0.0 }),
    createTelemetryPacket({ altitude: 10.0, velocity: 0.1 })
  ],
  
  /**
   * Ascending flight sequence
   */
  ascending: [
    createTelemetryPacket({ altitude: 0.0, velocity: 2.0 }),
    createTelemetryPacket({ altitude: 2.0, velocity: 2.0 }),
    createTelemetryPacket({ altitude: 4.0, velocity: 2.0 }),
    createTelemetryPacket({ altitude: 6.0, velocity: 2.0 }),
    createTelemetryPacket({ altitude: 8.0, velocity: 1.0 }),
    createTelemetryPacket({ altitude: 10.0, velocity: 0.0 })
  ],
  
  /**
   * GPS spoofing detection test - impossible jump
   */
  gpsSpoofAttempt: [
    createTelemetryPacket({ lat: -33.8688, lon: 151.2093 }),
    createTelemetryPacket({ lat: -33.8688, lon: 151.2093 }),
    createTelemetryPacket({ lat: -34.0000, lon: 152.0000 }), // Impossible 100km+ jump
    createTelemetryPacket({ lat: -34.0001, lon: 152.0001 })
  ],
  
  /**
   * Battery drain sequence
   */
  batteryDrain: [
    createTelemetryPacket({ batteryPercent: 100, voltage: 16.8 }),
    createTelemetryPacket({ batteryPercent: 80, voltage: 16.0 }),
    createTelemetryPacket({ batteryPercent: 50, voltage: 15.0 }),
    createTelemetryPacket({ batteryPercent: 25, voltage: 14.2 }),
    createTelemetryPacket({ batteryPercent: 15, voltage: 13.8 }), // RTH threshold
    createTelemetryPacket({ batteryPercent: 10, voltage: 13.5 })  // Critical
  ]
};

// ============================================================================
// Helper Functions
// ============================================================================

function generateNonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonce = '';
  for (let i = 0; i < 16; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}

function createPacket(type: PacketType, payload: object): IPacket {
  return {
    header: {
      version: 1,
      type,
      sequenceId: Math.floor(Math.random() * 65535),
      sourceId: 'test-source',
      timestamp: Date.now(),
      nonce: generateNonce()
    },
    payload
  };
}

function createPacketWithOverrides(headerOverrides: Partial<IPacket['header']>): IPacket {
  const base = createPacket(PacketType.COMMAND, { test: true });
  return {
    ...base,
    header: {
      ...base.header,
      ...headerOverrides
    }
  };
}

function createTelemetryPacket(data: {
  altitude?: number;
  velocity?: number;
  lat?: number;
  lon?: number;
  batteryPercent?: number;
  voltage?: number;
}): IPacket {
  return createPacket(PacketType.TELEMETRY, {
    position: {
      lat: data.lat ?? -33.8688,
      lon: data.lon ?? 151.2093,
      alt: data.altitude ?? 10
    },
    velocity: data.velocity ?? 0,
    battery: {
      percent: data.batteryPercent ?? 85,
      voltage: data.voltage ?? 16.0
    }
  });
}
