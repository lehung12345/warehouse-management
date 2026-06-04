import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../models/order_model.dart';

class OrderService {
  static String get baseUrl {
    final url = dotenv.env['API_URL'];
    if (url == null || url.isEmpty) {
      throw Exception('API_URL not found in .env file');
    }
    return url;
  }

  static Future<List<OrderModel>> getImports(String token) async {
    try {
      final res = await http.get(
        Uri.parse('$baseUrl/api/orders/import'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (res.statusCode == 200) {
        final List data = jsonDecode(res.body);
        return data.map((e) => OrderModel.fromJson(e)).toList();
      }
      throw Exception("Lỗi ${res.statusCode}");
    } catch (e) {
      throw Exception("Không thể tải đơn nhập: $e");
    }
  }

  static Future<List<OrderModel>> getExports(String token) async {
    try {
      final res = await http.get(
        Uri.parse('$baseUrl/api/orders/export'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (res.statusCode == 200) {
        final List data = jsonDecode(res.body);
        return data.map((e) => OrderModel.fromJson(e)).toList();
      }
      throw Exception("Lỗi ${res.statusCode}");
    } catch (e) {
      throw Exception("Không thể tải đơn xuất: $e");
    }
  }

  static Future<int?> getImportIdByCode(String code, String token) async {
    try {
      final res = await http.get(
        Uri.parse('$baseUrl/api/orders/import/code/$code'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        return data['id'] as int?;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  static Future<int?> getExportIdByCode(String code, String token) async {
    try {
      final res = await http.get(
        Uri.parse('$baseUrl/api/orders/export/code/$code'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        return data['id'] as int?;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  static Future<Map<String, int>> getUnseenCounts(String token) async {
    try {
      final res = await http.get(
        Uri.parse('$baseUrl/api/orders/unseen-counts'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        return {
          'import_all': data['import_all'] ?? 0,
          'import_approved': data['import_approved'] ?? 0,
          'import_done': data['import_done'] ?? 0,
          'import_processing': data['import_processing'] ?? 0,
          'import_pending': data['import_pending'] ?? 0,
          'import_cancelled': data['import_cancelled'] ?? 0,
          'export_all': data['export_all'] ?? 0,
          'export_approved': data['export_approved'] ?? 0,
          'export_done': data['export_done'] ?? 0,
          'export_processing': data['export_processing'] ?? 0,
          'export_pending': data['export_pending'] ?? 0,
          'export_cancelled': data['export_cancelled'] ?? 0,
        };
      }
      return {
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
    } catch (e) {
      return {
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
    }
  }

  static Future<void> markOrderAsSeen(int orderId, String orderType, String token) async {
    try {
      await http.post(
        Uri.parse('$baseUrl/api/orders/mark-seen'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'order_id': orderId,
          'order_type': orderType,
        }),
      );
    } catch (e) {
      // Silently fail for marking as seen
    }
  }
}