import 'package:flutter/material.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _userController = TextEditingController();
  final TextEditingController _passController = TextEditingController();
  String? _message;

  Future<void> _login() async {
    final user = _userController.text;
    final pass = _passController.text;

    try {
      final res = await Uri.parse('http://10.0.2.2:8080/auth/login');
      // For simplicity, not performing real HTTP here. Integrate with http package later.
      setState(() {
        _message = 'Would POST to $res with user=$user';
      });
    } catch (e) {
      setState(() {
        _message = e.toString();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Staff Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(controller: _userController, decoration: const InputDecoration(labelText: 'Username')),
            TextField(controller: _passController, decoration: const InputDecoration(labelText: 'Password'), obscureText: true),
            const SizedBox(height: 16),
            ElevatedButton(onPressed: _login, child: const Text('Login')),
            if (_message != null) ...[
              const SizedBox(height: 12),
              Text(_message!),
            ]
          ],
        ),
      ),
    );
  }
}
