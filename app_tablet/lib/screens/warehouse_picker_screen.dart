import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import '../providers/auth_provider.dart';
import 'warehouse_orders_screen.dart';

class WarehousePickerScreen extends StatefulWidget {
  const WarehousePickerScreen({super.key});

  @override
  State<WarehousePickerScreen> createState() => _WarehousePickerScreenState();
}

class _WarehousePickerScreenState extends State<WarehousePickerScreen> {
  List<dynamic> warehouses = [];
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _fetchWarehouses();
  }

  Future<void> _fetchWarehouses() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final token = auth.token;
    if (token == null) return;

    try {
      final baseUrl = dotenv.env['API_URL'];
      if (baseUrl == null) throw Exception('Missing API_URL in environment');
      final url = '$baseUrl/api/locations';
      final res = await http.get(
        Uri.parse(url),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        // Filter only warehouses (type = 'WAREHOUSE')
        final warehouseList = (data as List).where((loc) => loc['type'] == 'WAREHOUSE').toList();
        setState(() {
          warehouses = warehouseList;
          loading = false;
        });
      } else {
        throw Exception('Lỗi ${res.statusCode}');
      }
    } catch (e) {
      setState(() {
        error = e.toString();
        loading = false;
      });
    }
  }

  String _buildLocationPath(dynamic location) {
    String path = location['name'] ?? '';
    dynamic parent = location['parent'];
    while (parent != null) {
      path = '${parent['name']} > $path';
      parent = parent['parent'];
    }
    return path;
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isSmallScreen = screenWidth < 600;
    
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Chọn kho',
          style: GoogleFonts.inter(
            fontWeight: FontWeight.w700,
            color: const Color(0xFF0F172A),
            fontSize: isSmallScreen ? 16 : 18,
          ),
        ),
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error != null
              ? Center(child: Text('Lỗi: $error'))
              : warehouses.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.warehouse_rounded,
                            size: isSmallScreen ? 48 : 56,
                            color: const Color(0xFFD1D5DB),
                          ),
                          SizedBox(height: isSmallScreen ? 10 : 12),
                          Text(
                            'Không có kho nào',
                            style: GoogleFonts.inter(
                              color: const Color(0xFF6B7280),
                              fontSize: isSmallScreen ? 13 : 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      padding: EdgeInsets.all(isSmallScreen ? 12 : 16),
                      itemCount: warehouses.length,
                      itemBuilder: (context, index) {
                        final warehouse = warehouses[index];
                        return Card(
                          margin: EdgeInsets.only(bottom: isSmallScreen ? 10 : 12),
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(isSmallScreen ? 14 : 16),
                            side: BorderSide(
                              color: Colors.black.withOpacity(0.06),
                              width: 1,
                            ),
                          ),
                          child: InkWell(
                            borderRadius: BorderRadius.circular(isSmallScreen ? 14 : 16),
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => WarehouseOrdersScreen(
                                    locationId: warehouse['id'],
                                    locationName: warehouse['name'],
                                    locationPath: _buildLocationPath(warehouse),
                                  ),
                                ),
                              );
                            },
                            child: Padding(
                              padding: EdgeInsets.all(isSmallScreen ? 12 : 16),
                              child: Row(
                                children: [
                                  Container(
                                    padding: EdgeInsets.all(isSmallScreen ? 10 : 12),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF3B82F6).withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(isSmallScreen ? 10 : 12),
                                    ),
                                    child: Icon(
                                      Icons.warehouse_rounded,
                                      color: const Color(0xFF3B82F6),
                                      size: isSmallScreen ? 24 : 28,
                                    ),
                                  ),
                                  SizedBox(width: isSmallScreen ? 12 : 16),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          warehouse['name'] ?? 'Unknown',
                                          style: GoogleFonts.inter(
                                            fontSize: isSmallScreen ? 15 : 16,
                                            fontWeight: FontWeight.w600,
                                            color: const Color(0xFF1E293B),
                                          ),
                                        ),
                                        SizedBox(height: isSmallScreen ? 3 : 4),
                                        Text(
                                          _buildLocationPath(warehouse),
                                          style: GoogleFonts.inter(
                                            fontSize: isSmallScreen ? 11 : 12,
                                            fontWeight: FontWeight.w500,
                                            color: const Color(0xFF64748B),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Icon(
                                    Icons.arrow_forward_ios_rounded,
                                    size: isSmallScreen ? 14 : 16,
                                    color: const Color(0xFF9CA3AF),
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
