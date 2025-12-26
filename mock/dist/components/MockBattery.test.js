"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const MockBattery_1 = require("./MockBattery");
(0, vitest_1.describe)('MockBattery', () => {
    (0, vitest_1.it)('should initialize with full capacity', async () => {
        const battery = new MockBattery_1.MockBattery(4, 5000); // 4S 5000mAh
        await battery.init();
        const data = await battery.read();
        (0, vitest_1.expect)(data.remainingmAh).toBe(5000);
        (0, vitest_1.expect)(data.voltage).toBeCloseTo(16.8); // 4 * 4.2
    });
    (0, vitest_1.it)('should drain capacity under load', () => {
        const battery = new MockBattery_1.MockBattery(4, 5000);
        // Run for 1 hour (3600s) at 5 Amps
        // Should drain 5000mAh
        battery.update(3600, 5);
        (0, vitest_1.expect)(battery.remainingmAh).toBeLessThanOrEqual(1); // Close to 0
        (0, vitest_1.expect)(battery.voltage).toBeLessThan(16.8);
    });
});
