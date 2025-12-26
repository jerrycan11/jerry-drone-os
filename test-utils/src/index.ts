/**
 * Drone OS Test Utilities
 * 
 * Shared testing utilities, mocks, and helpers for all test suites.
 * Provides consistent test fixtures and patterns across the monorepo.
 */

import { vi } from 'vitest';
import { ILogger, ICommTransport, IPacket, PacketType, IPacketHeader } from '@drone-os/shared';

// Transport type union including MOCK for testing
type TransportType = 'BLUETOOTH' | 'WIFI' | 'SERIAL' | 'CELLULAR' | 'SATELLITE' | 'MOCK';

// ============================================================================
// Mock Logger
// ============================================================================

/**
 * Creates a spy-enabled mock logger for testing.
 * All log methods are vi.fn() spies that can be asserted on.
 */
export function createMockLogger(prefix: string = 'TestLogger'): MockLogger {
  return {
    prefix,
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    fatal: vi.fn(),
    
    // Utility to get all logged messages
    getAllMessages(): string[] {
      const messages: string[] = [];
      for (const call of (this.info as any).mock.calls) {
        messages.push(`[INFO] ${call[0]}`);
      }
      for (const call of (this.warn as any).mock.calls) {
        messages.push(`[WARN] ${call[0]}`);
      }
      for (const call of (this.error as any).mock.calls) {
        messages.push(`[ERROR] ${call[0]}`);
      }
      for (const call of (this.debug as any).mock.calls) {
        messages.push(`[DEBUG] ${call[0]}`);
      }
      return messages;
    },
    
    // Check if any error was logged
    hasErrors(): boolean {
      return (this.error as any).mock.calls.length > 0;
    },
    
    // Reset all spies
    reset(): void {
      (this.info as any).mockReset();
      (this.warn as any).mockReset();
      (this.error as any).mockReset();
      (this.debug as any).mockReset();
      (this.fatal as any).mockReset();
    }
  };
}

export interface MockLogger extends ILogger {
  prefix: string;
  getAllMessages(): string[];
  hasErrors(): boolean;
  reset(): void;
}

// ============================================================================
// Mock Communication Transport
// ============================================================================

/**
 * Creates a mock communication transport for testing comm systems.
 */
export function createMockTransport(id: string, type: TransportType = 'MOCK'): MockTransport {
  const receiveCallbacks: ((data: Uint8Array) => void)[] = [];
  const statusCallbacks: ((isConnected: boolean) => void)[] = [];
  let connected = false;
  let sentData: Uint8Array[] = [];
  
  const transport: MockTransport = {
    id,
    type: type as ICommTransport['type'],
    isConnected: () => connected,
    
    connect: vi.fn(async (): Promise<boolean> => {
      connected = true;
      statusCallbacks.forEach(cb => cb(true));
      return true;
    }),
    
    disconnect: vi.fn(async () => {
      connected = false;
      statusCallbacks.forEach(cb => cb(false));
    }),
    
    send: vi.fn(async (data: Uint8Array) => {
      if (!connected) throw new Error('Transport not connected');
      sentData.push(data);
    }),
    
    onReceive: (callback: (data: Uint8Array) => void) => {
      receiveCallbacks.push(callback);
    },
    
    onStatusChange: (callback: (isConnected: boolean) => void) => {
      statusCallbacks.push(callback);
    },
    
    // Test utilities
    simulateReceive(data: Uint8Array): void {
      receiveCallbacks.forEach(cb => cb(data));
    },
    
    simulateDisconnect(): void {
      connected = false;
      statusCallbacks.forEach(cb => cb(false));
    },
    
    getSentData(): Uint8Array[] {
      return sentData;
    },
    
    clearSentData(): void {
      sentData = [];
    },
    
    reset(): void {
      connected = false;
      sentData = [];
      (transport.connect as any).mockReset();
      (transport.disconnect as any).mockReset();
      (transport.send as any).mockReset();
    }
  };
  
  return transport;
}

