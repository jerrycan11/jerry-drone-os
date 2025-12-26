# Drone OS Documentation

Welcome to the Drone OS documentation! This index provides quick access to all available guides and references.

---

## 📚 Documentation Structure

```
docs/
├── GETTING_STARTED.md    # Quick start guide
├── ARCHITECTURE.md       # System design overview
├── API_REFERENCE.md      # Complete API documentation
├── SECURITY.md           # Security model and threats
├── PLUGIN_DEVELOPMENT.md # Creating custom plugins
└── project_task.md       # Development roadmap
```

---

## Quick Links

### For New Users

| Guide | Description |
|-------|-------------|
| [Getting Started](GETTING_STARTED.md) | Installation and first steps |
| [README](../README.md) | Project overview and features |
| [Architecture](ARCHITECTURE.md) | Understand the system design |

### For Developers

| Guide | Description |
|-------|-------------|
| [API Reference](API_REFERENCE.md) | Complete API documentation |
| [Plugin Development](PLUGIN_DEVELOPMENT.md) | Create custom extensions |
| [Contributing](../CONTRIBUTING.md) | How to contribute |

### For Security

| Guide | Description |
|-------|-------------|
| [Security Model](SECURITY.md) | Encryption, TPM, EW defense |
| [Threat Model](SECURITY.md#threat-model) | Known threats and mitigations |

---

## Module Documentation

### Core Modules

| Module | Description | Key Files |
|--------|-------------|-----------|
| Event Loop | Task scheduling | `core/EventLoop.ts` |
| Failsafe | Emergency procedures | `core/FailsafeMonitor.ts` |
| Watchdog | System health | `core/WatchdogMonitor.ts` |
| Redundancy | TMR voting | `core/RedundancyManager.ts` |

### Flight & Navigation

| Module | Description | Key Files |
|--------|-------------|-----------|
| Flight Control | PID stabilization | `plugins/flight-control/` |
| Navigation | Waypoint following | `plugins/navigation/` |
| Obstacle Avoidance | Potential fields | `plugins/navigation/PotentialFieldsNav.ts` |
| Visual Tracking | Follow mode | `plugins/navigation/VisualTracking.ts` |

### Communication

| Module | Description | Key Files |
|--------|-------------|-----------|
| Comm Manager | Transport routing | `comm/CommManager.ts` |
| 5G Slicing | QoS simulation | `comm/NetworkSlicingManager.ts` |
| Freq Hopping | Anti-jamming | `comm/FrequencyHopping.ts` |
| Cloud API | Enterprise reporting | `comm/CloudFleetAPI.ts` |

### Security

| Module | Description | Key Files |
|--------|-------------|-----------|
| TPM | Platform security | `security/MockTPM.ts` |
| Secure Boot | Boot verification | `security/SecureBoot.ts` |
| Attestation | Remote verification | `security/AttestationManager.ts` |
| GPS Spoofing | Detection | `security/GPSSpoofingDetector.ts` |
| Jamming | Detection | `security/JammingDetector.ts` |

### Perception & AI

| Module | Description | Key Files |
|--------|-------------|-----------|
| SLAM | Position tracking | `perception/SLAMModule.ts` |
| Octree Map | 3D mapping | `perception/OctreeMap.ts` |
| AI Pilot | Autonomous flight | `ai/AIPilot.ts` |
| Mission Planner | Path optimization | `ai/MissionPlanner.ts` |
| Vision Processor | Object detection | `core/payloads/VisionProcessor.ts` |

### Swarm Intelligence

| Module | Description | Key Files |
|--------|-------------|-----------|
| Mesh Node | P2P communication | `swarm/MeshNode.ts` |
| Leader Election | Consensus | `swarm/LeaderElection.ts` |
| Swarm Manager | Formation control | `swarm/SwarmManager.ts` |

### Maintenance

| Module | Description | Key Files |
|--------|-------------|-----------|
| Vibration | Fault detection | `core/maintenance/VibrationAnalyzer.ts` |
| Battery | Health prediction | `core/maintenance/BatteryHealthModel.ts` |

---

## Development Phases

The project was developed in 33 phases:

| Phase | Focus | Status |
|-------|-------|--------|
| 1-9 | Foundation, HAL, Plugins | ✅ Complete |
| 10-18 | Security, Comms, UI | ✅ Complete |
| 19-25 | AI, Testing, Perception | ✅ Complete |
| 26-28 | TPM, 5G, DO-178C Safety | ✅ Complete |
| 29-31 | EW Defense, Payloads, Maintenance | ✅ Complete |
| 32-33 | Autonomy, Red Team Validation | ✅ Complete |

See [project_task.md](project_task.md) for detailed phase breakdown.

---

## External Resources

- [PX4 Documentation](https://docs.px4.io/) - Reference autopilot
- [ArduPilot](https://ardupilot.org/) - Open-source autopilot
- [ROS2](https://docs.ros.org/) - Robot Operating System
- [DO-178C](https://en.wikipedia.org/wiki/DO-178C) - Aviation software standard
- [TPM 2.0 Spec](https://trustedcomputinggroup.org/) - Trusted Platform Module

---

## Need Help?

- 🐛 [Report a Bug](https://github.com/yourusername/drone-os/issues/new?template=bug_report.md)
- 💡 [Request a Feature](https://github.com/yourusername/drone-os/issues/new?template=feature_request.md)
- 💬 [Ask a Question](https://github.com/yourusername/drone-os/discussions)

---

Happy Flying! 🚁
