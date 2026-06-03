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



//bản cũ

//
// import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
// import '../providers/auth_provider.dart';
// import '../services/order_service.dart';
// import '../models/order_model.dart';
// import 'order_detail_screen.dart';
//
// class OrdersScreen extends StatefulWidget {
//   const OrdersScreen({super.key});
//
//   @override
//   State<OrdersScreen> createState() => _OrdersScreenState();
// }
//
// class _OrdersScreenState extends State<OrdersScreen> with SingleTickerProviderStateMixin {
//   late TabController _tabController;
//   List<OrderModel> imports = [];
//   List<OrderModel> exports = [];
//   bool loading = true;
//
//   @override
//   void initState() {
//     super.initState();
//     _tabController = TabController(length: 2, vsync: this);
//     _fetchData();
//   }
//
//   Future<void> _fetchData() async {
//     final auth = Provider.of<AuthProvider>(context, listen: false);
//     final token = auth.token;
//     if (token == null) return;
//     setState(() => loading = true);
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
//       ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $e')));
//     }
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text('Đơn hàng'),
//         bottom: TabBar(
//           controller: _tabController,
//           tabs: const [
//             Tab(text: 'NHẬP KHO', icon: Icon(Icons.download)),
//             Tab(text: 'XUẤT KHO', icon: Icon(Icons.upload)),
//           ],
//         ),
//       ),
//       body: loading
//           ? const Center(child: CircularProgressIndicator())
//           : TabBarView(
//         controller: _tabController,
//         children: [
//           _buildOrderList(imports, true),
//           _buildOrderList(exports, false),
//         ],
//       ),
//     );
//   }
//
//   Widget _buildOrderList(List<OrderModel> orders, bool isImport) {
//     if (orders.isEmpty) {
//       return const Center(child: Text('Không có đơn hàng nào'));
//     }
//     return RefreshIndicator(
//       onRefresh: _fetchData,
//       child: ListView.builder(
//         itemCount: orders.length,
//         itemBuilder: (context, index) {
//           final order = orders[index];
//           return Card(
//             margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
//             child: ListTile(
//               title: Text('Mã đơn: ${order.code}'),
//               subtitle: Text('Trạng thái: ${order.status}'),
//               trailing: order.status == 'DONE'
//                   ? const Icon(Icons.check_circle, color: Colors.green)
//                   : const Icon(Icons.pending, color: Colors.orange),
//               onTap: () {
//                 Navigator.push(
//                   context,
//                   MaterialPageRoute(
//                     builder: (_) => OrderDetailScreen(
//                       orderId: order.id,
//                       isImport: isImport,
//                     ),
//                   ),
//                 ).then((_) => _fetchData());
//               },
//             ),
//           );
//         },
//       ),
//     );
//   }
// }



