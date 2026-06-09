import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import '../providers/auth_provider.dart';
import '../services/order_service.dart';
import 'order_detail_screen.dart';

class WarehouseOrdersScreen extends StatefulWidget {
  final int locationId;
  final String locationName;
  final String locationPath;

  const WarehouseOrdersScreen({
    super.key,
    required this.locationId,
    required this.locationName,
    required this.locationPath,
  });

  @override
  State<WarehouseOrdersScreen> createState() => _WarehouseOrdersScreenState();
}

class _WarehouseOrdersScreenState extends State<WarehouseOrdersScreen> with TickerProviderStateMixin {
  late TabController _tabController;
  List<dynamic> imports = [];
  List<dynamic> exports = [];
  bool loading = true;
  String? error;

  // Status filter
  String _selectedStatus = 'ALL';
  final List<String> _statusOptions = ['ALL', 'APPROVED', 'DONE', 'PROCESSING', 'PENDING', 'CANCELLED'];
  final List<String> _statusLabels = ['Tất cả', 'Approved', 'Done', 'Processing', 'Pending', 'Cancelled'];

  // Unseen counts for notification highlighting
  Map<String, int> _unseenCounts = {
    'import_all': 0,
    'import_approved': 0,
    'import_done': 0,
    'import_processing': 0,
    'import_pending': 0,
    'import_cancelled': 0,
    'export_all': 0,
    'export_approved': 0,
    'export_done': 0,
    'export_processing': 0,
    'export_pending': 0,
    'export_cancelled': 0,
  };

  Timer? _refreshTimer;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _tabController.addListener(_onTabChanged);
    _fetchData();
    _markAllOrdersAsSeen();
    _refreshTimer = Timer.periodic(const Duration(seconds: 5), (_) {
      _refreshUnseenCounts();
    });
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    _tabController.removeListener(_onTabChanged);
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _markAllOrdersAsSeen() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final token = auth.token;
    if (token == null) return;

    try {
      await OrderService.markOrderAsSeen(0, 'import', token);
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

  void _onTabChanged() {
    if (_tabController.indexIsChanging) {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      final token = auth.token;
      if (token != null) {
        OrderService.getUnseenCounts(token).then((unseen) {
          setState(() {
            _unseenCounts = unseen;
          });
        });
      }
    }
  }

  Future<void> _markOrdersAsSeen(String status) async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final token = auth.token;
    if (token == null) return;

    final isImport = _tabController.index == 0;
    final orders = isImport ? imports : exports;
    final ordersToMark = orders.where((order) => order['status'] == status).toList();

    for (final order in ordersToMark) {
      await OrderService.markOrderAsSeen(order['id'], isImport ? 'import' : 'export', token);
    }

    final unseen = await OrderService.getUnseenCounts(token);
    setState(() {
      _unseenCounts = unseen;
    });
  }

  Future<void> _fetchData() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final token = auth.token;
    if (token == null) return;

