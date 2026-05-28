class OrderModel {
  final int id;
  final String code;
  final String status;
  final String createdAt;

  OrderModel({
    required this.id,
    required this.code,
    required this.status,
    required this.createdAt,
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) {
    return OrderModel(
      id: json['id'],
      code: json['code'] ?? '',
      status: json['status'] ?? 'PENDING',
      createdAt: json['created_at'] ?? '',
    );
  }
}