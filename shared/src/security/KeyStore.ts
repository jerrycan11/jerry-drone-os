import { NodeCryptoProvider } from './NodeCryptoProvider';

export class KeyStore {
  private crypto: NodeCryptoProvider;
  private keys: Map<string, Uint8Array> = new Map();

  constructor() {
    this.crypto = new NodeCryptoProvider();
  }

  // Store a shared key
  setKey(id: string, key: Uint8Array): void {
    this.keys.set(id, key);
  }

  getKey(id: string): Uint8Array | undefined {
    return this.keys.get(id);
  }
  
  hasKey(id: string): boolean {
      return this.keys.has(id);
  }

  generateRandomKey(length: number = 32): Uint8Array {
      return this.crypto.generateNonce(length);
  }
}
