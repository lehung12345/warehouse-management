import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  UserModel? _user;
  String? _token;
  bool _isLoading = true;

  UserModel? get user => _user;
  String? get token => _token;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _token != null && _user != null;

  AuthProvider() {
    _loadSession();
  }

  Future<void> _loadSession() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final userStr = prefs.getString('user');

    if (token != null && userStr != null) {
      try {
        _token = token;
        _user = UserModel.fromJson(jsonDecode(userStr));
      } catch (e) {
        await logout();
      }
    }
    
    _isLoading = false;
    notifyListeners();
  }

  Future<void> login(String username, String email, String password) async {
    final result = await AuthService.login(username, email, password);
    final user = result['user'] as UserModel;

    if (!user.isStaff) {
      throw const AuthException('Thông tin bị sai yêu cầu nhập lại');
    }

    _token = result['token'] as String;
    _user = user;

    // Lưu vào storage
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', _token!);
    await prefs.setString('user', jsonEncode(_user!.toJson()));

    notifyListeners();
  }

  Future<void> logout() async {
    _token = null;
    _user = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('user');
    notifyListeners();
  }
}
