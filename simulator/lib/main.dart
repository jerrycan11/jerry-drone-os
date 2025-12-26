import 'dart:math' as math;
import 'package:vector_math/vector_math_64.dart' as v;
import 'package:flutter/material.dart';
import 'services/telemetry_service.dart';
import 'models/drone_state.dart';

void main() {
  runApp(const DroneSimulatorApp());
}

class DroneSimulatorApp extends StatelessWidget {
  const DroneSimulatorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Drone Virtual Space',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const SimulatorHome(),
    );
  }
}

class SimulatorHome extends StatefulWidget {
  const SimulatorHome({super.key});

  @override
  State<SimulatorHome> createState() => _SimulatorHomeState();
}

class _SimulatorHomeState extends State<SimulatorHome> {
  String selectedTerrain = 'Simple Map';
  final TelemetryService _telemetry = TelemetryService();

  @override
  void initState() {
    super.initState();
    // Connect to the local Drone OS simulation server
    _telemetry.connect('ws://localhost:8080');
  }

  @override
  void dispose() {
    _telemetry.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: _telemetry,
      builder: (context, _) {
        final state = _telemetry.state;

        return Scaffold(
          appBar: AppBar(
            title: const Text('Drone OS Virtual Space Simulator'),
            actions: [
              Chip(
                label: Text(_telemetry.isConnected ? 'OS CONNECTED' : 'OS DISCONNECTED'),
                backgroundColor: _telemetry.isConnected ? Colors.green : Colors.red,
              ),
              const SizedBox(width: 10),
            ],
          ),
          body: Row(
            children: [
              // Sidebar
              Container(
                width: 250,
                color: Colors.black26,
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      const Padding(
                        padding: EdgeInsets.all(16.0),
                        child: Text('TERRAINS', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                      ),
                    ListTile(
                      title: const Text('Simple Map (with obstacles)'),
                      selected: selectedTerrain == 'Simple Map',
                      onTap: () => setState(() => selectedTerrain = 'Simple Map'),
                    ),
                    ListTile(
                      title: const Text('Urban Grid'),
                      selected: selectedTerrain == 'Urban Grid',
                      onTap: () => setState(() => selectedTerrain = 'Urban Grid'),
                    ),
                    const Divider(),
                    const Padding(
                      padding: EdgeInsets.all(16.0),
                      child: Text('SWARM STATUS', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                    ..._telemetry.swarm.map((d) => _buildTelemetryTile(
                      d.id, 
                      '${d.isLeader ? "LEADER" : "FOLLOWER"} (${d.z.toStringAsFixed(1)}m)',
                      color: d.isLeader ? Colors.amber : Colors.blueAccent,
                    )).toList(),
                    const Divider(),
                    const Padding(
                      padding: EdgeInsets.all(16.0),
                      child: Text('CONTROLS', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        ElevatedButton(
                          onPressed: () => _telemetry.sendCommand('ARM'),
                          style: ElevatedButton.styleFrom(backgroundColor: Colors.green[800]),
                          child: const Text('ARM'),
                        ),
                        ElevatedButton(
                          onPressed: () => _telemetry.sendCommand('DISARM'),
                          style: ElevatedButton.styleFrom(backgroundColor: Colors.red[800]),
                          child: const Text('DIS'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    _buildControlPad(),
                  ],
                ),
              ),
            ),
              // Virtual Space Rendering
              Expanded(
                child: Container(
                  color: Colors.grey[900],
                  child: Stack(
                    children: [
                      Positioned.fill(
                        child: CustomPaint(
                          painter: TerrainPainter(
                            selectedTerrain: selectedTerrain,
                            drones: _telemetry.swarm,
                          ),
                        ),
                      ),
                      const Positioned(
                        bottom: 20,
                        right: 20,
                        child: Text('Scale: 1px = 1m (Center is 0,0)', style: TextStyle(color: Colors.white54)),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      }
    );
  }

  Widget _buildControlPad() {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _actionButton('GRID', () => _telemetry.sendCommand('SET_FORMATION', params: {'type': 'GRID'})),
            _actionButton('V-SHAPE', () => _telemetry.sendCommand('SET_FORMATION', params: {'type': 'V_SHAPE'})),
            _actionButton('CIRCLE', () => _telemetry.sendCommand('SET_FORMATION', params: {'type': 'CIRCLE'})),
          ],
        ),
        const SizedBox(height: 10),
        _controlButton('UP', 'MOVE', {'vx': 0, 'vy': 5, 'vz': 0}),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _controlButton('LEFT', 'MOVE', {'vx': -5, 'vy': 0, 'vz': 0}),
            const SizedBox(width: 40),
            _controlButton('RIGHT', 'MOVE', {'vx': 5, 'vy': 0, 'vz': 0}),
          ],
        ),
        _controlButton('DOWN', 'MOVE', {'vx': 0, 'vy': -5, 'vz': 0}),
      ],
    );
  }

  Widget _actionButton(String label, VoidCallback onPressed) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 2),
      child: TextButton(
        onPressed: onPressed,
        style: TextButton.styleFrom(
          visualDensity: VisualDensity.compact,
          padding: const EdgeInsets.symmetric(horizontal: 4),
          backgroundColor: Colors.white10,
        ),
        child: Text(label, style: const TextStyle(fontSize: 9, color: Colors.white70)),
      ),
    );
  }

  Widget _controlButton(String label, String cmd, Map<String, dynamic> params) {
    return IconButton(
      icon: Text(label, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 10)),
      onPressed: () => _telemetry.sendCommand(cmd, params: params),
      style: IconButton.styleFrom(
        backgroundColor: Colors.white10,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }

  Widget _buildTelemetryTile(String label, String value, {Color? color}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.white70, fontSize: 12)),
          Text(value, style: TextStyle(fontWeight: FontWeight.bold, color: color, fontSize: 12)),
        ],
      ),
    );
  }
}

