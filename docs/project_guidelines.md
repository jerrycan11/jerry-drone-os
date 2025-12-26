# Drone OS Project Guidelines

## Project Overview
This project aims to build a scalable, advanced Drone Operating System (Drone OS) from scratch, capable of running on a Mock Drone Hardware environment for testing and development, with the capability to interface with real hardware in the future.

## Key Objectives
1.  **Configurable Drone OS**: The OS/Kernel must be modular, using a plugin-based architecture for subsystems (Flight Control, Navigation, Communication, Vision).
2.  **Adaptability**: The system must be decoupled from specific hardware interfaces, allowing for easy updates and hardware-swapping.
3.  **Advanced Connectivity**: Support for multiple remote control channels:
    - Bluetooth (Short range)
    - WiFi (Medium range)
    - Cellular (Long range)
    - Satellite (Global range)
4.  **Security**: All communication channels must be encrypted using AES-256 standards. Data integrity should be verified (e.g., HMAC-SHA256).
5.  **Mock Environment**: A fully functional mock hardware layer to simulate sensors (IMU, Barometer, GPS), actuators (Motors, Servos), and batteries.
6.  **Remote UI**: A modern, responsive user interface for remote operation and telemetry monitoring.

## Architecture

### 1. Drone OS (Core)
*   **Kernel/Core**: Manages the event loop, task scheduling, and state management.
*   **HAL (Hardware Abstraction Layer)**: Standard interface for sensors and actuators.
*   **Plugin System**: Loadable modules for logic (e.g., "stabilization plugin", "waypoint navigation plugin").
*   **Security Layer**: Encrypts/Decrypts outgoing/incoming packets.

### 2. Mock Hardware
*   **Physics Engine (Basic)**: Simulates physical response to motor outputs (Simulated gravity, inertia).
*   **Virtual Components**: Software classes representing physical devices.
*   **Environment Simulation**: Simulates wind, signal loss (optional but good for advanced testing).

### 3. User Interface (Ground Control Station)
*   **Dashboard**: Real-time telemetry (Altitude, Speed, Battery, Location).
*   **Control Panel**: Inputs for manual control and mode switching.
*   **Map View**: Waypoint planning.

## Technical Standards
*   **Language**: TypeScript/Node.js (for rapid prototyping/simulation capability and UI sharing) OR C++/Python if preferred for realism. *Decision: TypeScript for this phase for full-stack consistency and rapid "Mock" development, unless Low-level performance is strictly requested immediately.*
*   **Encryption**: AES-256 for payload encryption.
*   **Communication Protocol**: Custom JSON or Binary protocol over Websockets/TCP/UDP.
*   **Architecture Pattern**: Event-Driven Architecture.

## Directory Structure
```
/root
  /os          # The Drone Operating System Code
  /mock        # The Virtual Hardware and Physics implementation
  /ui          # The Ground Control Station Web App
  /shared      # Shared types and protocol definitions
  /docs        # Documentation
```
