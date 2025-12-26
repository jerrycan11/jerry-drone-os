export declare class KeyStore {
    private crypto;
    private keys;
    constructor();
    setKey(id: string, key: Uint8Array): void;
    getKey(id: string): Uint8Array | undefined;
    hasKey(id: string): boolean;
    generateRandomKey(length?: number): Uint8Array;
}