class Drone3DPainter extends CustomPainter {
  final String selectedTerrain;
  final List<DroneState> drones;
  final double cameraHeight = 100.0;
  final double fov = 60.0;

  Drone3DPainter({
    required this.selectedTerrain,
    required this.drones,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // Setup Perspective Projection
    final projection = v.makePerspectiveMatrix(
      v.radians(fov),
      size.width / size.height,
      1.0, 1000.0
    );

    // Camera looking from top-back, centered on swarm
    double avgX = 0, avgY = 0;
    if (drones.isNotEmpty) {
      avgX = drones.map((d) => d.x).reduce((a, b) => a + b) / drones.length;
      avgY = drones.map((d) => d.y).reduce((a, b) => a + b) / drones.length;
    }

    final cameraPos = v.Vector3(avgX, avgY - 60.0, 80.0);
    final lookAt = v.Vector3(avgX, avgY, 0.0);
    final up = v.Vector3(0, 0, 1);
    
    final view = v.makeViewMatrix(cameraPos, lookAt, up);
    final mvp = projection * view;

    // Draw Ground Grid
    final gridPaint = Paint()..color = Colors.white12..strokeWidth = 1;
    const gridStep = 10.0;
    const gridRange = 200.0;

    for (double x = -gridRange; x <= gridRange; x += gridStep) {
      _drawLine3D(canvas, size, mvp, v.Vector3(x, -gridRange, 0), v.Vector3(x, gridRange, 0), gridPaint);
    }
    for (double y = -gridRange; y <= gridRange; y += gridStep) {
      _drawLine3D(canvas, size, mvp, v.Vector3(-gridRange, y, 0), v.Vector3(gridRange, y, 0), gridPaint);
    }

    // Draw Obstacles
    if (selectedTerrain == 'Simple Map') {
      _drawBox3D(canvas, size, mvp, 9.5, 10.5, -10, 10, 20.0, Colors.amber.withOpacity(0.4));
      _drawBox3D(canvas, size, mvp, -20, -15, -20, -15, 10.0, Colors.amber.withOpacity(0.4));
    }

    // Draw Drones
    for (final drone in drones) {
      _drawDrone3D(canvas, size, mvp, drone);
    }
  }

  void _drawLine3D(Canvas canvas, Size size, v.Matrix4 mvp, v.Vector3 p1, v.Vector3 p2, Paint paint) {
    final v1 = _project(p1, mvp, size);
    final v2 = _project(p2, mvp, size);
    if (v1 != null && v2 != null) canvas.drawLine(v1, v2, paint);
  }

  void _drawBox3D(Canvas canvas, Size size, v.Matrix4 mvp, double minX, double maxX, double minY, double maxY, double height, Color color) {
    final stroke = Paint()..color = color.withOpacity(0.8)..style = PaintingStyle.stroke..strokeWidth = 1;

    final corners = [
      v.Vector3(minX, minY, 0), v.Vector3(maxX, minY, 0),
      v.Vector3(maxX, maxY, 0), v.Vector3(minX, maxY, 0),
      v.Vector3(minX, minY, height), v.Vector3(maxX, minY, height),
      v.Vector3(maxX, maxY, height), v.Vector3(minX, maxY, height),
    ];

    final projected = corners.map((c) => _project(c, mvp, size)).toList();

    for (int i = 0; i < 4; i++) {
        final p1 = projected[i];
        final p2 = projected[(i + 1) % 4];
        final p3 = projected[i + 4];
        final p4 = projected[(i + 1) % 4 + 4];
        if (p1 != null && p2 != null) canvas.drawLine(p1, p2, stroke);
        if (p3 != null && p4 != null) canvas.drawLine(p3, p4, stroke);
        if (p1 != null && p3 != null) canvas.drawLine(p1, p3, stroke);
    }
  }

  void _drawDrone3D(Canvas canvas, Size size, v.Matrix4 mvp, DroneState drone) {
    final dronePos = v.Vector3(drone.x, drone.y, drone.z);
    final projectedCenter = _project(dronePos, mvp, size);
    if (projectedCenter == null) return;

    final droneColor = drone.isLeader ? Colors.amber : Colors.blueAccent;
    final shadowPos = _project(v.Vector3(drone.x, drone.y, 0), mvp, size);
    if (shadowPos != null) {
      canvas.drawCircle(shadowPos, 5, Paint()..color = Colors.black45);
      canvas.drawLine(shadowPos, projectedCenter, Paint()..color = Colors.white10..strokeWidth = 1);
    }

    final q = v.Quaternion.euler(v.radians(drone.pitch), v.radians(drone.roll), v.radians(drone.yaw));
    final modelMatrix = v.Matrix4.compose(dronePos, q, v.Vector3.all(1.0));
    final finalMvp = mvp * modelMatrix;

    final armPaint = Paint()..color = Colors.white70..strokeWidth = 2;
    _drawLine3D(canvas, size, finalMvp, v.Vector3(-4, -4, 0), v.Vector3(4, 4, 0), armPaint);
    _drawLine3D(canvas, size, finalMvp, v.Vector3(-4, 4, 0), v.Vector3(4, -4, 0), armPaint);

    final f1 = _project(v.Vector3(0, 4, 0), finalMvp, size);
    final f2 = _project(v.Vector3(0, 6, 0), finalMvp, size);
    if (f1 != null && f2 != null) canvas.drawLine(f1, f2, Paint()..color = Colors.red..strokeWidth = 3);

    final textPainter = TextPainter(
      text: TextSpan(text: drone.id, style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 9, fontWeight: FontWeight.bold)),
      textDirection: TextDirection.ltr,
    )..layout();
    textPainter.paint(canvas, Offset(projectedCenter.dx - 15, projectedCenter.dy + 10));
  }

  Offset? _project(v.Vector3 p, v.Matrix4 mvp, Size size) {
    final v4 = v.Vector4(p.x, p.y, p.z, 1.0);
    final projected = mvp * v4;
    if (projected.w <= 0) return null;
    final ndc = projected.xyz / projected.w;
    return Offset((ndc.x + 1.0) * size.width / 2.0, (1.0 - ndc.y) * size.height / 2.0);
  }

  @override
  bool shouldRepaint(covariant Drone3DPainter oldDelegate) => true;
}

class TerrainPainter extends Drone3DPainter {
  TerrainPainter({required super.selectedTerrain, required super.drones});
}

extension CanvasExtension on Canvas {
  void drawPolygon(List<Offset> points, Paint paint) {
    if (points.isEmpty) return;
    final path = Path()..moveTo(points[0].dx, points[0].dy);
    for (var i = 1; i < points.length; i++) {
      path.lineTo(points[i].dx, points[i].dy);
    }
    path.close();
    drawPath(path, paint);
  }
}

