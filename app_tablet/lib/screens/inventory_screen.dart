// import 'dart:convert';
// import 'package:flutter/material.dart';
// import 'package:http/http.dart' as http;
// import 'package:flutter_dotenv/flutter_dotenv.dart';
//
// class InventoryScreen extends StatefulWidget {
//   const InventoryScreen({super.key});
//
//   @override
//   State<InventoryScreen> createState() => _InventoryScreenState();
// }
//
// class _InventoryScreenState extends State<InventoryScreen> {
//   bool loading = true;
//   List data = [];
//
//   String get baseUrl =>
//       dotenv.env['API_URL'] ?? 'http://10.0.2.2:8080';
//
//   @override
//   void initState() {
//     super.initState();
//     fetchInventory();
//   }
//
//   Future<void> fetchInventory() async {
//     final res = await http.get(Uri.parse('$baseUrl/api/inventories'));
//
//     // Backend trả về array nhưng JSON decode có thể trả Map (vd: {"error": "..."})
//     // => chặn để tránh crash: type '_Map<String, dynamic>' is not a subtype of type 'List<dynamic>'
//     final decoded = jsonDecode(res.body);
//     final list = decoded is List ? decoded : [];
//
//     setState(() {
//       data = list;
//       loading = false;
//     });
//   }
//
//   Color getColor(String status) {
//     if (status == "LOW") return Colors.red;
//     return Colors.green;
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: const Text("Inventory")),
//       body: loading
//           ? const Center(child: CircularProgressIndicator())
//           : RefreshIndicator(
//         onRefresh: fetchInventory,
//         child: ListView.builder(
//           itemCount: data.length,
//           itemBuilder: (context, index) {
//             final item = data[index];
//
//             return Card(
//               child: ListTile(
//                 title: Text(item['product']),
//                 subtitle: Text("Qty: ${item['quantity']}"),
//                 trailing: Text(
//                   item['status'],
//                   style: TextStyle(
//                     color: getColor(item['status']),
//                     fontWeight: FontWeight.bold,
//                   ),
//                 ),
//               ),
//             );
//           },
//         ),
//       ),
//     );
//   }
// }


import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/inventory_service.dart';
import '../models/inventory_model.dart';

class InventoryScreen extends StatefulWidget {
  const InventoryScreen({super.key});

  @override
  State<InventoryScreen> createState() => _InventoryScreenState();
}

class _InventoryScreenState extends State<InventoryScreen> {
  bool loading = true;
  List<InventoryModel> inventories = [];
  String? error;

  @override
  void initState() {
    super.initState();
    _fetchInventory();
  }

  Future<void> _fetchInventory() async {
    final token = Provider.of<AuthProvider>(context, listen: false).token;
    if (token == null) {
      setState(() { error = "Chưa đăng nhập"; loading = false; });
      return;
    }
    setState(() { loading = true; error = null; });
    try {
      final data = await InventoryService.getInventory(token);
      setState(() { inventories = data; loading = false; });
    } catch (e) {
      setState(() { error = e.toString(); loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Tồn kho")),
      body: RefreshIndicator(
        onRefresh: _fetchInventory,
        child: loading
            ? const Center(child: CircularProgressIndicator())
            : error != null
            ? Center(child: Text(error!))
            : ListView.builder(
          itemCount: inventories.length,
          itemBuilder: (context, index) {
            final item = inventories[index];
            return Card(
              margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              child: ListTile(
                title: Text(item.product),
                subtitle: Text("SKU: ${item.sku}\nVị trí: ${item.location}\nSố lượng: ${item.quantity}"),
                trailing: Chip(
                  label: Text(item.status),
                  backgroundColor: item.status == "LOW" ? Colors.red.shade100 : Colors.green.shade100,
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}