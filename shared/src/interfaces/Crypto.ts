export interface ICryptoProvider {
  /**
   * Encrypt data using a shared key or public key.
   */
  encrypt(data: Uint8Array, key: Uint8Array): Promise<Uint8Array>;

  /**
   * Decrypt data using a shared key or private key.
   */
  decrypt(data: Uint8Array, key: Uint8Array): Promise<Uint8Array>;

  /**
   * Sign data using a private key (HMAC or RSA/ECDSA).
   */
  sign(data: Uint8Array, key: Uint8Array): Promise<Uint8Array>;

  /**
   * Verify a signature.
   */
  verify(data: Uint8Array, signature: Uint8Array, key: Uint8Array): Promise<boolean>;

  /**
   * Generate a random nonce/IV.
   */
  generateNonce(length: number): Uint8Array;
}
