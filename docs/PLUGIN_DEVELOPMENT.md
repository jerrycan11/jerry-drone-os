# Plugin Development Guide

This guide walks you through creating custom plugins for Drone OS.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Plugin Interface](#plugin-interface)
3. [Basic Plugin Example](#basic-plugin-example)
4. [Plugin Context](#plugin-context)
5. [Dependencies](#dependencies)
6. [Best Practices](#best-practices)
7. [Testing Plugins](#testing-plugins)

---

## Introduction

Plugins are the primary way to extend Drone OS functionality. They integrate seamlessly with the core system while maintaining isolation and modularity.

**Use cases for plugins:**
- Custom flight modes
- Sensor integrations
- Mission behaviors
- Payload control
- Data logging

---

## Plugin Interface

All plugins must implement the `IPlugin` interface:

```typescript
interface IPlugin {
  // Unique identifier
  id: string;
  
  // List of plugin IDs this depends on
  dependencies: string[];
  
  // Called once during system startup
  initialize(context: PluginContext): Promise<void>;
  
  // Called when the system starts running
  start(): void;
  
  // Called when the system stops
  stop(): void;
  
  // Called every tick (typically 100Hz)
  tick(deltaTime: number): void;
}
```

---

## Basic Plugin Example

Here's a simple plugin that logs altitude every second:

```typescript
import { IPlugin, PluginContext } from '@drone-os/core';

export class AltitudeLogger implements IPlugin {
  id = 'altitude-logger';
  dependencies = [];
  
  private context!: PluginContext;
  private lastLogTime = 0;

  async initialize(context: PluginContext): Promise<void> {
    this.context = context;
    context.logger.info('AltitudeLogger initialized');
  }

  start(): void {
    this.context.logger.info('AltitudeLogger started');
  }

  stop(): void {
    this.context.logger.info('AltitudeLogger stopped');
  }

  tick(deltaTime: number): void {
    this.lastLogTime += deltaTime;
    
    if (this.lastLogTime >= 1000) {
      const gps = this.context.hal.getGPS();
      const pos = gps.getPosition();
      this.context.logger.info(`Altitude: ${pos.alt}m`);
      this.lastLogTime = 0;
    }
  }
}
```

---

## Plugin Context

The `PluginContext` provides access to system services:

```typescript
interface PluginContext {
  // Logging
  logger: ILogger;
  
  // Hardware access
  hal: HALManager;
  
  // Communication
  comms: CommManager;
  
  // Configuration
  config: DeploymentConfig;
  
  // Event system
  events: EventEmitter;
  
  // Access other plugins
  getPlugin<T extends IPlugin>(id: string): T | undefined;
}
```

### Using HAL

```typescript
// Get sensor data
const gps = this.context.hal.getGPS();
const imu = this.context.hal.getIMU();
const battery = this.context.hal.getBattery();

// Control actuators
const motors = this.context.hal.getMotors();
motors[0].setThrottle(0.5);
```

### Using Events

```typescript
// Emit events
this.context.events.emit('waypoint-reached', { id: 'WP1' });

// Listen to events
this.context.events.on('failsafe-triggered', (data) => {
  this.emergencyProcedure();
});
```

---

## Dependencies

Plugins can depend on other plugins:

```typescript
export class SearchAndRescue implements IPlugin {
  id = 'search-and-rescue';
  dependencies = ['navigation', 'vision-processor'];
  
  private nav!: NavigationPlugin;
  private vision!: VisionProcessor;

  async initialize(context: PluginContext): Promise<void> {
    this.nav = context.getPlugin('navigation')!;
    this.vision = context.getPlugin('vision-processor')!;
  }

  tick(deltaTime: number): void {
    // Use navigation and vision
    const detections = await this.vision.executeCommand('DETECT_OBJECTS', {
      mockFrame: 'search_area'
    });
    
    if (detections.objects.length > 0) {
      this.nav.hoverAndAlert();
    }
  }
}
```

The Module Manager ensures dependencies are initialized before dependents.

---

## Best Practices

### 1. Keep Tick Lightweight

The `tick()` method runs at high frequency. Avoid:
- Heavy computations
- Blocking I/O
- Memory allocations

```typescript
// BAD
tick(dt: number): void {
  const result = this.heavyComputation(); // Blocks loop!
}

// GOOD
tick(dt: number): void {
  if (this.pendingResult) {
    this.processResult(this.pendingResult);
    this.pendingResult = null;
  }
}

// Run heavy work asynchronously
private async heavyWorkAsync(): Promise<void> {
  const result = await doHeavyWork();
  this.pendingResult = result;
}
```

### 2. Use Proper Logging Levels

```typescript
logger.debug('Detailed internal state');
logger.info('Normal operational messages');
logger.warn('Recoverable issues');
logger.error('Critical failures');
```

### 3. Handle Errors Gracefully

```typescript
tick(dt: number): void {
  try {
    this.processData();
  } catch (error) {
    this.context.logger.error(`Error in ${this.id}: ${error}`);
    // Don't crash the whole system
  }
}
```

### 4. Clean Up Resources

```typescript
stop(): void {
  if (this.timer) clearInterval(this.timer);
  if (this.connection) this.connection.close();
}
```

---

## Testing Plugins

### Unit Testing

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { AltitudeLogger } from './AltitudeLogger';

describe('AltitudeLogger', () => {
  let plugin: AltitudeLogger;
  let mockContext: PluginContext;

  beforeEach(() => {
    plugin = new AltitudeLogger();
    mockContext = createMockContext();
  });

  it('should initialize without errors', async () => {
    await expect(plugin.initialize(mockContext)).resolves.not.toThrow();
  });

  it('should log altitude every second', () => {
    plugin.initialize(mockContext);
    plugin.start();

    // Simulate 1 second of ticks
    for (let i = 0; i < 100; i++) {
      plugin.tick(10);
    }

    expect(mockContext.logger.info).toHaveBeenCalledWith(
      expect.stringContaining('Altitude:')
    );
  });
});
```

### Integration Testing

```typescript
it('should integrate with navigation', async () => {
  const loader = new PluginLoader();
  loader.register(new NavigationPlugin());
  loader.register(new SearchAndRescue());

  await loader.initializeAll(context);
  
  // Verify integration
  const sar = loader.getPlugin('search-and-rescue');
  expect(sar.isReady()).toBe(true);
});
```

---

## Registering Your Plugin

### Option 1: Direct Registration

```typescript
const loader = new PluginLoader();
loader.register(new MyCustomPlugin());
```

### Option 2: Configuration

```json
{
  "plugins": [
    "navigation",
    "flight-control",
    "my-custom-plugin"
  ]
}
```

---

## Example: Custom Flight Mode

```typescript
export class OrbitMode implements IPlugin {
  id = 'orbit-mode';
  dependencies = ['flight-control', 'navigation'];

  private fc!: FlightControlPlugin;
  private center: Position | null = null;
  private radius = 10; // meters
  private angle = 0;

  async initialize(context: PluginContext): Promise<void> {
    this.fc = context.getPlugin('flight-control')!;
    
    context.events.on('activate-orbit', (params) => {
      this.center = params.center;
      this.radius = params.radius || 10;
    });
  }

  tick(deltaTime: number): void {
    if (!this.center) return;

    this.angle += (deltaTime / 1000) * 0.1; // Orbit speed
    
    const targetX = this.center.lng + this.radius * Math.cos(this.angle);
    const targetY = this.center.lat + this.radius * Math.sin(this.angle);
    
    // Command flight controller
    // ...
  }
}
```

---

## See Also

- [Architecture Guide](ARCHITECTURE.md)
- [API Reference](API_REFERENCE.md)
