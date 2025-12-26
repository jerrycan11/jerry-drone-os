class DroneState {
  final String id;
  final double x;
  final double y;
  final double z;
  final double pitch;
  final double roll;
  final double yaw;
  final double batteryVoltage;
  final bool isArmed;
  final bool isLeader;

  DroneState({
    required this.id,
    required this.x,
    required this.y,
    required this.z,
    this.pitch = 0,
    this.roll = 0,
    this.yaw = 0,
    this.batteryVoltage = 0,
    this.isArmed = false,
    this.isLeader = false,
  });

  factory DroneState.initial() {
    return DroneState(id: 'drone-0', x: 0, y: 0, z: 0);
  }

  factory DroneState.fromJson(Map<String, dynamic> json) {
    // Single drone telemetry (legacy or single-drone mode)
    final payload = json['payload'] ?? {};
    final gps = payload['gps'] ?? {};
    final attitude = payload['attitude'] ?? {};
    final battery = payload['battery'] ?? {};

    return DroneState(
      id: json['id'] ?? 'drone-0',
      x: gps['lat'] ?? 0.0,
      y: gps['lon'] ?? 0.0,
      z: gps['alt'] ?? 0.0,
      pitch: attitude['pitch'] ?? 0.0,
      roll: attitude['roll'] ?? 0.0,
      yaw: attitude['yaw'] ?? 0.0,
      batteryVoltage: (battery['voltage'] ?? 0.0).toDouble(),
      isArmed: payload['status'] == 'ARMED',
      isLeader: true,
    );
  }

  factory DroneState.fromSwarmJson(Map<String, dynamic> json) {
    final pos = json['pos'] ?? {};
    return DroneState(
      id: json['id'] ?? 'unknown',
      x: (pos['x'] ?? 0.0).toDouble(),
      y: (pos['y'] ?? 0.0).toDouble(),
      z: (pos['z'] ?? 0.0).toDouble(),
      isArmed: json['status'] == 'ARMED',
      isLeader: json['isLeader'] ?? false,
    );
  }
}
