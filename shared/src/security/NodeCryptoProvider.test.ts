import { describe, it, expect, beforeAll } from 'vitest';
import { NodeCryptoProvider } from './NodeCryptoProvider';

describe('NodeCryptoProvider', () => {
  let provider: NodeCryptoProvider;
  
  beforeAll(() => {
    provider = new NodeCryptoProvider();
  });

  it('should encrypt and decrypt data correctly', async () => {
    const key = provider.generateNonce(32); // AES-256 needs 32 bytes
    const text = 'Hello Secure World';
    const data = Buffer.from(text);

    const encrypted = await provider.encrypt(data, key);
    expect(encrypted.length).toBeGreaterThan(data.length); // IV + Tag overhead

    const decrypted = await provider.decrypt(encrypted, key);
    expect(decrypted.toString()).toBe(text);
  });

  it('should fail to decrypt with wrong key', async () => {
    const key1 = provider.generateNonce(32);
    const key2 = provider.generateNonce(32);
    const data = Buffer.from('Secret');

    const encrypted = await provider.encrypt(data, key1);
    
    await expect(provider.decrypt(encrypted, key2)).rejects.toThrow();
  });

  it('should sign and verify data', async () => {
    const key = provider.generateNonce(32);
    const data = Buffer.from('Important Command');

    const signature = await provider.sign(data, key);
    const isValid = await provider.verify(data, signature, key);

    expect(isValid).toBe(true);
  });

  it('should reject invalid signatures', async () => {
    const key = provider.generateNonce(32);
    const data = Buffer.from('Original');
    const signature = await provider.sign(data, key);

    const tamperedData = Buffer.from('Tampered');
    const isValid = await provider.verify(tamperedData, signature, key);

    expect(isValid).toBe(false);
  });

  it('should perform ECDH key exchange', () => {
    const alice = provider.generateKeyPair();
    const bob = provider.generateKeyPair();

    const aliceShared = provider.computeSharedSecret(alice.privateKey, bob.publicKey);
    const bobShared = provider.computeSharedSecret(bob.privateKey, alice.publicKey);

    expect(aliceShared).toEqual(bobShared);
  });
});
