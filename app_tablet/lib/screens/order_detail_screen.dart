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
  final String orderCode;
  const OrderDetailScreen({
    super.key,
    required this.orderId,
    required this.isImport,
    required this.orderCode,
  });

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

  String _getButtonText() {
    final status = order?['status'];
    if (status == 'CANCELLED') return 'ĐƠN ĐÃ BỊ HỦY';
    if (status == 'APPROVED') return 'ĐƠN ĐÃ ĐƯỢC QUẢN LÝ DUYỆT';
    if (status == 'DONE') return 'ĐƠN ĐÃ HOÀN THÀNH';
    return 'QUÉT SẢN PHẨM';
  }

  Color _getButtonColor() {
    final status = order?['status'];
    if (status == 'CANCELLED' || status == 'APPROVED' || status == 'DONE') return Colors.grey;
    return Colors.blue;
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

  Widget _buildStatusBadge() {
    final status = order?['status'] ?? 'UNKNOWN';
    final screenWidth = MediaQuery.of(context).size.width;
    final isSmallScreen = screenWidth < 600;
    
    return Container(
      padding: EdgeInsets.symmetric(horizontal: isSmallScreen ? 8 : 12, vertical: isSmallScreen ? 4 : 6),
      decoration: BoxDecoration(
        color: _getStatusBackgroundColor(status),
        borderRadius: BorderRadius.circular(isSmallScreen ? 6 : 8),
        border: Border.all(color: _getStatusColor(status).withOpacity(0.3), width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: isSmallScreen ? 6 : 8,
            height: isSmallScreen ? 6 : 8,
            decoration: BoxDecoration(
              color: _getStatusColor(status),
              shape: BoxShape.circle,
            ),
          ),
          SizedBox(width: isSmallScreen ? 4 : 6),
          Text(
            status,
            style: TextStyle(
              color: _getStatusColor(status),
              fontSize: isSmallScreen ? 10 : 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isSmallScreen = screenWidth < 600;
    
    return Scaffold(
      appBar: AppBar(title: Text('Chi tiết đơn ${widget.isImport ? 'NHẬP' : 'XUẤT'}')),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error != null
          ? Center(child: Text(error!))
          : Column(
        children: [
          Padding(
            padding: EdgeInsets.all(isSmallScreen ? 12 : 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    'Mã đơn: ${widget.orderCode}',
                    style: TextStyle(
                      fontSize: isSmallScreen ? 14 : 16,
                      fontWeight: FontWeight.w600,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                SizedBox(width: isSmallScreen ? 6 : 8),
                _buildStatusBadge(),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: order?['items']?.length ?? 0,
              itemBuilder: (context, index) {
                final item = order!['items'][index];
                final scanned = item['scanned_quantity'] ?? 0;
                final total = item['quantity'];
                final location = item['location'];
                return Card(
                  margin: EdgeInsets.all(isSmallScreen ? 6 : 8),
                  child: InkWell(
                    onTap: (order?['status'] == 'CANCELLED' || order?['status'] == 'APPROVED' || order?['status'] == 'DONE') ? null : () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => ScanScreen(
                            isImport: widget.isImport,
                            presetOrderId: widget.orderId,
                            presetOrderCode: widget.orderCode,
                            presetLocationId: location?['id'],
                            presetLocationPath: location != null
                                ? '${location['parent']?['parent']?['name'] ?? ''} > ${location['parent']?['name'] ?? ''} > ${location['name'] ?? ''}'
                                : null,
                          ),
                        ),
                      ).then((result) {
                        // Refresh detail after scan
                        if (result == true) {
                          _fetchDetail();
                        }
                      });
                    },
                    child: ListTile(
                      title: Text(item['product']['name']),
                      subtitle: Text('Cần: $total | Đã scan: $scanned'),
                      trailing: scanned >= total
                          ? const Icon(Icons.check_circle, color: Colors.green)
                          : const Icon(Icons.pending, color: Colors.orange),
                    ),
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: EdgeInsets.all(isSmallScreen ? 12 : 16),
            child: ElevatedButton.icon(
              onPressed: null,
              icon: const Icon(Icons.qr_code_scanner),
              label: Text(_getButtonText()),
              style: ElevatedButton.styleFrom(
                minimumSize: Size(double.infinity, isSmallScreen ? 45 : 50),
                backgroundColor: _getButtonColor(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}