import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/order_service.dart';
import '../models/order_model.dart';
import 'order_detail_screen.dart';

class ImportInventoryScreen extends StatefulWidget {
  const ImportInventoryScreen({super.key});

  @override
  State<ImportInventoryScreen> createState() => _ImportInventoryScreenState();
}

class _ImportInventoryScreenState extends State<ImportInventoryScreen> {
  List<OrderModel> importOrders = [];
  bool loading = true;
  String _selectedStatus = 'ALL';
  final List<String> _statusOptions = ['ALL', 'APPROVED', 'DONE', 'PROCESSING', 'PENDING', 'CANCELLED'];
  final List<String> _statusLabels = ['Tất cả', 'Approved', 'Done', 'Processing', 'Pending', 'Cancelled'];
  Timer? _refreshTimer;

  // Unseen counts for notification highlighting
  Map<String, int> _unseenCounts = {
    'import_all': 0,
    'import_approved': 0,
    'import_done': 0,
    'import_processing': 0,
    'import_pending': 0,
    'import_cancelled': 0,
  };

  @override
  void initState() {
    super.initState();
    _fetchData();
    // Mark all import orders as seen when page loads
    _markAllImportOrdersAsSeen();
    // Start periodic refresh for unseen counts (every 5 seconds)
    _refreshTimer = Timer.periodic(const Duration(seconds: 5), (_) {
      _refreshUnseenCounts();
    });
  }

  Future<void> _markAllImportOrdersAsSeen() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final token = auth.token;
    if (token == null) return;

