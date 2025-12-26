import { IBattery, IHardwareAdapter } from '@drone-os/shared';

export class MockBattery implements IBattery, IHardwareAdapter {
  voltage: number; // Current voltage
  current: number = 0; // Current draw in Amps
  capacitymAh: number;
  remainingmAh: number;
  cellCount: number;
  temperature: number = 25; // Celsius

  // Simulation Config
  private readonly maxVoltagePerCell = 4.2;
  private readonly minVoltagePerCell = 3.0; // Cutoff
  private readonly internalResistance = 0.05; // Ohms

  constructor(cellCount: number, capacitymAh: number) {
    this.cellCount = cellCount;
    this.capacitymAh = capacitymAh;
    this.remainingmAh = capacitymAh; // Start full
    this.voltage = this.cellCount * this.maxVoltagePerCell;
  }

  async init(): Promise<void> {
    console.log(`Battery initialized: ${this.cellCount}S ${this.capacitymAh}mAh`);
  }

  async read(): Promise<IBattery> {
     return {
         voltage: this.voltage,
         current: this.current,
         capacitymAh: this.capacitymAh,
         remainingmAh: this.remainingmAh,
         cellCount: this.cellCount,
         temperature: this.temperature
     };
  }

  async write(data: unknown): Promise<void> {
      // Battery is generally read-only in terms of control
  }
  
  async dispose(): Promise<void> {
      // no-op
  }
  
  // Simulation update
  public update(deltaTimeSeconds: number, currentLoadAmps: number): void {
      this.current = currentLoadAmps;
      
      // Calculate capacity usage
      // Ah = Amps * Hours
      // We have Amps * Seconds.  (Amps * Seconds) / 3600 = Ah
      const usedAh = (currentLoadAmps * deltaTimeSeconds) / 3600;
      const usedmAh = usedAh * 1000;
      
      this.remainingmAh -= usedmAh;
      if (this.remainingmAh < 0) this.remainingmAh = 0;
      
      // Calculate voltage based on discharge curve (simplified linear for now)
      const chargePercent = this.remainingmAh / this.capacitymAh;
      const nominalVoltage = this.cellCount * (this.minVoltagePerCell + (this.maxVoltagePerCell - this.minVoltagePerCell) * chargePercent);
      
      // V_terminal = V_nominal - I * R
      this.voltage = nominalVoltage - (this.current * this.internalResistance);
      
      // Heat generation (I^2 * R)
      const heatWatts = (this.current ** 2) * this.internalResistance;
      // Simple warming factor (arbitrary constant for thermal mass)
      this.temperature += (heatWatts * deltaTimeSeconds) * 0.01;
      // Cooling factor
      this.temperature -= (this.temperature - 25) * deltaTimeSeconds * 0.05; 
  }
}