//bản mới
// import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
// import '../providers/auth_provider.dart';
// import '../services/order_service.dart';
// import '../models/order_model.dart';
// import 'order_detail_screen.dart';
//
// class OrdersScreen extends StatefulWidget {
//   const OrdersScreen({super.key});
//
//   @override
//   State<OrdersScreen> createState() => _OrdersScreenState();
// }
//
// class _OrdersScreenState extends State<OrdersScreen> with SingleTickerProviderStateMixin {
//   late TabController _tabController;
//   List<OrderModel> imports = [];
//   List<OrderModel> exports = [];
//   bool loading = true;
//
//   @override
//   void initState() {
//     super.initState();
//     _tabController = TabController(length: 2, vsync: this);
//     _fetchData();
//   }
//
//   Future<void> _fetchData() async {
//     final auth = Provider.of<AuthProvider>(context, listen: false);
//     final token = auth.token;
//     if (token == null) return;
//     setState(() => loading = true);
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
//       ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $e')));
//     }
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text('Đơn hàng'),
//         bottom: TabBar(
//           controller: _tabController,
//           tabs: const [
//             Tab(text: 'NHẬP KHO', icon: Icon(Icons.download)),
//             Tab(text: 'XUẤT KHO', icon: Icon(Icons.upload)),
//           ],
//         ),
//       ),
//       body: loading
//           ? const Center(child: CircularProgressIndicator())
//           : TabBarView(
//         controller: _tabController,
//         children: [
//           _buildOrderList(imports, true),
//           _buildOrderList(exports, false),
//         ],
//       ),
//     );
//   }
//
//   Widget _buildOrderList(List<OrderModel> orders, bool isImport) {
//     if (orders.isEmpty) {
//       return const Center(child: Text('Không có đơn hàng nào'));
//     }
//     return RefreshIndicator(
//       onRefresh: _fetchData,
//       child: ListView.builder(
//         itemCount: orders.length,
//         itemBuilder: (context, index) {
//           final order = orders[index];
//           return Card(
//             margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
//             child: ListTile(
//               title: Text('Mã đơn: ${order.code}'),
//               subtitle: Text('Trạng thái: ${order.status}'),
//               trailing: order.status == 'DONE'
//                   ? const Icon(Icons.check_circle, color: Colors.green)
//                   : const Icon(Icons.pending, color: Colors.orange),
//               onTap: () async {
//                 await Navigator.push(
//                   context,
//                   MaterialPageRoute(
//                     builder: (_) => OrderDetailScreen(
//                       orderId: order.id,
//                       isImport: isImport,
//                       orderCode: order.code, // ✅ truyền mã code
//                     ),
//                   ),
//                 );
//                 _fetchData(); // refresh sau khi quay về
//               },
//             ),
//           );
//         },
//       ),
//     );
//   }
// }


//bản sửa giao diện
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

class _OrdersScreenState extends State<OrdersScreen> with TickerProviderStateMixin {
  late TabController _tabController;
  List<OrderModel> imports = [];
  List<OrderModel> exports = [];
  bool loading = true;