    try {
      await OrderService.markOrderAsSeen(0, 'import', token);
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
      final imp = await OrderService.getImports(token);
      final unseen = await OrderService.getUnseenCounts(token);
      setState(() {
        importOrders = _sortOrdersByDate(imp);
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

    final ordersToMark = importOrders.where((order) => order.status == status).toList();

    for (final order in ordersToMark) {
      await OrderService.markOrderAsSeen(order.id, 'import', token);
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
    return Builder(
      builder: (context) {
        final screenWidth = MediaQuery.of(context).size.width;
        final isSmallScreen = screenWidth < 600;
        
        return Container(
          padding: EdgeInsets.symmetric(horizontal: isSmallScreen ? 8 : 12, vertical: isSmallScreen ? 8 : 10),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: List.generate(_statusOptions.length, (index) {
                final status = _statusOptions[index];
                final label = _statusLabels[index];
                final isSelected = _selectedStatus == status;

                // Check if this status has unseen orders
                bool hasUnseen = false;
                if (status == 'ALL') hasUnseen = _unseenCounts['import_all']! > 0;
                else if (status == 'APPROVED') hasUnseen = _unseenCounts['import_approved']! > 0;
                else if (status == 'DONE') hasUnseen = _unseenCounts['import_done']! > 0;
                else if (status == 'PROCESSING') hasUnseen = _unseenCounts['import_processing']! > 0;
                else if (status == 'PENDING') hasUnseen = _unseenCounts['import_pending']! > 0;
                else if (status == 'CANCELLED') hasUnseen = _unseenCounts['import_cancelled']! > 0;

                return Padding(
                  padding: EdgeInsets.only(right: isSmallScreen ? 6 : 8),
                  child: GestureDetector(
                    onTap: () {
                      setState(() => _selectedStatus = status);
                      // Mark orders as seen when user taps on a status filter
                      if (status != 'ALL') {
                        _markOrdersAsSeen(status);
                      }
                    },
                    child: Container(
                      padding: EdgeInsets.symmetric(horizontal: isSmallScreen ? 10 : 12, vertical: isSmallScreen ? 4 : 6),
                      decoration: BoxDecoration(
                        color: hasUnseen && !isSelected 
                            ? const Color(0xFFFEE2E2) 
                            : (isSelected ? const Color(0xFF10B981) : const Color(0xFFF3F4F6)),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: hasUnseen && !isSelected 
                              ? const Color(0xFFEF4444) 
                              : (isSelected ? const Color(0xFF10B981) : const Color(0xFFE5E7EB)),
                          width: 1,
                        ),
                      ),
                      child: Text(
                        label,
                        style: TextStyle(
                          color: hasUnseen && !isSelected 
                              ? const Color(0xFFEF4444) 
                              : (isSelected ? Colors.white : const Color(0xFF6B7280)),
                          fontSize: isSmallScreen ? 11 : 12,
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
      },
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
    final screenWidth = MediaQuery.of(context).size.width;
    final isSmallScreen = screenWidth < 600;
    
    return Scaffold(
      backgroundColor: const Color(0xFFFAFBFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        title: Text(
          'Nhập Kho',
          style: TextStyle(
            color: const Color(0xFF1F2937),
            fontWeight: FontWeight.w700,
            fontSize: isSmallScreen ? 16 : 18,
          ),
        ),
      ),
      body: loading
          ? const Center(
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF10B981)),
        ),
      )
          : SingleChildScrollView(
        child: Column(
          children: [
            _buildStatusFilter(),
            _buildOrderList(),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderList() {
    final filteredOrders = _filterByStatus(importOrders);

    return Builder(
      builder: (context) {
        final screenWidth = MediaQuery.of(context).size.width;
        final isSmallScreen = screenWidth < 600;

        if (filteredOrders.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.inbox_rounded,
                  size: isSmallScreen ? 48 : 56,
                  color: const Color(0xFFD1D5DB),
                ),
                SizedBox(height: isSmallScreen ? 10 : 12),
                Text(
                  'Không có đơn nhập kho nào',
                  style: TextStyle(
                    color: const Color(0xFF6B7280),
                    fontSize: isSmallScreen ? 13 : 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: _fetchData,
          color: const Color(0xFF10B981),
          child: ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            padding: EdgeInsets.symmetric(horizontal: isSmallScreen ? 8 : 12, vertical: isSmallScreen ? 6 : 8),
            itemCount: filteredOrders.length,
            itemBuilder: (context, index) {
              final order = filteredOrders[index];
              return Card(
                margin: EdgeInsets.only(bottom: isSmallScreen ? 8 : 10),
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(isSmallScreen ? 10 : 12),
                  side: BorderSide(
                    color: Colors.black.withOpacity(0.06),
                    width: 1,
                  ),
                ),
                child: InkWell(
                  borderRadius: BorderRadius.circular(isSmallScreen ? 10 : 12),
                  onTap: () async {
                    // Mark this specific order as seen
                    final auth = Provider.of<AuthProvider>(context, listen: false);
                    final token = auth.token;
                    if (token != null) {
                      await OrderService.markOrderAsSeen(order.id, 'import', token);
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
                          isImport: true,
                          orderCode: order.code,
                        ),
                      ),
                    );
                    _fetchData();
                  },
                  child: Padding(
                    padding: EdgeInsets.all(isSmallScreen ? 10 : 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Container(
                                padding: EdgeInsets.symmetric(horizontal: isSmallScreen ? 6 : 8, vertical: isSmallScreen ? 4 : 5),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFDBEAFE).withOpacity(0.6),
                                  borderRadius: BorderRadius.circular(isSmallScreen ? 5 : 6),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      Icons.download_rounded,
                                      size: isSmallScreen ? 12 : 14,
                                      color: const Color(0xFF2563EB),
                                    ),
                                    SizedBox(width: isSmallScreen ? 4 : 5),
                                    Expanded(
                                      child: Text(
                                        order.code,
                                        style: TextStyle(
                                          color: const Color(0xFF2563EB),
                                          fontSize: isSmallScreen ? 11 : 12,
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
                            SizedBox(width: isSmallScreen ? 6 : 8),
                            _buildStatusBadge(order.status),
                          ],
                        ),
                        SizedBox(height: isSmallScreen ? 6 : 8),
                        Row(
                          children: [
                            Icon(
                              Icons.calendar_today_rounded,
                              size: isSmallScreen ? 12 : 14,
                              color: const Color(0xFFB4B9C1),
                            ),
                            SizedBox(width: isSmallScreen ? 4 : 5),
                            Text(
                              _formatDate(order.createdAt),
                              style: TextStyle(
                                color: const Color(0xFF6B7280),
                                fontSize: isSmallScreen ? 11 : 12,
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
      },
    );
  }
}