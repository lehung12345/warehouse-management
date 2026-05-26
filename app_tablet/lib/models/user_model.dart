class UserModel {
  final int id;
  final String username;
  final String email;
  final String role;
  final String createdAt;

  const UserModel({
    required this.id,
    required this.username,
    required this.email,
    required this.role,
    required this.createdAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as int,
      username: json['username'] as String,
      email: json['email'] as String,
      role: json['role'] as String,
      createdAt: json['created_at'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'username': username,
        'email': email,
        'role': role,
        'created_at': createdAt,
      };

  bool get isAdmin => role == 'ADMIN';
  bool get isStaff => role == 'STAFF';

  @override
  String toString() => 'UserModel(id: $id, username: $username, role: $role)';
}
