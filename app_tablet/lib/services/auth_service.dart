import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../models/user_model.dart';

class AuthException implements Exception {
  final String message;
  const AuthException(this.message);
  @override
  String toString() => message;
}

class AuthService {
  static String get _baseUrl {
    final url = dotenv.env['API_URL'];
    if (url == null || url.isEmpty) {
      throw Exception('API_URL not found in .env file');
    }
    return url;
  }

  static const Duration _timeout = Duration(seconds: 15);

  /// Đăng nhập bằng username hoặc email + password
  /// Trả về map chứa 'token' và 'user'
  static Future<Map<String, dynamic>> login(
    String username,
    String email,
    String password,
  ) async {
    try {
      final res = await http
          .post(
            Uri.parse('$_baseUrl/auth/login'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'username': username,
              'email': email,
              'password': password,
              'platform': 'mobile',
            }),
          )
          .timeout(_timeout);

      final data = jsonDecode(res.body) as Map<String, dynamic>;

      if (res.statusCode == 200) {
        return {
          'token': data['token'] as String,
          'user': UserModel.fromJson(data['user'] as Map<String, dynamic>),
        };
      }

      // Lỗi từ server
      final errMsg = data['error'] as String? ?? 'Đăng nhập thất bại';
      throw AuthException(errMsg);
    } on AuthException {
      rethrow;
    } catch (e) {
      if (e.toString().contains('timeout') || e.toString().contains('TimeoutException')) {
        throw const AuthException('Không thể kết nối server. Vui lòng kiểm tra kết nối mạng.');
      }
      throw AuthException('Lỗi kết nối: ${e.toString()}');
    }
  }
}
