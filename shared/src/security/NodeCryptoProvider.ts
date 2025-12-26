import * as crypto from 'crypto';
import { ICryptoProvider } from '../interfaces/Crypto';

export class NodeCryptoProvider implements ICryptoProvider {
  // AES-256-GCM Configuration
  private readonly ALGORITHM = 'aes-256-gcm';
  private readonly IV_LENGTH = 12; // 96 bits recommended for GCM
  private readonly TAG_LENGTH = 16; // 128 bits

  async encrypt(data: Uint8Array, key: Uint8Array): Promise<Uint8Array> {
    const iv = this.generateNonce(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);
    
    // Encrypt
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    const tag = cipher.getAuthTag();

    // Output: IV + Tag + EncryptedData
    return Buffer.concat([iv, tag, encrypted]);
  }

  async decrypt(data: Uint8Array, key: Uint8Array): Promise<Uint8Array> {
    // Parse: IV + Tag + EncryptedData
    const buffer = Buffer.from(data);
    
    if (buffer.length < this.IV_LENGTH + this.TAG_LENGTH) {
        throw new Error('Data too short for decryption');
    }

    const iv = buffer.subarray(0, this.IV_LENGTH);
    const tag = buffer.subarray(this.IV_LENGTH, this.IV_LENGTH + this.TAG_LENGTH);
    const text = buffer.subarray(this.IV_LENGTH + this.TAG_LENGTH);

    const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    return Buffer.concat([decipher.update(text), decipher.final()]);
  }

  async sign(data: Uint8Array, key: Uint8Array): Promise<Uint8Array> {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(data);
    return hmac.digest();
  }

  async verify(data: Uint8Array, signature: Uint8Array, key: Uint8Array): Promise<boolean> {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(data);
    const digest = hmac.digest();
    
    // Constant time comparison to prevent timing attacks
    return crypto.timingSafeEqual(digest, signature);
  }

  generateNonce(length: number): Uint8Array {
    return crypto.randomBytes(length);
  }

  // Key Exchange Helpers
  generateKeyPair(): { publicKey: Uint8Array; privateKey: Uint8Array } {
    const ecdh = crypto.createECDH('secp256k1');
    ecdh.generateKeys();
    return {
        publicKey: ecdh.getPublicKey(),
        privateKey: ecdh.getPrivateKey()
    };
  }

  computeSharedSecret(privateKey: Uint8Array, otherPublicKey: Uint8Array): Uint8Array {
    const ecdh = crypto.createECDH('secp256k1');
    ecdh.setPrivateKey(privateKey);
    return ecdh.computeSecret(otherPublicKey);
  }
}
