import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/order_service.dart';
import '../models/order_model.dart';
import 'order_detail_screen.dart';

class ExportInventoryScreen extends StatefulWidget {
  const ExportInventoryScreen({super.key});

  @override
  State<ExportInventoryScreen> createState() => _ExportInventoryScreenState();
}

class _ExportInventoryScreenState extends State<ExportInventoryScreen> {
  List<OrderModel> exportOrders = [];
  bool loading = true;
  String _selectedStatus = 'ALL';
  final List<String> _statusOptions = ['ALL', 'APPROVED', 'DONE', 'PROCESSING', 'PENDING', 'CANCELLED'];
  final List<String> _statusLabels = ['Tất cả', 'Approved', 'Done', 'Processing', 'Pending', 'Cancelled'];
  Timer? _refreshTimer;

  // Unseen counts for notification highlighting
  Map<String, int> _unseenCounts = {
    'export_all': 0,
    'export_approved': 0,
    'export_done': 0,
    'export_processing': 0,
    'export_pending': 0,
    'export_cancelled': 0,
  };

  @override
  void initState() {
    super.initState();
    _fetchData();
    // Mark all export orders as seen when page loads
    _markAllExportOrdersAsSeen();
    // Start periodic refresh for unseen counts (every 5 seconds)
    _refreshTimer = Timer.periodic(const Duration(seconds: 5), (_) {
      _refreshUnseenCounts();
    });
  }

  Future<void> _markAllExportOrdersAsSeen() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final token = auth.token;
    if (token == null) return;

    try {
      await OrderService.markOrderAsSeen(0, 'export', token);
    } catch (e) {
      // Silently fail
    }
  }

  Future<void> _refreshUnseenCounts() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final token = auth.token;
    if (token != null) {
      try {
        final unseen = await OrderService.getUnseenCounts(token);
        if (mounted) {
          setState(() {
            _unseenCounts = unseen;
          });
        }
      } catch (e) {
        // Silent fail on refresh errors
      }
    }
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    super.dispose();
  }

  Future<void> _fetchData() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final token = auth.token;
    if (token == null) return;
    setState(() => loading = true);
    try {
      final exp = await OrderService.getExports(token);
      final unseen = await OrderService.getUnseenCounts(token);
      setState(() {
        exportOrders = _sortOrdersByDate(exp);
        _unseenCounts = unseen;
        loading = false;
      });
    } catch (e) {
      setState(() => loading = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _markOrdersAsSeen(String status) async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final token = auth.token;
    if (token == null) return;

    final ordersToMark = exportOrders.where((order) => order.status == status).toList();

    for (final order in ordersToMark) {
      await OrderService.markOrderAsSeen(order.id, 'export', token);
    }

    // Refresh unseen counts
    final unseen = await OrderService.getUnseenCounts(token);
    setState(() {
      _unseenCounts = unseen;
    });
  }

  List<OrderModel> _sortOrdersByDate(List<OrderModel> orders) {
    final sorted = List<OrderModel>.from(orders);
    sorted.sort((a, b) {
      try {
        final dateA = DateTime.parse(a.createdAt);
        final dateB = DateTime.parse(b.createdAt);
        return dateB.compareTo(dateA);
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
        return const Color(0xFF10B981);
      case 'PROCESSING':
        return const Color(0xFFF59E0B);
      case 'PENDING':
        return const Color(0xFF6B7280);
      case 'CANCELLED':
        return const Color(0xFFEF4444);
      case 'APPROVED':
        return const Color(0xFF4F46E5);
      default:
        return const Color(0xFF6B7280);
    }
  }

  Color _getStatusBackgroundColor(String status) {
    switch (status) {
      case 'DONE':
        return const Color(0xFFD1FAE5);
      case 'PROCESSING':
        return const Color(0xFFFED7AA);
      case 'PENDING':
        return const Color(0xFFE5E7EB);
      case 'CANCELLED':
        return const Color(0xFFFEE2E2);
      case 'APPROVED':
        return const Color(0xFFE0E7FF);
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

            // Check if this status has unseen orders
            bool hasUnseen = false;
            if (status == 'ALL') hasUnseen = _unseenCounts['export_all']! > 0;
            else if (status == 'APPROVED') hasUnseen = _unseenCounts['export_approved']! > 0;
            else if (status == 'DONE') hasUnseen = _unseenCounts['export_done']! > 0;
            else if (status == 'PROCESSING') hasUnseen = _unseenCounts['export_processing']! > 0;
            else if (status == 'PENDING') hasUnseen = _unseenCounts['export_pending']! > 0;
            else if (status == 'CANCELLED') hasUnseen = _unseenCounts['export_cancelled']! > 0;

            return Padding(
              padding: const EdgeInsets.only(right: 8),
              child: GestureDetector(
                onTap: () {
                  setState(() => _selectedStatus = status);
                  // Mark orders as seen when user taps on a status filter
                  if (status != 'ALL') {
                    _markOrdersAsSeen(status);
                  }
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: hasUnseen && !isSelected 
                        ? const Color(0xFFFEE2E2) 
                        : (isSelected ? const Color(0xFFF59E0B) : const Color(0xFFF3F4F6)),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: hasUnseen && !isSelected 
                          ? const Color(0xFFEF4444) 
                          : (isSelected ? const Color(0xFFF59E0B) : const Color(0xFFE5E7EB)),
                      width: 1,
                    ),
                  ),
                  child: Text(
                    label,
                    style: TextStyle(
                      color: hasUnseen && !isSelected 
                          ? const Color(0xFFEF4444) 
                          : (isSelected ? Colors.white : const Color(0xFF6B7280)),
                      fontSize: 12,
                      fontWeight: hasUnseen && !isSelected ? FontWeight.w700 : FontWeight.w500,
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
          'Xuất Kho',
          style: TextStyle(
            color: Color(0xFF1F2937),
            fontWeight: FontWeight.w700,
            fontSize: 18,
          ),
        ),
      ),
      body: loading
          ? const Center(
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFF59E0B)),
        ),
      )
          : Column(
        children: [
          _buildStatusFilter(),
          Expanded(
            child: _buildOrderList(),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderList() {
    final filteredOrders = _filterByStatus(exportOrders);

    if (filteredOrders.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.outbox_rounded,
              size: 56,
              color: const Color(0xFFD1D5DB),
            ),
            const SizedBox(height: 12),
            Text(
              'Không có đơn xuất kho nào',
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
      color: const Color(0xFFF59E0B),
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
                // Mark this specific order as seen
                final auth = Provider.of<AuthProvider>(context, listen: false);
                final token = auth.token;
                if (token != null) {
                  await OrderService.markOrderAsSeen(order.id, 'export', token);
                  // Refresh unseen counts
                  final unseen = await OrderService.getUnseenCounts(token);
                  setState(() {
                    _unseenCounts = unseen;
                  });
                }
                
                await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => OrderDetailScreen(
                      orderId: order.id,
                      isImport: false,
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
                              color: const Color(0xFFFED7AA).withOpacity(0.6),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(
                                  Icons.upload_rounded,
                                  size: 14,
                                  color: Color(0xFFEA580C),
                                ),
                                const SizedBox(width: 5),
                                Expanded(
                                  child: Text(
                                    order.code,
                                    style: const TextStyle(
                                      color: Color(0xFFEA580C),
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
                        const Icon(
                          Icons.calendar_today_rounded,
                          size: 14,
                          color: Color(0xFFB4B9C1),
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