  // Status filter
  String _selectedStatus = 'ALL';
  final List<String> _statusOptions = ['ALL', 'DONE', 'PROCESSING', 'PENDING', 'CANCELLED', 'APPROVED'];
  final List<String> _statusLabels = ['Tất cả', 'Done', 'Processing', 'Pending', 'Cancelled', 'Approved'];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _fetchData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
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
        imports = _sortOrdersByDate(imp);
        exports = _sortOrdersByDate(exp);
        loading = false;
      });
    } catch (e) {
      setState(() => loading = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  List<OrderModel> _sortOrdersByDate(List<OrderModel> orders) {
    final sorted = List<OrderModel>.from(orders);
    sorted.sort((a, b) {
      try {
        final dateA = DateTime.parse(a.createdAt);
        final dateB = DateTime.parse(b.createdAt);
        return dateB.compareTo(dateA); // Newest first
      } catch (e) {
        return 0;
      }
    });
    return sorted;
  }

  List<OrderModel> _filterByStatus(List<OrderModel> orders) {
    if (_selectedStatus == 'ALL') return orders;
    return orders.where((order) => order.status == _selectedStatus).toList();
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'DONE':
        return const Color(0xFF10B981); // Green
      case 'PROCESSING':
        return const Color(0xFFF59E0B); // Orange
      case 'PENDING':
        return const Color(0xFF6B7280); // Gray
      case 'CANCELLED':
        return const Color(0xFFEF4444); // Red
      case 'APPROVED':
        return const Color(0xFF4F46E5); // Admin indigo
      default:
        return const Color(0xFF6B7280);
    }
  }

  Color _getStatusBackgroundColor(String status) {
    switch (status) {
      case 'DONE':
        return const Color(0xFFD1FAE5); // Light green
      case 'PROCESSING':
        return const Color(0xFFFED7AA); // Light orange
      case 'PENDING':
        return const Color(0xFFE5E7EB); // Light gray
      case 'CANCELLED':
        return const Color(0xFFFEE2E2); // Light red
      case 'APPROVED':
        return const Color(0xFFE0E7FF); // Light indigo
      default:
        return const Color(0xFFE5E7EB);
    }
  }

  Widget _buildStatusBadge(String status) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: _getStatusBackgroundColor(status),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: _getStatusColor(status).withOpacity(0.3), width: 0.5),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 5,
            height: 5,
            decoration: BoxDecoration(
              color: _getStatusColor(status),
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 4),
          Text(
            status,
            style: TextStyle(
              color: _getStatusColor(status),
              fontSize: 10,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusFilter() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: List.generate(_statusOptions.length, (index) {
            final status = _statusOptions[index];
            final label = _statusLabels[index];
            final isSelected = _selectedStatus == status;

            return Padding(
              padding: const EdgeInsets.only(right: 8),
              child: GestureDetector(
                onTap: () {
                  setState(() => _selectedStatus = status);
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: isSelected ? const Color(0xFF4F46E5) : const Color(0xFFF3F4F6),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isSelected ? const Color(0xFF4F46E5) : const Color(0xFFE5E7EB),
                      width: 1,
                    ),
                  ),
                  child: Text(
                    label,
                    style: TextStyle(
                      color: isSelected ? Colors.white : const Color(0xFF6B7280),
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ),
            );
          }),
        ),
      ),
    );
  }

  String _formatDate(String dateStr) {
    try {
      final date = DateTime.parse(dateStr);
      return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
    } catch (e) {
      return dateStr;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAFBFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        title: const Text(
          'Đơn hàng',
          style: TextStyle(
            color: Color(0xFF1F2937),
            fontWeight: FontWeight.w700,
            fontSize: 18,
          ),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(45),
          child: Container(
            color: Colors.white,
            child: TabBar(
              controller: _tabController,
              indicatorColor: const Color(0xFF4F46E5),
              indicatorWeight: 2.5,
              labelColor: const Color(0xFF4F46E5),
              unselectedLabelColor: const Color(0xFF9CA3AF),
              labelStyle: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
              unselectedLabelStyle: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
              tabs: const [
                Tab(
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.download_rounded, size: 18),
                      SizedBox(width: 6),
                      Text('NHẬP KHO'),
                    ],
                  ),
                ),
                Tab(
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.upload_rounded, size: 18),
                      SizedBox(width: 6),
                      Text('XUẤT KHO'),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      body: loading
          ? const Center(
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF4F46E5)),
        ),
      )
          : Column(
        children: [
          _buildStatusFilter(),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildOrderList(imports, true),
                _buildOrderList(exports, false),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderList(List<OrderModel> orders, bool isImport) {
    final filteredOrders = _filterByStatus(orders);

    if (filteredOrders.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              isImport ? Icons.inbox_rounded : Icons.outbox_rounded,
              size: 56,
              color: const Color(0xFFD1D5DB),
            ),
            const SizedBox(height: 12),
            Text(
              'Không có đơn hàng nào',
              style: TextStyle(
                color: const Color(0xFF6B7280),
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _fetchData,
      color: const Color(0xFF4F46E5),
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        itemCount: filteredOrders.length,
        itemBuilder: (context, index) {
          final order = filteredOrders[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 10),
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: BorderSide(
                color: Colors.black.withOpacity(0.06),
                width: 1,
              ),
            ),
            child: InkWell(
              borderRadius: BorderRadius.circular(12),
              onTap: () async {
                await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => OrderDetailScreen(
                      orderId: order.id,
                      isImport: isImport,
                      orderCode: order.code,
                    ),
                  ),
                );
                _fetchData();
              },
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
                            decoration: BoxDecoration(
                              color: isImport
                                  ? const Color(0xFFDBEAFE).withOpacity(0.6)
                                  : const Color(0xFFFED7AA).withOpacity(0.6),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  isImport ? Icons.download_rounded : Icons.upload_rounded,
                                  size: 14,
                                  color: isImport
                                      ? const Color(0xFF2563EB)
                                      : const Color(0xFFEA580C),
                                ),
                                const SizedBox(width: 5),
                                Expanded(
                                  child: Text(
                                    order.code,
                                    style: TextStyle(
                                      color: isImport
                                          ? const Color(0xFF2563EB)
                                          : const Color(0xFFEA580C),
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                      fontFamily: 'monospace',
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        _buildStatusBadge(order.status),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(
                          Icons.calendar_today_rounded,
                          size: 14,
                          color: const Color(0xFFB4B9C1),
                        ),
                        const SizedBox(width: 5),
                        Text(
                          _formatDate(order.createdAt),
                          style: const TextStyle(
                            color: Color(0xFF6B7280),
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}