export interface MockTransport extends ICommTransport {
  isConnected: () => boolean;
  simulateReceive(data: Uint8Array): void;
  simulateDisconnect(): void;
  getSentData(): Uint8Array[];
  clearSentData(): void;
  reset(): void;
}

// ============================================================================
// Drone State Fixtures
// ============================================================================

export interface DroneState {
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  attitude: { roll: number; pitch: number; yaw: number };
  battery: { voltage: number; remaining: number; current: number };
  gps: { lat: number; lon: number; alt: number; satellites: number; fix: number };
  armed: boolean;
  mode: string;
}

/**
 * Creates a standard drone state fixture for testing.
 * All values represent a stable, hovering drone.
 */
export function createMockDroneState(overrides: Partial<DroneState> = {}): DroneState {
  return {
    position: { x: 0, y: 0, z: 10 },
    velocity: { x: 0, y: 0, z: 0 },
    attitude: { roll: 0, pitch: 0, yaw: 0 },
    battery: { voltage: 16.2, remaining: 85, current: 15 },
    gps: { lat: -33.8688, lon: 151.2093, alt: 50, satellites: 12, fix: 3 },
    armed: true,
    mode: 'LOITER',
    ...overrides
  };
}

/**
 * Creates a critical low battery state for failsafe testing.
 */
export function createLowBatteryState(): DroneState {
  return createMockDroneState({
    battery: { voltage: 13.5, remaining: 15, current: 20 }
  });
}

/**
 * Creates a GPS-denied state for navigation testing.
 */
export function createGPSDeniedState(): DroneState {
  return createMockDroneState({
    gps: { lat: 0, lon: 0, alt: 0, satellites: 0, fix: 0 }
  });
}

// ============================================================================
// Packet Fixtures
// ============================================================================

/**
 * Creates a valid packet for testing.
 */
export function createValidPacket(type: PacketType = PacketType.TELEMETRY, payload: object = {}): IPacket {
  return {
    header: {
      version: 1,
      type,
      sequenceId: Math.floor(Math.random() * 65535),
      sourceId: 'test-drone-1',
      timestamp: Date.now(),
      nonce: generateNonce()
    },
    payload
  };
}

/**
 * Creates a command packet for testing.
 */
export function createCommandPacket(command: string, params: object = {}): IPacket {
  return createValidPacket(PacketType.COMMAND, { command, params });
}

/**
 * Creates a telemetry packet with drone state.
 */
export function createTelemetryPacket(state: Partial<DroneState> = {}): IPacket {
  return createValidPacket(PacketType.TELEMETRY, createMockDroneState(state));
}

/**
 * Creates an old/expired packet for replay attack testing.
 */
export function createExpiredPacket(): IPacket {
  const packet = createValidPacket();
  packet.header.timestamp = Date.now() - 30000; // 30 seconds old
  return packet;
}

/**
 * Creates a packet with a duplicate nonce for replay detection testing.
 */
export function createReplayPacket(originalNonce: string): IPacket {
  const packet = createValidPacket();
  packet.header.nonce = originalNonce;
  return packet;
}

function generateNonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonce = '';
  for (let i = 0; i < 16; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}

// ============================================================================
// Async Utilities
// ============================================================================

/**
 * Waits for a condition to become true, with timeout.
 * Useful for event-driven test assertions.
 */
export async function waitForCondition(
  condition: () => boolean,
  timeoutMs: number = 5000,
  checkIntervalMs: number = 50
): Promise<void> {
  const startTime = Date.now();
  
  while (!condition()) {
    if (Date.now() - startTime > timeoutMs) {
      throw new Error(`Condition not met within ${timeoutMs}ms timeout`);
    }
    await sleep(checkIntervalMs);
  }
}

/**
 * Waits for an async condition to become true.
 */
export async function waitForAsyncCondition(
  condition: () => Promise<boolean>,
  timeoutMs: number = 5000,
  checkIntervalMs: number = 50
): Promise<void> {
  const startTime = Date.now();
  
  while (!(await condition())) {
    if (Date.now() - startTime > timeoutMs) {
      throw new Error(`Async condition not met within ${timeoutMs}ms timeout`);
    }
    await sleep(checkIntervalMs);
  }
}

