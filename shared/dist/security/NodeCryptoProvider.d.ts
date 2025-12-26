import { ICryptoProvider } from '../interfaces/Crypto';
export declare class NodeCryptoProvider implements ICryptoProvider {
    private readonly ALGORITHM;
    private readonly IV_LENGTH;
    private readonly TAG_LENGTH;
    encrypt(data: Uint8Array, key: Uint8Array): Promise<Uint8Array>;
    decrypt(data: Uint8Array, key: Uint8Array): Promise<Uint8Array>;
    sign(data: Uint8Array, key: Uint8Array): Promise<Uint8Array>;
    verify(data: Uint8Array, signature: Uint8Array, key: Uint8Array): Promise<boolean>;
    generateNonce(length: number): Uint8Array;
    generateKeyPair(): {
        publicKey: Uint8Array;
        privateKey: Uint8Array;
    };
    computeSharedSecret(privateKey: Uint8Array, otherPublicKey: Uint8Array): Uint8Array;
}
