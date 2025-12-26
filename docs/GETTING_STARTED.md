# Getting Started with Drone OS

This guide will help you set up and run Drone OS for development or testing.

---

## Prerequisites

Before you begin, ensure you have:

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | 20+ | `node --version` |
| npm | 10+ | `npm --version` |
| TypeScript | 5.3+ | `npx tsc --version` |
| Git | 2.30+ | `git --version` |

**Optional for UI:**
- Flutter 3.16+ (`flutter --version`)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/drone-os.git
cd drone-os
```

### 2. Install Dependencies

```bash
npm install
```

This installs dependencies for all workspaces:
- `os` - Drone Operating System
- `mock` - Simulated Hardware
- `shared` - Common types and utilities
- `ui` - Flutter remote control app

### 3. Build the Project

```bash
npm run build
```

### 4. Verify Installation

```bash
npm run test
```

All tests should pass.

---

## Project Structure

```
drone-os/
├── os/                     # Main OS package
│   ├── src/
│   │   ├── core/           # Event loop, failsafe, watchdog
│   │   ├── plugins/        # Flight control, navigation
│   │   ├── comm/           # Communication transports
│   │   ├── security/       # TPM, encryption, EW defense
│   │   ├── perception/     # SLAM, mapping
│   │   ├── swarm/          # Mesh networking
│   │   ├── hal/            # Hardware abstraction
│   │   └── ai/             # Autopilot, mission planning
│   └── package.json
├── mock/                   # Simulated hardware
├── shared/                 # Shared types
├── ui/                     # Flutter app
├── docs/                   # Documentation
├── package.json            # Root workspace config
└── README.md
```

---

## Running the Simulator

### Start the Simulation Server

```bash
npm run sim:server --workspace=os
```

This starts a WebSocket server that simulates drone operations.

### Connect the UI (Flutter)

```bash
cd ui
flutter run -d chrome  # For web
# OR
flutter run -d macos   # For desktop
```

### Alternative: Run a Simple Flight Simulation

```bash
npx ts-node os/src/sim_hover.ts
```

This runs a hovering simulation without the UI.

---

## Quick Start Examples

### Example 1: Basic Hover

```typescript
import { EventLoop, FlightControlPlugin } from '@drone-os/os';

const loop = new EventLoop(100); // 100Hz
const fc = new FlightControlPlugin();

fc.arm();
fc.setThrottle(0.5);

loop.start();
```

### Example 2: Waypoint Mission

```typescript
import { NavigationPlugin, WaypointManager } from '@drone-os/os';

const nav = new NavigationPlugin();
const wm = new WaypointManager();

wm.addWaypoint({ id: 'WP1', lat: 37.7749, lng: -122.4194, alt: 50 });
wm.addWaypoint({ id: 'WP2', lat: 37.7849, lng: -122.4094, alt: 50 });

await nav.startMission(wm);
```

### Example 3: Swarm Formation

```typescript
import { SwarmManager, FormationType } from '@drone-os/os';

const swarm = new SwarmManager();

swarm.setFormation(FormationType.V_SHAPE);
swarm.startFollow();
```

---

## Configuration

### Deployment Configuration

Create `config/deployment.json`:

```json
{
  "mode": "SIMULATION",
  "tickRate": 100,
  "useMockHardware": true,
  "logging": {
    "level": "DEBUG",
    "file": "logs/drone.log"
  },
  "security": {
    "encryptionEnabled": true,
    "attestationRequired": false
  }
}
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DRONE_MODE` | `SIMULATION` or `REAL` | `SIMULATION` |
| `DRONE_LOG_LEVEL` | `DEBUG`, `INFO`, `WARN`, `ERROR` | `INFO` |
| `DRONE_WS_PORT` | WebSocket server port | `8080` |

---

## Common Tasks

### Run All Tests

```bash
npm run test
```

### Run Tests for Specific Package

```bash
npm run test --workspace=os
```

### Build for Production

```bash
npm run build
```

### Lint Code

```bash
npm run lint
```

### Format Code

```bash
npm run format
```

---

## Troubleshooting

### Issue: `Cannot find module '@drone-os/shared'`

**Solution:** Rebuild the shared package:

```bash
npm run build --workspace=shared
```

### Issue: TypeScript Errors

**Solution:** Clear build cache and rebuild:

```bash
rm -rf node_modules/.cache
npm run build
```

### Issue: WebSocket Connection Failed

**Solution:** Ensure the server is running and check the port:

```bash
# Check if port is in use
lsof -i :8080
```

---

## Next Steps

- [Read the Architecture Guide](docs/ARCHITECTURE.md)
- [Explore the API Reference](docs/API_REFERENCE.md)
- [Create a Custom Plugin](docs/PLUGIN_DEVELOPMENT.md)
- [Understand the Security Model](docs/SECURITY.md)

---

## Getting Help

- **GitHub Issues**: Report bugs or request features
- **Discussions**: Ask questions and share ideas
- **Wiki**: Community-contributed guides

---

Happy Flying! 🚁
