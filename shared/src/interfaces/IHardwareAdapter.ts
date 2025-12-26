export interface IHardwareAdapter {
  /**
   * Initialize the hardware component.
   */
  init(): Promise<void>;

  /**
   * Read data from the hardware.
   * @returns A promise resolving to the data (generic structure).
   */
  read(): Promise<unknown>;

  /**
   * Write data to the hardware.
   * @param data The data to write.
   */
  write(data: unknown): Promise<void>;

  /**
   * Cleanup and shutdown the hardware component.
   */
  dispose(): Promise<void>;
}

export interface IMotorAdapter extends IHardwareAdapter {
  setThrottle(percent: number): Promise<void>;
  getRPM(): Promise<number>;
}

export interface ISensorAdapter<T> extends IHardwareAdapter {
  readData(): Promise<T>;
}
