# Drone OS Security Model

This document describes the security architecture and threat mitigation strategies in Drone OS.

---

## Table of Contents

1. [Security Overview](#security-overview)
2. [Cryptographic Primitives](#cryptographic-primitives)
3. [Trusted Platform Module (TPM)](#trusted-platform-module-tpm)
4. [Secure Boot Chain](#secure-boot-chain)
5. [Remote Attestation](#remote-attestation)
6. [Electronic Warfare Defense](#electronic-warfare-defense)
7. [Communication Security](#communication-security)
8. [Threat Model](#threat-model)

---

## Security Overview

Drone OS implements defense-in-depth with multiple security layers:

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Security                      │
│         (Access Control, Input Validation, Audit Logs)       │
├─────────────────────────────────────────────────────────────┤
│                  Communication Security                       │
│    (AES-256, ECDH Key Exchange, HMAC, Replay Protection)     │
├─────────────────────────────────────────────────────────────┤
│                   Platform Security                           │
│      (TPM, Secure Boot, Remote Attestation, Watchdog)        │
├─────────────────────────────────────────────────────────────┤
│                Electronic Warfare Defense                     │
│   (GPS Spoofing Detection, Jamming Detection, Freq Hopping)  │
└─────────────────────────────────────────────────────────────┘
```

---

## Cryptographic Primitives

### Encryption

| Algorithm | Use Case | Key Size |
|-----------|----------|----------|
| AES-256-GCM | Data encryption | 256-bit |
| ECDH (P-256) | Key exchange | 256-bit |
| HMAC-SHA256 | Packet signing | 256-bit |
| SHA-256 | Hashing, PCR extension | 256-bit |

### Implementation

```typescript
// Encryption
const encrypted = cryptoProvider.encrypt(plaintext, key, iv);

// Signing
const signature = cryptoProvider.sign(data, privateKey);

// Key Exchange
const sharedSecret = cryptoProvider.deriveSharedSecret(myPrivate, theirPublic);
```

---

## Trusted Platform Module (TPM)

### Overview

The simulated TPM 2.0 provides:

- **Key Storage**: Endorsement Key (EK), Attestation Identity Key (AIK)
- **Platform Configuration Registers (PCRs)**: Integrity measurements
- **Cryptographic Operations**: Signing, hashing

### PCR Allocation

| PCR | Contents |
|-----|----------|
| 0 | Bootloader measurement |
| 1 | OS Kernel measurement |
| 2 | Plugin measurements |
| 3-23 | Reserved/Available |

### PCR Extension

PCRs are extended (not overwritten) using:

```
PCR[i] = SHA256(PCR[i] || new_data)
```

This creates a hash chain that cannot be reversed.

---

## Secure Boot Chain

### Boot Sequence

```
1. Power On
      │
      ▼
2. Bootloader (measured → PCR[0])
      │
      ▼
3. Kernel (measured → PCR[1])
      │
      ▼
4. Critical Plugins (measured → PCR[2])
      │
      ▼
5. System Ready (if all measurements pass)
```

### Failure Handling

If any component fails verification:
- Log the failure
- Enter "Safe Mode" with limited functionality
- Alert ground station

---

## Remote Attestation

### Protocol

```
Ground Station                     Drone
      │                              │
      │──── Challenge (Nonce) ──────▶│
      │                              │
      │                        Generate Quote
      │                        (Sign PCRs + Nonce)
      │                              │
      │◀─── Quote + Signature ───────│
      │                              │
 Verify Signature                    │
 Compare PCRs to "Golden Image"      │
      │                              │
```

### Quote Structure

```typescript
{
  quote: string;        // SHA256(nonce + PCR values)
  signature: string;    // RSA signature with AIK
  pcrValues: {
    0: "ca71194a52f0baf...",
    1: "623f3e3665d8027...",
    2: "bf5083e505ba55f..."
  }
}
```

---

## Electronic Warfare Defense

### GPS Spoofing Detection

**Method**: Cross-reference GPS velocity with integrated IMU acceleration.

```
GPS Velocity ──┬── Compare ── Confidence Score
               │
IMU Velocity ──┘

If divergence > threshold:
  Reduce confidence
  If confidence < 0.5:
    Trigger RTH
```

**Thresholds**:
- Max velocity error: 5 m/s
- Confidence recovery: +0.05 per valid sample
- Confidence degradation: -0.1 per invalid sample

### Jamming Detection

**Method**: Monitor RF noise floor and signal quality.

```
If noise_floor > -40 dBm AND signal_quality < 10%:
  isJammed = true
  Trigger failsafe
```

**Failsafe Options**:
- Return To Home (GPS/IMU based)
- Silent Mode (disable transmissions)
- Land immediately

### Frequency Hopping

Pseudorandom channel switching to evade narrowband jammers:

```typescript
const hoppingSequence = shuffle(channels, seed);
// Both drone and GCS use same seed for synchronization
```

---

## Communication Security

### Packet Structure

```
┌────────┬──────────┬───────────┬─────────┬──────────┐
│ Header │ Nonce    │ Encrypted │ HMAC    │ Checksum │
│ (4B)   │ (12B)    │ Payload   │ (32B)   │ (4B)     │
└────────┴──────────┴───────────┴─────────┴──────────┘
```

### Replay Protection

Each packet includes:
- **Nonce**: Unique random value
- **Timestamp**: Must be within 30-second window
- **Sequence Number**: Must be monotonically increasing

### Key Rotation

Session keys are rotated:
- Every 30 minutes
- After 1 million packets
- On explicit command from GCS

---

## Threat Model

### Threats and Mitigations

| Threat | Attack Vector | Mitigation |
|--------|---------------|------------|
| Eavesdropping | RF interception | AES-256 encryption |
| MITM | Fake base station | ECDH + authentication |
| Replay Attack | Captured packets | Nonce + timestamp |
| GPS Spoofing | Fake GPS signals | IMU cross-validation |
| RF Jamming | High-power interference | Freq hopping, RTH |
| Firmware Tampering | Malicious update | Secure boot, attestation |
| Physical Access | Hardware manipulation | TPM, tamper detection |

### Security Levels

| Level | Requirements | Use Case |
|-------|--------------|----------|
| Basic | Encryption only | Hobby/Consumer |
| Standard | + Authentication | Commercial |
| High | + TPM + Attestation | Enterprise |
| Critical | + TMR + DO-178C | Military/Safety |

---

## Security Audit Logging

All security events are logged:

```typescript
securityLogger.log({
  event: 'GPS_SPOOFING_DETECTED',
  severity: 'CRITICAL',
  confidence: 0.3,
  timestamp: Date.now()
});
```

Logs include:
- Authentication attempts
- Encryption errors
- EW attack detections
- Failsafe triggers

---

## Best Practices

### For Operators

1. Change default keys before deployment
2. Enable remote attestation for fleet management
3. Regularly audit security logs
4. Keep firmware updated

### For Developers

1. Never log sensitive keys
2. Use constant-time comparison for secrets
3. Validate all external input
4. Fail securely (deny by default)

---

## See Also

- [Architecture Guide](ARCHITECTURE.md)
- [API Reference](API_REFERENCE.md)
