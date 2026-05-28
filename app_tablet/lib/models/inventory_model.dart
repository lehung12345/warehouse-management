class InventoryModel {
  final int id;
  final String product;
  final String sku;
  final int quantity;
  final String location;
  final String status;

  InventoryModel({
    required this.id,
    required this.product,
    required this.sku,
    required this.quantity,
    required this.location,
    required this.status,
  });

  factory InventoryModel.fromJson(Map<String, dynamic> json) {
    return InventoryModel(
      id: json['id'],
      product: json['product'],
      sku: json['sku'],
      quantity: json['quantity'],
      location: json['location'],
      status: json['status'],
    );
  }
}