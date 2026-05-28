// import 'dart:convert';
// import 'package:http/http.dart' as http;
// import 'package:flutter_dotenv/flutter_dotenv.dart';
// import '../models/inventory_model.dart';
//
// class InventoryService {
//   static String get baseUrl =>
//       dotenv.env['API_URL'] ?? 'http://10.0.2.2:8080';
//
//   static Future<List<InventoryModel>> getInventory() async {
//     final res = await http.get(Uri.parse('$baseUrl/api/inventories'));
//
//     if (res.statusCode == 200) {
//       final List data = jsonDecode(res.body);
//
//       return data.map((e) => InventoryModel.fromJson(e)).toList();
//     } else {
//       throw Exception("Load inventory failed");
//     }
//   }
// }

import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../models/inventory_model.dart';

class InventoryService {
  static String get baseUrl => dotenv.env['API_URL'] ?? 'http://10.0.2.2:8080';

  static Future<List<InventoryModel>> getInventory(String token) async {
    try {
      final res = await http.get(
        Uri.parse('$baseUrl/api/inventories'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (res.statusCode == 200) {
        final List data = jsonDecode(res.body);
        return data.map((e) => InventoryModel.fromJson(e)).toList();
      } else {
        throw Exception("Server trả về mã lỗi: ${res.statusCode}");
      }
    } catch (e) {
      throw Exception("Không thể tải danh sách tồn kho: $e");
    }
  }
}