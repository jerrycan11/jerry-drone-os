import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import '../models/drone_state.dart';

class TelemetryService extends ChangeNotifier {
  WebSocketChannel? _channel;
  DroneState _state = DroneState.initial();
  List<DroneState> _swarm = [];
  bool _isConnected = false;

  DroneState get state => _state;
  List<DroneState> get swarm => _swarm;
  bool get isConnected => _isConnected;

  void connect(String url) {
    try {
      _channel = WebSocketChannel.connect(Uri.parse(url));
      _isConnected = true;
      notifyListeners();

      _channel!.stream.listen((message) {
        String stringMessage;
        if (message is String) {
          stringMessage = message;
        } else {
          // Handle binary data (Uint8List/List<int>)
          stringMessage = utf8.decode(message as List<int>);
        }
        
        final data = jsonDecode(stringMessage);
        final type = data['type'];
        final payload = data['payload'] ?? {};

        if (type == 'SWARM_TELEMETRY') {
          final List dronesJson = payload['drones'] ?? [];
          _swarm = dronesJson.map((d) => DroneState.fromSwarmJson(d)).toList();
          if (_swarm.isNotEmpty) {
            _state = _swarm.first; // Compat with single-drone UI elements
          }
        } else {
          _state = DroneState.fromJson(data);
          _swarm = [_state];
        }
        
        notifyListeners();
      }, onError: (e) {
        _isConnected = false;
        notifyListeners();
      }, onDone: () {
        _isConnected = false;
        notifyListeners();
      });
    } catch (e) {
      _isConnected = false;
      notifyListeners();
    }
  }

  void sendCommand(String command, {Map<String, dynamic>? params}) {
    if (_channel != null && _isConnected) {
      final msg = jsonEncode({
        'command': command,
        'params': params ?? {},
        'timestamp': DateTime.now().millisecondsSinceEpoch,
      });
      _channel!.sink.add(msg);
    }
  }

  void disconnect() {
    _channel?.sink.close();
    _isConnected = false;
    notifyListeners();
  }

  @override
  void dispose() {
    disconnect();
    super.dispose();
  }
}
