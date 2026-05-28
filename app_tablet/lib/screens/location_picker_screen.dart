import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class LocationPickerScreen extends StatefulWidget {
  final String token;
  final Function(int locationId, String locationPath) onSelected;
  const LocationPickerScreen({super.key, required this.token, required this.onSelected});

  @override
  State<LocationPickerScreen> createState() => _LocationPickerScreenState();
}

class _LocationPickerScreenState extends State<LocationPickerScreen> {
  List<dynamic> tree = [];
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _fetchTree();
  }

  Future<void> _fetchTree() async {
    try {
      final res = await http.get(
        Uri.parse('${dotenv.env['API_URL'] ?? 'http://10.0.2.2:8080'}/api/locations/tree'),
        headers: {'Authorization': 'Bearer ${widget.token}'},
      );
      if (res.statusCode == 200) {
        setState(() { tree = jsonDecode(res.body); loading = false; });
      } else {
        throw Exception('Lỗi ${res.statusCode}');
      }
    } catch (e) {
      setState(() { error = e.toString(); loading = false; });
    }
  }

  // Hàm xây dựng danh sách widget từ cây, dùng đệ quy
  List<Widget> _buildTreeNodes(List<dynamic> nodes, String parentPath) {
    List<Widget> widgets = [];
    for (var node in nodes) {
      final String nodeName = node['name'];
      final String nodeType = node['type'];
      final int nodeId = node['id'];
      final List<dynamic> children = node['children'] ?? [];
      final String currentPath = parentPath.isEmpty ? nodeName : '$parentPath > $nodeName';

      if (children.isEmpty) {
        widgets.add(
          ListTile(
            title: Text("$nodeName ($nodeType)"),
            trailing: const Icon(Icons.check_circle_outline),
            onTap: () {
              widget.onSelected(nodeId, currentPath);
              Navigator.pop(context);
            },
          ),
        );
      } else {
        widgets.add(
          ExpansionTile(
            title: Text("$nodeName ($nodeType)"),
            children: _buildTreeNodes(children, currentPath),
          ),
        );
      }
    }
    return widgets;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Chọn vị trí")),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error != null
          ? Center(child: Text(error!))
          : ListView(
        children: _buildTreeNodes(tree, ''),
      ),
    );
  }
}