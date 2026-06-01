// import 'dart:convert';
// import 'package:http/http.dart' as http;
// import 'package:flutter_dotenv/flutter_dotenv.dart';
//
// class ScanService {
//   static String get _baseUrl => dotenv.env['API_URL'] ?? 'http://10.0.2.2:8080';
//
//   static Future<String> scanImport({
//     required int importId,
//     required int productId,
//     required int quantity,
//     required String token,
//   }) async {
//     final res = await http.post(
//       Uri.parse('$_baseUrl/api/scan/import'),
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer $token',
//       },
//       body: jsonEncode({
//         "import_id": importId,
//         "product_id": productId,
//         "quantity": quantity,
//       }),
//     );
//
//     final data = jsonDecode(res.body);
//
//     if (res.statusCode == 200) {
//       return data['message'];
//     } else {
//       throw Exception(data['error'] ?? 'Scan import failed');
//     }
//   }
//
//   static Future<String> scanExport({
//     required int exportId,
//     required int productId,
//     required int quantity,
//     required String token,
//   }) async {
//     final res = await http.post(
//       Uri.parse('$_baseUrl/api/scan/import'),
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer $token',
//       },
//       body: jsonEncode({
//         "export_id": exportId,
//         "product_id": productId,
//         "quantity": quantity,
//       }),
//     );
//
//     final data = jsonDecode(res.body);
//
//     if (res.statusCode == 200) {
//       return data['message'];
//     } else {
//       throw Exception(data['error'] ?? 'Scan export failed');
//     }
//   }
// }


import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ScanService {
  static String get _baseUrl => dotenv.env['API_URL'] ?? 'http://10.0.2.2:8080';

  static Future<String> scanImport({
    required int importId,
    required String barcode,
    required int locationId,
    required int quantity,
    required String token,
  }) async {
    try {
      final res = await http.post(
        Uri.parse('$_baseUrl/api/scan/import'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          "import_id": importId,
          "barcode": barcode,
          "location_id": locationId,
          "quantity": quantity,
        }),
      );
      if (res.statusCode == 401) throw Exception("Phiên đăng nhập hết hạn");
      if (res.statusCode == 403) throw Exception("Không có quyền");
      final data = jsonDecode(res.body);
      if (res.statusCode == 200) return data['message'] ?? 'Thành công';
      throw Exception(data['error'] ?? 'Lỗi không xác định');
    } catch (e) {
      throw Exception("Lỗi quét nhập: $e");
    }
  }

  static Future<String> scanExport({
    required int exportId,
    required String barcode,
    required int locationId,
    required int quantity,
    required String token,
  }) async {
    try {
      final res = await http.post(
        Uri.parse('$_baseUrl/api/scan/export'), // ĐÃ SỬA: không phải /import
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          "export_id": exportId,
          "barcode": barcode,
          "location_id": locationId,
          "quantity": quantity,
        }),
      );
      if (res.statusCode == 401) throw Exception("Phiên đăng nhập hết hạn");
      if (res.statusCode == 403) throw Exception("Không có quyền");
      final data = jsonDecode(res.body);
      if (res.statusCode == 200) return data['message'] ?? 'Thành công';
      throw Exception(data['error'] ?? 'Lỗi không xác định');
    } catch (e) {
      throw Exception("Lỗi quét xuất: $e");
    }
  }
}