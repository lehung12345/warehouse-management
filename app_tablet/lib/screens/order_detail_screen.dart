import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import 'scan_screen.dart';

class OrderDetailScreen extends StatefulWidget {
  final int orderId;
  final bool isImport;
  const OrderDetailScreen({super.key, required this.orderId, required this.isImport});

  @override
  State<OrderDetailScreen> createState() => _OrderDetailScreenState();
}

class _OrderDetailScreenState extends State<OrderDetailScreen> {
  Map<String, dynamic>? order;
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _fetchDetail();
  }

  Future<void> _fetchDetail() async {
    final token = Provider.of<AuthProvider>(context, listen: false).token;
    if (token == null) return;
    setState(() => loading = true);
    try {
      final url = '${dotenv.env['API_URL'] ?? 'http://10.0.2.2:8080'}/api/orders/${widget.isImport ? 'import' : 'export'}/${widget.orderId}';
      final res = await http.get(
        Uri.parse(url),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (res.statusCode == 200) {
        setState(() { order = jsonDecode(res.body); loading = false; });
      } else {
        throw Exception('Lỗi ${res.statusCode}');
      }
    } catch (e) {
      setState(() { error = e.toString(); loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Chi tiết đơn ${widget.isImport ? 'NHẬP' : 'XUẤT'}')),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error != null
          ? Center(child: Text(error!))
          : Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: order?['items']?.length ?? 0,
              itemBuilder: (context, index) {
                final item = order!['items'][index];
                final scanned = item['scanned_quantity'] ?? 0;
                final total = item['quantity'];
                return Card(
                  margin: const EdgeInsets.all(8),
                  child: ListTile(
                    title: Text(item['product']['name']),
                    subtitle: Text('Cần: $total | Đã scan: $scanned'),
                    trailing: scanned >= total
                        ? const Icon(Icons.check_circle, color: Colors.green)
                        : const Icon(Icons.pending, color: Colors.orange),
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: ElevatedButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => ScanScreen(
                      isImport: widget.isImport,
                      presetOrderId: widget.orderId, // ✅ truyền orderId
                    ),
                  ),
                ).then((_) => _fetchDetail()); // refresh sau khi quét
              },
              icon: const Icon(Icons.qr_code_scanner),
              label: const Text('QUÉT SẢN PHẨM'),
              style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50)),
            ),
          ),
        ],
      ),
    );
  }
}