// import 'dart:convert';
// import 'package:http/http.dart' as http;
// import 'package:flutter_dotenv/flutter_dotenv.dart';
// import '../models/order_model.dart';
//
// class OrderService {
//   static String get baseUrl =>
//       dotenv.env['API_URL'] ?? 'http://10.0.2.2:8080';
//
//   static Future<List<OrderModel>> getImports() async {
//     final res = await http.get(Uri.parse('$baseUrl/api/scan/imports'));
//
//     if (res.statusCode == 200) {
//       final List data = jsonDecode(res.body);
//       return data.map((e) => OrderModel.fromJson(e)).toList();
//     } else {
//       throw Exception("Load imports failed");
//     }
//   }
//
//   static Future<List<OrderModel>> getExports() async {
//     final res = await http.get(Uri.parse('$baseUrl/api/scan/exports'));
//
//     if (res.statusCode == 200) {
//       final List data = jsonDecode(res.body);
//       return data.map((e) => OrderModel.fromJson(e)).toList();
//     } else {
//       throw Exception("Load exports failed");
//     }
//   }
// }
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../models/order_model.dart';

class OrderService {
  static String get baseUrl => dotenv.env['API_URL'] ?? 'http://10.0.2.2:8080';

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
}