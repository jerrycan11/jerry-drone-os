"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyStore = void 0;
const NodeCryptoProvider_1 = require("./NodeCryptoProvider");
class KeyStore {
    crypto;
    keys = new Map();
    constructor() {
        this.crypto = new NodeCryptoProvider_1.NodeCryptoProvider();
    }
    // Store a shared key
    setKey(id, key) {
        this.keys.set(id, key);
    }
    getKey(id) {
        return this.keys.get(id);
    }
    hasKey(id) {
        return this.keys.has(id);
    }
    generateRandomKey(length = 32) {
        return this.crypto.generateNonce(length);
    }
}
exports.KeyStore = KeyStore;
