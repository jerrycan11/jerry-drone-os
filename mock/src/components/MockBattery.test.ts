import { describe, it, expect } from 'vitest';
import { MockBattery } from './MockBattery';

describe('MockBattery', () => {
  it('should initialize with full capacity', async () => {
    const battery = new MockBattery(4, 5000); // 4S 5000mAh
    await battery.init();
    const data = await battery.read();
    
    expect(data.remainingmAh).toBe(5000);
    expect(data.voltage).toBeCloseTo(16.8); // 4 * 4.2
  });
  
  it('should drain capacity under load', () => {
    const battery = new MockBattery(4, 5000);
    
    // Run for 1 hour (3600s) at 5 Amps
    // Should drain 5000mAh
    battery.update(3600, 5);
    
    expect(battery.remainingmAh).toBeLessThanOrEqual(1); // Close to 0
    expect(battery.voltage).toBeLessThan(16.8);
  });
});