    setState(() => loading = true);
    try {
      final apiUrl = dotenv.env['API_URL'];
      if (apiUrl == null) throw Exception('Missing API_URL in environment');

      final impRes = await http.get(
        Uri.parse('$apiUrl/api/orders/import/location/${widget.locationId}'),
        headers: {'Authorization': 'Bearer $token'},
      );

      final expRes = await http.get(
        Uri.parse('$apiUrl/api/orders/export/location/${widget.locationId}'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (impRes.statusCode == 200 && expRes.statusCode == 200) {
        final unseen = await OrderService.getUnseenCounts(token);
        setState(() {
          imports = jsonDecode(impRes.body);
          exports = jsonDecode(expRes.body);
          _unseenCounts = unseen;
          loading = false;
        });
      } else {
        throw Exception('Lỗi tải dữ liệu');
      }
    } catch (e) {
      setState(() {
        error = e.toString();
        loading = false;
      });
    }
  }

  List<dynamic> _filterByStatus(List<dynamic> orders) {
    if (_selectedStatus == 'ALL') return orders;
    return orders.where((order) => order['status'] == _selectedStatus).toList();
  }

  List<dynamic> _sortOrdersByDate(List<dynamic> orders) {
    final sorted = List<dynamic>.from(orders);
    sorted.sort((a, b) {
      try {
        final dateA = DateTime.parse(a['created_at']);
        final dateB = DateTime.parse(b['created_at']);
        return dateB.compareTo(dateA);
      } catch (e) {
        return 0;
      }
    });
    return sorted;
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

  String _formatDate(String dateStr) {
    try {
      final date = DateTime.parse(dateStr);
      return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
    } catch (e) {
      return dateStr;
    }
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
                final isImport = _tabController.index == 0;

                // Check if this status has unseen orders
                bool hasUnseen = false;
                if (isImport) {
                  if (status == 'ALL') hasUnseen = _unseenCounts['import_all']! > 0;
                  else if (status == 'APPROVED') hasUnseen = _unseenCounts['import_approved']! > 0;
                  else if (status == 'DONE') hasUnseen = _unseenCounts['import_done']! > 0;
                  else if (status == 'PROCESSING') hasUnseen = _unseenCounts['import_processing']! > 0;
                  else if (status == 'PENDING') hasUnseen = _unseenCounts['import_pending']! > 0;
                  else if (status == 'CANCELLED') hasUnseen = _unseenCounts['import_cancelled']! > 0;
                } else {
                  if (status == 'ALL') hasUnseen = _unseenCounts['export_all']! > 0;
                  else if (status == 'APPROVED') hasUnseen = _unseenCounts['export_approved']! > 0;
                  else if (status == 'DONE') hasUnseen = _unseenCounts['export_done']! > 0;
                  else if (status == 'PROCESSING') hasUnseen = _unseenCounts['export_processing']! > 0;
                  else if (status == 'PENDING') hasUnseen = _unseenCounts['export_pending']! > 0;
                  else if (status == 'CANCELLED') hasUnseen = _unseenCounts['export_cancelled']! > 0;
                }

                return Padding(
                  padding: EdgeInsets.only(right: isSmallScreen ? 6 : 8),
                  child: GestureDetector(
                    onTap: () {
                      setState(() => _selectedStatus = status);
                      if (status != 'ALL') {
                        _markOrdersAsSeen(status);
                      }
                    },
                    child: Container(
                      padding: EdgeInsets.symmetric(horizontal: isSmallScreen ? 10 : 12, vertical: isSmallScreen ? 4 : 6),
                      decoration: BoxDecoration(
                        color: hasUnseen && !isSelected
                            ? const Color(0xFFFEE2E2)
                            : (isSelected ? const Color(0xFF4F46E5) : const Color(0xFFF3F4F6)),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: hasUnseen && !isSelected
                              ? const Color(0xFFEF4444)
                              : (isSelected ? const Color(0xFF4F46E5) : const Color(0xFFE5E7EB)),
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
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.locationName,
              style: GoogleFonts.inter(
                color: const Color(0xFF1F2937),
                fontWeight: FontWeight.w700,
                fontSize: isSmallScreen ? 16 : 18,
              ),
            ),
            Text(
              widget.locationPath,
              style: GoogleFonts.inter(
                color: const Color(0xFF6B7280),
                fontWeight: FontWeight.w500,
                fontSize: isSmallScreen ? 11 : 12,
              ),
            ),
          ],
        ),
        bottom: PreferredSize(
          preferredSize: Size.fromHeight(isSmallScreen ? 40 : 45),
          child: Container(
            color: Colors.white,
            child: TabBar(
              controller: _tabController,
              indicatorColor: const Color(0xFF4F46E5),
              indicatorWeight: 2.5,
              labelColor: const Color(0xFF4F46E5),
              unselectedLabelColor: const Color(0xFF9CA3AF),
              labelStyle: GoogleFonts.inter(
                fontSize: isSmallScreen ? 12 : 13,
                fontWeight: FontWeight.w600,
              ),
              unselectedLabelStyle: GoogleFonts.inter(
                fontSize: isSmallScreen ? 12 : 13,
                fontWeight: FontWeight.w500,
              ),
              tabs: [
                Tab(
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.download_rounded, size: isSmallScreen ? 16 : 18),
                      SizedBox(width: isSmallScreen ? 4 : 6),
                      Text('NHẬP KHO'),
                    ],
                  ),
                ),
                Tab(
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.upload_rounded, size: isSmallScreen ? 16 : 18),
                      SizedBox(width: isSmallScreen ? 4 : 6),
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
          : error != null
          ? Center(child: Text('Lỗi: $error'))
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

  Widget _buildOrderList(List<dynamic> orders, bool isImport) {
    final filteredOrders = _filterByStatus(_sortOrdersByDate(orders));

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
                  isImport ? Icons.inbox_rounded : Icons.outbox_rounded,
                  size: isSmallScreen ? 48 : 56,
                  color: const Color(0xFFD1D5DB),
                ),
                SizedBox(height: isSmallScreen ? 10 : 12),
                Text(
                  'Không có đơn hàng nào',
                  style: GoogleFonts.inter(
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
          color: const Color(0xFF4F46E5),
          child: ListView.builder(
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
                    final auth = Provider.of<AuthProvider>(context, listen: false);
                    final token = auth.token;
                    if (token != null) {
                      await OrderService.markOrderAsSeen(order['id'], isImport ? 'import' : 'export', token);
                      final unseen = await OrderService.getUnseenCounts(token);
                      setState(() {
                        _unseenCounts = unseen;
                      });
                    }

                    await Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => OrderDetailScreen(
                          orderId: order['id'],
                          isImport: isImport,
                          orderCode: order['code'],
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
                                  color: isImport
                                      ? const Color(0xFFDBEAFE).withOpacity(0.6)
                                      : const Color(0xFFFED7AA).withOpacity(0.6),
                                  borderRadius: BorderRadius.circular(isSmallScreen ? 5 : 6),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      isImport ? Icons.download_rounded : Icons.upload_rounded,
                                      size: isSmallScreen ? 12 : 14,
                                      color: isImport
                                          ? const Color(0xFF2563EB)
                                          : const Color(0xFFEA580C),
                                    ),
                                    SizedBox(width: isSmallScreen ? 4 : 5),
                                    Expanded(
                                      child: Text(
                                        order['code'],
                                        style: TextStyle(
                                          color: isImport
                                              ? const Color(0xFF2563EB)
                                              : const Color(0xFFEA580C),
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
                            _buildStatusBadge(order['status']),
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
                              _formatDate(order['created_at']),
                              style: GoogleFonts.inter(
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