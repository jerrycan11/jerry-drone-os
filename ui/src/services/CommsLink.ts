export type TelemetryCallback = (data: ArrayBuffer) => void;

export class CommsLink {
  private ws: WebSocket | null = null;
  private url: string;
  private listeners: Set<TelemetryCallback> = new Set();
  private isConnected: boolean = false;
  private connectionListeners: Set<(connected: boolean) => void> = new Set();

  constructor(url: string = 'ws://localhost:8080') {
    this.url = url;
  }

  public get connected(): boolean {
    return this.isConnected;
  }

  public connect(): void {
    if (this.ws) return;

    console.log(`Connecting to drone at ${this.url}...`);
    this.ws = new WebSocket(this.url);
    this.ws.binaryType = 'arraybuffer';

    this.ws.onopen = () => {
      console.log('Connected to Drone OS.');
      this.isConnected = true;
      this.notifyConnection(true);
    };

    this.ws.onclose = () => {
      console.log('Disconnected from Drone OS.');
      this.isConnected = false;
      this.notifyConnection(false);
      this.ws = null;
      // Auto-reconnect logic could go here
      setTimeout(() => this.connect(), 2000);
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket Error:', err);
    };

    this.ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        this.notifyListeners(event.data);
      }
    };
  }

  public send(data: ArrayBuffer | Uint8Array): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      console.warn('Cannot send: WebSocket not connected.');
    }
  }

  public onMessage(callback: TelemetryCallback): void {
    this.listeners.add(callback);
  }

  public offMessage(callback: TelemetryCallback): void {
    this.listeners.delete(callback);
  }

  public onConnectionChange(callback: (connected: boolean) => void): void {
    this.connectionListeners.add(callback);
  }

  private notifyListeners(data: ArrayBuffer): void {
    this.listeners.forEach(cb => cb(data));
  }

  private notifyConnection(connected: boolean): void {
    this.connectionListeners.forEach(cb => cb(connected));
  }
}

// Singleton instance
export const comms = new CommsLink();
