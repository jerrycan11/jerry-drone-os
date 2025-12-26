"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const NodeCryptoProvider_1 = require("./NodeCryptoProvider");
(0, vitest_1.describe)('NodeCryptoProvider', () => {
    let provider;
    (0, vitest_1.beforeAll)(() => {
        provider = new NodeCryptoProvider_1.NodeCryptoProvider();
    });
    (0, vitest_1.it)('should encrypt and decrypt data correctly', async () => {
        const key = provider.generateNonce(32); // AES-256 needs 32 bytes
        const text = 'Hello Secure World';
        const data = Buffer.from(text);
        const encrypted = await provider.encrypt(data, key);
        (0, vitest_1.expect)(encrypted.length).toBeGreaterThan(data.length); // IV + Tag overhead
        const decrypted = await provider.decrypt(encrypted, key);
        (0, vitest_1.expect)(decrypted.toString()).toBe(text);
    });
    (0, vitest_1.it)('should fail to decrypt with wrong key', async () => {
        const key1 = provider.generateNonce(32);
        const key2 = provider.generateNonce(32);
        const data = Buffer.from('Secret');
        const encrypted = await provider.encrypt(data, key1);
        await (0, vitest_1.expect)(provider.decrypt(encrypted, key2)).rejects.toThrow();
    });
    (0, vitest_1.it)('should sign and verify data', async () => {
        const key = provider.generateNonce(32);
        const data = Buffer.from('Important Command');
        const signature = await provider.sign(data, key);
        const isValid = await provider.verify(data, signature, key);
        (0, vitest_1.expect)(isValid).toBe(true);
    });
    (0, vitest_1.it)('should reject invalid signatures', async () => {
        const key = provider.generateNonce(32);
        const data = Buffer.from('Original');
        const signature = await provider.sign(data, key);
        const tamperedData = Buffer.from('Tampered');
        const isValid = await provider.verify(tamperedData, signature, key);
        (0, vitest_1.expect)(isValid).toBe(false);
    });
    (0, vitest_1.it)('should perform ECDH key exchange', () => {
        const alice = provider.generateKeyPair();
        const bob = provider.generateKeyPair();
        const aliceShared = provider.computeSharedSecret(alice.privateKey, bob.publicKey);
        const bobShared = provider.computeSharedSecret(bob.privateKey, alice.publicKey);
        (0, vitest_1.expect)(aliceShared).toEqual(bobShared);
    });
});
