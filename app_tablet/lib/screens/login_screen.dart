import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/auth_provider.dart';
import '../services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _usernameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isSubmitting = false;
  bool _obscurePassword = true;
  String? _errorMessage;

  @override
  void dispose() {
    _usernameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    final username = _usernameController.text.trim();
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();

    if (username.isEmpty || email.isEmpty || password.isEmpty) {
      setState(() => _errorMessage = 'Vui lòng nhập đầy đủ Username, Email và Mật khẩu');
      return;
    }

    setState(() {
      _isSubmitting = true;
      _errorMessage = null;
    });

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      await authProvider.login(username, email, password);
      // Đăng nhập thành công, Consumer sẽ tự động chuyển màn hình
    } on AuthException catch (e) {
      setState(() => _errorMessage = e.message);
    } catch (e) {
      setState(() => _errorMessage = 'Lỗi không xác định: $e');
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isSmallScreen = screenWidth < 600;
    
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: EdgeInsets.symmetric(horizontal: isSmallScreen ? 20 : 24, vertical: isSmallScreen ? 24 : 32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Header (App Native Style)
                Icon(
                  Icons.warehouse_rounded,
                  size: isSmallScreen ? 64 : 80,
                  color: const Color(0xFF2563EB),
                ),
                SizedBox(height: isSmallScreen ? 20 : 24),
                Text(
                  'Xin chào!',
                  style: GoogleFonts.inter(
                    fontSize: isSmallScreen ? 28 : 32,
                    fontWeight: FontWeight.w800,
                    color: const Color(0xFF1E293B),
                    letterSpacing: -0.5,
                  ),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: isSmallScreen ? 6 : 8),
                Text(
                  'Đăng nhập để vào hệ thống kho',
                  style: GoogleFonts.inter(
                    fontSize: isSmallScreen ? 14 : 16,
                    color: const Color(0xFF64748B),
                  ),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: isSmallScreen ? 36 : 48),

                // Error Message
                if (_errorMessage != null) ...[
                  Container(
                    padding: EdgeInsets.all(isSmallScreen ? 10 : 12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEE2E2),
                      borderRadius: BorderRadius.circular(isSmallScreen ? 10 : 12),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.error_outline, color: const Color(0xFFEF4444), size: isSmallScreen ? 20 : 24),
                        SizedBox(width: isSmallScreen ? 10 : 12),
                        Expanded(
                          child: Text(
                            _errorMessage!,
                            style: GoogleFonts.inter(
                              color: const Color(0xFFB91C1C),
                              fontSize: isSmallScreen ? 13 : 14,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  SizedBox(height: isSmallScreen ? 20 : 24),
                ],

                // Username Input
                _buildInputLabel('Username'),
                SizedBox(height: isSmallScreen ? 6 : 8),
                _buildTextField(
                  controller: _usernameController,
                  hint: 'Nhập username',
                  icon: Icons.person_outline,
                ),
                SizedBox(height: isSmallScreen ? 16 : 20),

                // Email Input
                _buildInputLabel('Email'),
                SizedBox(height: isSmallScreen ? 6 : 8),
                _buildTextField(
                  controller: _emailController,
                  hint: 'Nhập email',
                  icon: Icons.email_outlined,
                ),
                SizedBox(height: isSmallScreen ? 16 : 20),

                // Password Input
                _buildInputLabel('Mật khẩu'),
                SizedBox(height: isSmallScreen ? 6 : 8),
                _buildTextField(
                  controller: _passwordController,
                  hint: 'Nhập mật khẩu',
                  icon: Icons.lock_outline,
                  isPassword: true,
                ),
                SizedBox(height: isSmallScreen ? 24 : 32),

                // Login Button
                ElevatedButton(
                  onPressed: _isSubmitting ? null : _handleLogin,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF2563EB),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    padding: EdgeInsets.symmetric(vertical: isSmallScreen ? 14 : 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(isSmallScreen ? 14 : 16),
                    ),
                  ),
                  child: _isSubmitting
                      ? SizedBox(
                          height: isSmallScreen ? 20 : 24,
                          width: isSmallScreen ? 20 : 24,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2.5,
                          ),
                        )
                      : Text(
                          'Đăng nhập',
                          style: GoogleFonts.inter(
                            fontSize: isSmallScreen ? 15 : 16,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                ),
                
                SizedBox(height: isSmallScreen ? 20 : 24),
                Text(
                  'Tài khoản do bộ phận quản lý cấp phát',
                  style: GoogleFonts.inter(
                    fontSize: isSmallScreen ? 12 : 13,
                    color: const Color(0xFF94A3B8),
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInputLabel(String text) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isSmallScreen = screenWidth < 600;
    
    return Text(
      text,
      style: GoogleFonts.inter(
        fontSize: isSmallScreen ? 13 : 14,
        fontWeight: FontWeight.w600,
        color: const Color(0xFF334155),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    bool isPassword = false,
  }) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isSmallScreen = screenWidth < 600;
    
    return TextFormField(
      controller: controller,
      obscureText: isPassword && _obscurePassword,
      style: GoogleFonts.inter(
        color: const Color(0xFF0F172A),
        fontSize: isSmallScreen ? 14 : 15,
      ),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: GoogleFonts.inter(color: const Color(0xFF94A3B8), fontSize: isSmallScreen ? 14 : 15),
        prefixIcon: Icon(icon, color: const Color(0xFF64748B), size: isSmallScreen ? 20 : 22),
        suffixIcon: isPassword
            ? IconButton(
                icon: Icon(
                  _obscurePassword ? Icons.visibility_off : Icons.visibility,
                  color: const Color(0xFF64748B),
                  size: isSmallScreen ? 20 : 22,
                ),
                onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
              )
            : null,
        filled: true,
        fillColor: Colors.white,
        contentPadding: EdgeInsets.symmetric(horizontal: isSmallScreen ? 14 : 16, vertical: isSmallScreen ? 14 : 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(isSmallScreen ? 14 : 16),
          borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(isSmallScreen ? 14 : 16),
          borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(isSmallScreen ? 14 : 16),
          borderSide: const BorderSide(color: Color(0xFF2563EB), width: 2),
        ),
      ),
    );
  }
}
