"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeCryptoProvider = void 0;
const crypto = __importStar(require("crypto"));
class NodeCryptoProvider {
    // AES-256-GCM Configuration
    ALGORITHM = 'aes-256-gcm';
    IV_LENGTH = 12; // 96 bits recommended for GCM
    TAG_LENGTH = 16; // 128 bits
    async encrypt(data, key) {
        const iv = this.generateNonce(this.IV_LENGTH);
        const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);
        // Encrypt
        const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
        const tag = cipher.getAuthTag();
        // Output: IV + Tag + EncryptedData
        return Buffer.concat([iv, tag, encrypted]);
    }
    async decrypt(data, key) {
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
    async sign(data, key) {
        const hmac = crypto.createHmac('sha256', key);
        hmac.update(data);
        return hmac.digest();
    }
    async verify(data, signature, key) {
        const hmac = crypto.createHmac('sha256', key);
        hmac.update(data);
        const digest = hmac.digest();
        // Constant time comparison to prevent timing attacks
        return crypto.timingSafeEqual(digest, signature);
    }
    generateNonce(length) {
        return crypto.randomBytes(length);
    }
    // Key Exchange Helpers
    generateKeyPair() {
        const ecdh = crypto.createECDH('secp256k1');
        ecdh.generateKeys();
        return {
            publicKey: ecdh.getPublicKey(),
            privateKey: ecdh.getPrivateKey()
        };
    }
    computeSharedSecret(privateKey, otherPublicKey) {
        const ecdh = crypto.createECDH('secp256k1');
        ecdh.setPrivateKey(privateKey);
        return ecdh.computeSecret(otherPublicKey);
    }
}
exports.NodeCryptoProvider = NodeCryptoProvider;
