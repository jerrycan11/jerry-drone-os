export interface ICommTransport {
  id: string;
  type: 'BLUETOOTH' | 'WIFI' | 'SERIAL' | 'CELLULAR' | 'SATELLITE';
  
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  
  send(data: Uint8Array): Promise<void>;
  
  // Callbacks
  onReceive(callback: (data: Uint8Array) => void): void;
  onStatusChange(callback: (isConnected: boolean) => void): void;
}