/**
 * Simple sleep helper.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Advances fake timers and runs pending callbacks.
 * Use with vi.useFakeTimers().
 */
export async function advanceTimersAndFlush(ms: number): Promise<void> {
  await vi.advanceTimersByTimeAsync(ms);
  await vi.runAllTimersAsync();
}

// ============================================================================
// Event Emitter for Testing
// ============================================================================

export type EventCallback<T = any> = (data: T) => void;

/**
 * Simple typed event emitter for mocking event-based systems.
 */
export class TestEventEmitter<T extends Record<string, any> = Record<string, any>> {
  private listeners: Map<keyof T, EventCallback[]> = new Map();
  
  on<K extends keyof T>(event: K, callback: EventCallback<T[K]>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }
  
  off<K extends keyof T>(event: K, callback: EventCallback<T[K]>): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }
  
  emit<K extends keyof T>(event: K, data: T[K]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }
  
  removeAllListeners(): void {
    this.listeners.clear();
  }
  
  listenerCount<K extends keyof T>(event: K): number {
    return this.listeners.get(event)?.length ?? 0;
  }
}

// ============================================================================
// Performance Testing Utilities
// ============================================================================

/**
 * Measures execution time of an async function.
 */
export async function measureExecutionTime<T>(
  fn: () => Promise<T>
): Promise<{ result: T; durationMs: number }> {
  const start = performance.now();
  const result = await fn();
  const durationMs = performance.now() - start;
  return { result, durationMs };
}

/**
 * Runs a function multiple times and returns timing statistics.
 */
export async function benchmarkFunction<T>(
  fn: () => Promise<T>,
  iterations: number = 100
): Promise<BenchmarkResult> {
  const durations: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const { durationMs } = await measureExecutionTime(fn);
    durations.push(durationMs);
  }
  
  durations.sort((a, b) => a - b);
  
  const sum = durations.reduce((a, b) => a + b, 0);
  const mean = sum / durations.length;
  const variance = durations.reduce((acc, d) => acc + Math.pow(d - mean, 2), 0) / durations.length;
  const stdDev = Math.sqrt(variance);
  
  return {
    iterations,
    mean,
    min: durations[0],
    max: durations[durations.length - 1],
    median: durations[Math.floor(durations.length / 2)],
    stdDev,
    p95: durations[Math.floor(durations.length * 0.95)],
    p99: durations[Math.floor(durations.length * 0.99)]
  };
}

export interface BenchmarkResult {
  iterations: number;
  mean: number;
  min: number;
  max: number;
  median: number;
  stdDev: number;
  p95: number;
  p99: number;
}

// ============================================================================
// Assertion Helpers
// ============================================================================

/**
 * Asserts that a value is within a tolerance range.
 * Useful for floating-point and timing comparisons.
 */
export function expectWithinTolerance(
  actual: number,
  expected: number,
  tolerance: number,
  message?: string
): void {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    throw new Error(
      message || 
      `Expected ${actual} to be within ${tolerance} of ${expected}, but diff was ${diff}`
    );
  }
}

/**
 * Asserts that an array of numbers has acceptable jitter.
 */
export function expectAcceptableJitter(
  values: number[],
  expectedMean: number,
  maxStdDev: number
): void {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  if (stdDev > maxStdDev) {
    throw new Error(
      `Jitter too high: stdDev=${stdDev.toFixed(3)}ms exceeds max=${maxStdDev}ms`
    );
  }
  
  const meanDiff = Math.abs(mean - expectedMean);
  if (meanDiff > expectedMean * 0.1) { // 10% tolerance on mean
    throw new Error(
      `Mean drift too high: mean=${mean.toFixed(3)}ms, expected=${expectedMean}ms`
    );
  }
}

// ============================================================================
// Exports Summary
// ============================================================================
export type {
  ILogger,
  ICommTransport,
  IPacket,
  PacketType,
  IPacketHeader
};

