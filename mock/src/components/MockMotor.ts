import { IMotor, IMotorAdapter, IVector3 } from '@drone-os/shared';

export class MockMotor implements IMotor, IMotorAdapter {
  id: number;
  position: IVector3;
  direction: 'CW' | 'CCW';
  maxRPM: number;
  currentRPM: number = 0;
  throttle: number = 0;

  // Simulation parameters
  private readonly spinUpTimeSeconds = 0.5; // Time to reach full speed

  constructor(id: number, position: IVector3, direction: 'CW' | 'CCW', maxRPM: number = 10000) {
    this.id = id;
    this.position = position;
    this.direction = direction;
    this.maxRPM = maxRPM;
  }

  // IHardwareAdapter implementation
  async init(): Promise<void> {
    console.log(`Motor ${this.id} initialized.`);
  }

  async read(): Promise<unknown> {
    return { rpm: this.currentRPM };
  }

  async write(data: unknown): Promise<void> {
      // no-op, use setThrottle
  }

  async dispose(): Promise<void> {
    this.currentRPM = 0;
    console.log(`Motor ${this.id} shutdown.`);
  }
  
  // IMotorAdapter implementation
  async setThrottle(percent: number): Promise<void> {
      this.throttle = Math.max(0, Math.min(1.0, percent));
  }
  
  async getRPM(): Promise<number> {
      return this.currentRPM;
  }

  // Simulation tick
  public update(deltaTimeSeconds: number): void {
      const targetRPM = this.throttle * this.maxRPM;
      const rpmRef = this.currentRPM;
      
      // Simple exponential approach to target RPM
      const step = (targetRPM - rpmRef) * (deltaTimeSeconds / this.spinUpTimeSeconds);
      this.currentRPM += step;
      
      if (this.currentRPM < 0) this.currentRPM = 0;
  }
}
