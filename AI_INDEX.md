# AI Index

## Project: DroneOS

### System Architecture
*   **OS**: Event-driven, Plugin-based.
*   **HAL**: Interface-based hardware abstraction.
*   **Mock**: Stateful simulation of physical hardware.
*   **Comms**: AES-256 Encrypted JSON/Binary packets.

### Key Decisions
*   **Language**: TypeScript (Monorepo approach for OS/Mock/UI integration) selected for initial Phase 1 (Simulation). *Subject to change if low-level C++ required.*

### Components
*   **Swarm**: Mesh networking & distributed logic.
*   **SLAM**: Visual-Inertial Odometry & Octree mapping.
*   **Security**: TPM 2.0 simulation, Secure Boot, Anti-tamper.
*   **Safety**: Redundant voting logic (DO-178C style).

### Swarm Intelligence (Phase 22)
- [MeshNode.ts](file:///Users/jp_mac/workplace/Drone/os/src/swarm/MeshNode.ts): decentralized heartbeats and neighbor discovery.
- [LeaderElection.ts](file:///Users/jp_mac/workplace/Drone/os/src/swarm/LeaderElection.ts): Bully algorithm for swarm coordination.
- [SwarmManager.ts](file:///Users/jp_mac/workplace/Drone/os/src/swarm/SwarmManager.ts): Main swarm orchestrator.

### Flutter Simulator (Phase 23)
- [main.dart](file:///Users/jp_mac/workplace/Drone/simulator/lib/main.dart): Virtual Space UI with Terrain Selector and Obstacle rendering.
- [pubspec.yaml](file:///Users/jp_mac/workplace/Drone/simulator/pubspec.yaml): Flutter dependencies.

### Perception (Phase 21)
- [OctreeMap.ts](file:///Users/jp_mac/workplace/Drone/os/src/perception/OctreeMap.ts): 3D occupancy grid.
- [MockLidar.ts](file:///Users/jp_mac/workplace/Drone/mock/src/sensors/MockLidar.ts): Raycasting sensor.

### Global Context
*   User requires "Expert Advanced Level" quality (Military/Enterprise Grade).
*   Focus on Scalability, localized Autonomy, and Cyber-Physical Security.
*   **Key Standards**: DO-178C (Safety), FIPS 140-2 (Security).
