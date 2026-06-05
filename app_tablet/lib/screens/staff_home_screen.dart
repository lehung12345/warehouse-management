import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';

import '../providers/auth_provider.dart';
import 'scan_screen.dart';
import 'orders_screen.dart';
import 'import_inventory_screen.dart';
import 'export_inventory_screen.dart';
import 'warehouse_picker_screen.dart';

class StaffHomeScreen extends StatelessWidget {
  const StaffHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.user;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'WareFlow Staff',
          style: GoogleFonts.inter(
            fontWeight: FontWeight.w800,
            color: const Color(0xFF0F172A),
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded, color: Color(0xFF64748B)),
            onPressed: () => authProvider.logout(),
          ),
        ],
      ),

      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ================= HEADER =================
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: const Color(0xFF2563EB),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF2563EB).withOpacity(0.3),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 28,
                      backgroundColor: Colors.white.withOpacity(0.2),
                      child: Text(
                        user?.username.substring(0, 1).toUpperCase() ?? 'U',
                        style: GoogleFonts.inter(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Xin chào,',
                            style: GoogleFonts.inter(
                              color: Colors.white70,
                              fontSize: 14,
                            ),
                          ),
                          Text(
                            user?.username ?? 'Nhân viên',
                            style: GoogleFonts.inter(
                              color: Colors.white,
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        'STAFF',
                        style: GoogleFonts.inter(
                          color: const Color(0xFF2563EB),
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 32),

              Text(
                'Tác vụ kho',
                style: GoogleFonts.inter(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF1E293B),
                ),
              ),

              const SizedBox(height: 16),

              // ================= GRID =================
              LayoutBuilder(
                builder: (context, constraints) {
                  // Calculate responsive grid based on screen width
                  final screenWidth = MediaQuery.of(context).size.width;
                  final crossAxisCount = screenWidth < 600 ? 2 : (screenWidth < 900 ? 3 : 4);
                  final childAspectRatio = screenWidth < 600 ? 1.1 : (screenWidth < 900 ? 1.2 : 1.3);
                  
                  return GridView.count(
                    crossAxisCount: crossAxisCount,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    mainAxisSpacing: screenWidth < 600 ? 12 : 16,
                    crossAxisSpacing: screenWidth < 600 ? 12 : 16,
                    childAspectRatio: childAspectRatio,
                    children: [
                  _buildActionCard(
                    context: context,
                    title: 'Vị trí kho',
                    subtitle: 'Chọn kho',
                    icon: Icons.warehouse_rounded,
                    color: const Color(0xFF3B82F6),
                    bgColor: const Color(0xFFEFF6FF),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const WarehousePickerScreen(),
                        ),
                      );
                    },
                  ),

                  _buildActionCard(
                    context: context,
                    title: 'Nhập Kho',
                    subtitle: 'Import hàng',
                    icon: Icons.inventory_2_rounded,
                    color: const Color(0xFF10B981),
                    bgColor: const Color(0xFFECFDF5),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const ImportInventoryScreen(),
                        ),
                      );
                    },
                  ),

                  _buildActionCard(
                    context: context,
                    title: 'Xuất Kho',
                    subtitle: 'Export hàng',
                    icon: Icons.outbox_rounded,
                    color: const Color(0xFFF59E0B),
                    bgColor: const Color(0xFFFFFBEB),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const ExportInventoryScreen(),
                        ),
                      );
                    },
                  ),

                  _buildActionCard(
                    context: context,
                    title: 'Đơn Hàng',
                    subtitle: 'Import / Export',
                    icon: Icons.assignment_rounded,
                    color: const Color(0xFF8B5CF6),
                    bgColor: const Color(0xFFF5F3FF),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const OrdersScreen(),
                        ),
                      );
                    },
                  ),
                ],
              );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ================= ACTION CARD =================
  Widget _buildActionCard({
    required BuildContext context,
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required Color bgColor,
    required VoidCallback onTap,
  }) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isSmallScreen = screenWidth < 600;
    
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: onTap,
          child: Padding(
            padding: EdgeInsets.all(isSmallScreen ? 12 : 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: EdgeInsets.all(isSmallScreen ? 8 : 12),
                  decoration: BoxDecoration(
                    color: bgColor,
                    borderRadius: BorderRadius.circular(isSmallScreen ? 12 : 14),
                  ),
                  child: Icon(icon, color: color, size: isSmallScreen ? 22 : 28),
                ),

                const Spacer(),

                Text(
                  title,
                  style: GoogleFonts.inter(
                    fontSize: isSmallScreen ? 14 : 16,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFF1E293B),
                  ),
                ),

                SizedBox(height: isSmallScreen ? 2 : 4),

                Text(
                  subtitle,
                  style: GoogleFonts.inter(
                    fontSize: isSmallScreen ? 10 : 12,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}