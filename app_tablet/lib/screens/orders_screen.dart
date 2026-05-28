// import 'dart:convert';
// import 'package:flutter/material.dart';
// import 'package:http/http.dart' as http;
// import 'package:flutter_dotenv/flutter_dotenv.dart';
//
// class OrdersScreen extends StatefulWidget {
//   const OrdersScreen({super.key});
//
//   @override
//
//   State<OrdersScreen> createState() => _OrdersScreenState();
// }
//
// class _OrdersScreenState extends State<OrdersScreen> {
//   bool loading = true;
//   List imports = [];
//   List exports = [];
//
//   String get baseUrl =>
//       dotenv.env['API_URL'] ?? 'http://10.0.2.2:8080';
//
//   @override
//   void initState() {
//     super.initState();
//     fetchData();
//   }
//
//   Future<void> fetchData() async {
//     try {
//       final impRes = await http.get(Uri.parse('$baseUrl/imports'));
//       final expRes = await http.get(Uri.parse('$baseUrl/exports'));
//
//       setState(() {
//         imports = jsonDecode(impRes.body);
//         exports = jsonDecode(expRes.body);
//         loading = false;
//       });
//     } catch (e) {
//       setState(() => loading = false);
//     }
//   }
//
//   Widget buildItem(dynamic item, String type) {
//     return Card(
//       child: ListTile(
//         title: Text("Order #${item['id']}"),
//         subtitle: Text("Status: ${item['status'] ?? 'PENDING'}"),
//         trailing: Text(type),
//       ),
//     );
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: const Text("Orders")),
//       body: loading
//           ? const Center(child: CircularProgressIndicator())
//           : RefreshIndicator(
//         onRefresh: fetchData,
//         child: ListView(
//           children: [
//             const Padding(
//               padding: EdgeInsets.all(8),
//               child: Text("IMPORT ORDERS"),
//             ),
//             ...imports.map((e) => buildItem(e, "IN")),
//
//             const Padding(
//               padding: EdgeInsets.all(8),
//               child: Text("EXPORT ORDERS"),
//             ),
//             ...exports.map((e) => buildItem(e, "OUT")),
//           ],
//         ),
//       ),
//     );
//   }
// }
//




//
// import 'dart:convert';
// import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
// import 'package:http/http.dart' as http;
// import 'package:flutter_dotenv/flutter_dotenv.dart';
// import '../providers/auth_provider.dart';
// import '../services/order_service.dart';
// import '../models/order_model.dart';
//
// class OrdersScreen extends StatefulWidget {
//   const OrdersScreen({super.key});
//
//   @override
//   State<OrdersScreen> createState() => _OrdersScreenState();
// }
//
// class _OrdersScreenState extends State<OrdersScreen> {
//   bool loading = true;
//   List<OrderModel> imports = [];
//   List<OrderModel> exports = [];
//
//   @override
//   void initState() {
//     super.initState();
//     fetchData();
//   }
//
//   Future<void> fetchData() async {
//     final auth = Provider.of<AuthProvider>(context, listen: false);
//     final token = auth.token;
//
//     if (token == null) {
//       setState(() => loading = false);
//       return;
//     }
//
//     setState(() => loading = true);
//
//     try {
//       final imp = await OrderService.getImports(token);
//       final exp = await OrderService.getExports(token);
//       setState(() {
//         imports = imp;
//         exports = exp;
//         loading = false;
//       });
//     } catch (e) {
//       setState(() => loading = false);
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(content: Text("Lỗi tải đơn hàng: $e")),
//       );
//     }
//   }
//
//   Widget buildItem(OrderModel item, String type) {
//     return Card(
//       margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
//       child: ListTile(
//         title: Text("Đơn hàng #${item.id}"),
//         subtitle: Text("Mã: ${item.code}\nTrạng thái: ${item.status}"),
//         trailing: Chip(
//           label: Text(type),
//           backgroundColor: type == "IN" ? Colors.green.shade100 : Colors.orange.shade100,
//         ),
//       ),
//     );
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: const Text("Đơn hàng")),
//       body: loading
//           ? const Center(child: CircularProgressIndicator())
//           : RefreshIndicator(
//         onRefresh: fetchData,
//         child: ListView(
//           children: [
//             const Padding(
//               padding: EdgeInsets.all(12),
//               child: Text("ĐƠN NHẬP KHO", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blue)),
//             ),
//             if (imports.isEmpty)
//               const Padding(padding: EdgeInsets.all(12), child: Text("Không có đơn nhập")),
//             ...imports.map((e) => buildItem(e, "IN")),
//             const Padding(
//               padding: EdgeInsets.all(12),
//               child: Text("ĐƠN XUẤT KHO", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.orange)),
//             ),
//             if (exports.isEmpty)
//               const Padding(padding: EdgeInsets.all(12), child: Text("Không có đơn xuất")),
//             ...exports.map((e) => buildItem(e, "OUT")),
//           ],
//         ),
//       ),
//     );
//   }
// }






import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/order_service.dart';
import '../models/order_model.dart';
import 'order_detail_screen.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<OrderModel> imports = [];
  List<OrderModel> exports = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _fetchData();
  }

  Future<void> _fetchData() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final token = auth.token;
    if (token == null) return;
    setState(() => loading = true);
    try {
      final imp = await OrderService.getImports(token);
      final exp = await OrderService.getExports(token);
      setState(() {
        imports = imp;
        exports = exp;
        loading = false;
      });
    } catch (e) {
      setState(() => loading = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Đơn hàng'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'NHẬP KHO', icon: Icon(Icons.download)),
            Tab(text: 'XUẤT KHO', icon: Icon(Icons.upload)),
          ],
        ),
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
        controller: _tabController,
        children: [
          _buildOrderList(imports, true),
          _buildOrderList(exports, false),
        ],
      ),
    );
  }

  Widget _buildOrderList(List<OrderModel> orders, bool isImport) {
    if (orders.isEmpty) {
      return const Center(child: Text('Không có đơn hàng nào'));
    }
    return RefreshIndicator(
      onRefresh: _fetchData,
      child: ListView.builder(
        itemCount: orders.length,
        itemBuilder: (context, index) {
          final order = orders[index];
          return Card(
            margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            child: ListTile(
              title: Text('Mã đơn: ${order.code}'),
              subtitle: Text('Trạng thái: ${order.status}'),
              trailing: order.status == 'DONE'
                  ? const Icon(Icons.check_circle, color: Colors.green)
                  : const Icon(Icons.pending, color: Colors.orange),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => OrderDetailScreen(
                      orderId: order.id,
                      isImport: isImport,
                    ),
                  ),
                ).then((_) => _fetchData());
              },
            ),
          );
        },
      ),
    );
  }
}