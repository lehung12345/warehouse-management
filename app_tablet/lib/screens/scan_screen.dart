// import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
// import '../providers/auth_provider.dart';
// import '../services/scan_service.dart';
//
// class ScanScreen extends StatefulWidget {
//   final bool isImport; // true = import, false = export
//
//   const ScanScreen({super.key, required this.isImport});
//
//   @override
//   State<ScanScreen> createState() => _ScanScreenState();
// }
//
// class _ScanScreenState extends State<ScanScreen> {
//   final productIdController = TextEditingController();
//   final orderIdController = TextEditingController();
//   final qtyController = TextEditingController();
//
//   bool loading = false;
//
//   Future<void> submit() async {
//     final auth = Provider.of<AuthProvider>(context, listen: false);
//
//     setState(() => loading = true);
//
//     try {
//       if (widget.isImport) {
//         await ScanService.scanImport(
//           importId: int.parse(orderIdController.text),
//           productId: int.parse(productIdController.text),
//           quantity: int.parse(qtyController.text),
//           token: auth.token!,
//         );
//       } else {
//         await ScanService.scanExport(
//           exportId: int.parse(orderIdController.text),
//           productId: int.parse(productIdController.text),
//           quantity: int.parse(qtyController.text),
//           token: auth.token!,
//         );
//       }
//
//       ScaffoldMessenger.of(context).showSnackBar(
//         const SnackBar(content: Text("Scan success")),
//       );
//     } catch (e) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(content: Text(e.toString())),
//       );
//     }
//
//     setState(() => loading = false);
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text(widget.isImport ? "Scan Import" : "Scan Export"),
//       ),
//       body: Padding(
//         padding: const EdgeInsets.all(16),
//         child: Column(
//           children: [
//             TextField(
//               controller: orderIdController,
//               decoration: const InputDecoration(labelText: "Order ID"),
//             ),
//             TextField(
//               controller: productIdController,
//               decoration: const InputDecoration(labelText: "Product ID"),
//             ),
//             TextField(
//               controller: qtyController,
//               keyboardType: TextInputType.number,
//               decoration: const InputDecoration(labelText: "Quantity"),
//             ),
//             const SizedBox(height: 20),
//             ElevatedButton(
//               onPressed: loading ? null : submit,
//               child: Text(loading ? "Processing..." : "Scan"),
//             )
//           ],
//         ),
//       ),
//     );
//   }
// }


//bản xịn cần quyets qr
//
// import 'package:flutter/material.dart';
// import 'package:mobile_scanner/mobile_scanner.dart';
// import 'package:provider/provider.dart';
// import '../providers/auth_provider.dart';
// import '../services/scan_service.dart';
// import 'location_picker_screen.dart';
//
// class ScanScreen extends StatefulWidget {
//   final bool isImport;
//   final int? presetOrderId; // thêm dòng này
//   const ScanScreen({super.key, required this.isImport, this.presetOrderId}); // sửa constructor
//
//   @override
//   State<ScanScreen> createState() => _ScanScreenState();
// }
//
// class _ScanScreenState extends State<ScanScreen> {
//   final MobileScannerController scannerController = MobileScannerController();
//   bool isScanning = true;
//   String? scannedProductId;
//   int? orderId;
//   int quantity = 1;
//   int? selectedLocationId;
//   String selectedLocationPath = '';
//   String? error;
//   bool submitting = false;
//
//   @override
//   void initState() {
//     super.initState();
//     // Nếu có presetOrderId thì tự động điền
//     if (widget.presetOrderId != null) {
//       orderId = widget.presetOrderId;
//     }
//   }
//
//   @override
//   void dispose() {
//     scannerController.dispose();
//     super.dispose();
//   }
//
//   void _onScan(BarcodeCapture capture) {
//     if (!isScanning) return;
//     final String? raw = capture.barcodes.first.rawValue;
//     if (raw != null) {
//       setState(() {
//         isScanning = false;
//         scannedProductId = raw;
//       });
//       scannerController.stop();
//     }
//   }
//
//   Future<void> _submit() async {
//     final token = Provider.of<AuthProvider>(context, listen: false).token;
//     if (token == null) {
//       setState(() { error = "Chưa đăng nhập"; });
//       return;
//     }
//     if (scannedProductId == null || orderId == null) {
//       setState(() { error = "Vui lòng scan sản phẩm và nhập mã đơn"; });
//       return;
//     }
//     if (widget.isImport && selectedLocationId == null) {
//       setState(() { error = "Vui lòng chọn vị trí nhập kho"; });
//       return;
//     }
//     setState(() { submitting = true; error = null; });
//     try {
//       String message;
//       if (widget.isImport) {
//         message = await ScanService.scanImport(
//           importId: orderId!,
//           productId: int.parse(scannedProductId!),
//           quantity: quantity,
//           token: token,
//         );
//       } else {
//         message = await ScanService.scanExport(
//           exportId: orderId!,
//           productId: int.parse(scannedProductId!),
//           quantity: quantity,
//           token: token,
//         );
//       }
//       // Hiển thị thông báo thành công và quay về
//       ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
//       Navigator.pop(context, true); // trả về true để refresh màn hình trước
//     } catch (e) {
//       setState(() { error = e.toString(); submitting = false; });
//     }
//   }
//
//   void _pickLocation() async {
//     final token = Provider.of<AuthProvider>(context, listen: false).token;
//     if (token == null) return;
//     final result = await Navigator.push(
//       context,
//       MaterialPageRoute(
//         builder: (_) => LocationPickerScreen(
//           token: token,
//           onSelected: (id, path) {
//             setState(() {
//               selectedLocationId = id;
//               selectedLocationPath = path;
//             });
//           },
//         ),
//       ),
//     );
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: Text(widget.isImport ? "Nhập kho" : "Xuất kho")),
//       body: Column(
//         children: [
//           if (isScanning)
//             SizedBox(
//               height: 300,
//               child: MobileScanner(
//                 controller: scannerController,
//                 onDetect: _onScan,
//               ),
//             )
//           else
//             Card(
//               margin: const EdgeInsets.all(16),
//               child: ListTile(
//                 title: const Text("Sản phẩm đã scan"),
//                 subtitle: Text("Product ID: $scannedProductId"),
//                 trailing: IconButton(
//                   icon: const Icon(Icons.refresh),
//                   onPressed: () {
//                     setState(() {
//                       isScanning = true;
//                       scannedProductId = null;
//                       scannerController.start();
//                     });
//                   },
//                 ),
//               ),
//             ),
//           Padding(
//             padding: const EdgeInsets.all(16),
//             child: Column(
//               children: [
//                 TextField(
//                   keyboardType: TextInputType.number,
//                   decoration: const InputDecoration(labelText: "Mã đơn hàng (Order ID)"),
//                   onChanged: (v) => orderId = int.tryParse(v),
//                   controller: widget.presetOrderId != null
//                       ? TextEditingController(text: widget.presetOrderId.toString())
//                       : null,
//                   readOnly: widget.presetOrderId != null, // nếu có preset thì không sửa
//                 ),
//                 const SizedBox(height: 12),
//                 TextField(
//                   keyboardType: TextInputType.number,
//                   decoration: const InputDecoration(labelText: "Số lượng"),
//                   onChanged: (v) => quantity = int.tryParse(v) ?? 1,
//                 ),
//                 if (widget.isImport) ...[
//                   const SizedBox(height: 12),
//                   ElevatedButton.icon(
//                     onPressed: _pickLocation,
//                     icon: const Icon(Icons.place),
//                     label: Text(selectedLocationPath.isEmpty ? "Chọn vị trí" : selectedLocationPath),
//                   ),
//                 ],
//                 const SizedBox(height: 24),
//                 if (error != null) Text(error!, style: const TextStyle(color: Colors.red)),
//                 const SizedBox(height: 12),
//                 ElevatedButton(
//                   onPressed: submitting ? null : _submit,
//                   child: submitting ? const CircularProgressIndicator() : const Text("Xác nhận"),
//                 ),
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }



//bản có thể nập tay
// import 'package:flutter/material.dart';
// import 'package:mobile_scanner/mobile_scanner.dart';
// import 'package:provider/provider.dart';
// import '../providers/auth_provider.dart';
// import '../services/scan_service.dart';
// import 'location_picker_screen.dart';
//
// class ScanScreen extends StatefulWidget {
//   final bool isImport;
//   final int? presetOrderId;
//   const ScanScreen({super.key, required this.isImport, this.presetOrderId});
//
//   @override
//   State<ScanScreen> createState() => _ScanScreenState();
// }
//
// class _ScanScreenState extends State<ScanScreen> {
//   final MobileScannerController scannerController = MobileScannerController();
//   bool isScanning = true;
//   String? scannedProductId;
//   final TextEditingController productIdController = TextEditingController();
//   int? orderId;
//   int quantity = 1;
//   int? selectedLocationId;
//   String selectedLocationPath = '';
//   String? error;
//   bool submitting = false;
//   bool useManualInput = false; // chuyển sang chế độ nhập tay
//
//   @override
//   void initState() {
//     super.initState();
//     if (widget.presetOrderId != null) {
//       orderId = widget.presetOrderId;
//     }
//   }
//
//   @override
//   void dispose() {
//     scannerController.dispose();
//     productIdController.dispose();
//     super.dispose();
//   }
//
//   void _onScan(BarcodeCapture capture) {
//     if (!isScanning) return;
//     final String? raw = capture.barcodes.first.rawValue;
//     if (raw != null) {
//       setState(() {
//         isScanning = false;
//         scannedProductId = raw;
//         productIdController.text = raw;
//         useManualInput = false;
//       });
//       scannerController.stop();
//     }
//   }
//
//   void _toggleInputMode() {
//     setState(() {
//       useManualInput = !useManualInput;
//       if (useManualInput) {
//         isScanning = false;
//         scannerController.stop();
//       } else {
//         isScanning = true;
//         scannedProductId = null;
//         productIdController.clear();
//         scannerController.start();
//       }
//     });
//   }
//
//   Future<void> _submit() async {
//     final token = Provider.of<AuthProvider>(context, listen: false).token;
//     if (token == null) {
//       setState(() => error = "Chưa đăng nhập");
//       return;
//     }
//
//     String productId = useManualInput
//         ? productIdController.text.trim()
//         : (scannedProductId ?? '');
//     if (productId.isEmpty || orderId == null) {
//       setState(() => error = "Vui lòng nhập/scan Product ID và Mã đơn");
//       return;
//     }
//     if (widget.isImport && selectedLocationId == null) {
//       setState(() => error = "Vui lòng chọn vị trí nhập kho");
//       return;
//     }
//
//     setState(() { submitting = true; error = null; });
//     try {
//       String message;
//       if (widget.isImport) {
//         message = await ScanService.scanImport(
//           importId: orderId!,
//           productId: int.parse(productId),
//           quantity: quantity,
//           token: token,
//         );
//       } else {
//         message = await ScanService.scanExport(
//           exportId: orderId!,
//           productId: int.parse(productId),
//           quantity: quantity,
//           token: token,
//         );
//       }
//       ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
//       Navigator.pop(context, true);
//     } catch (e) {
//       setState(() { error = e.toString(); submitting = false; });
//     }
//   }
//
//   void _pickLocation() async {
//     final token = Provider.of<AuthProvider>(context, listen: false).token;
//     if (token == null) return;
//     await Navigator.push(
//       context,
//       MaterialPageRoute(
//         builder: (_) => LocationPickerScreen(
//           token: token,
//           onSelected: (id, path) {
//             setState(() {
//               selectedLocationId = id;
//               selectedLocationPath = path;
//             });
//           },
//         ),
//       ),
//     );
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text(widget.isImport ? "Nhập kho" : "Xuất kho"),
//         actions: [
//           IconButton(
//             icon: Icon(useManualInput ? Icons.qr_code_scanner : Icons.edit),
//             onPressed: _toggleInputMode,
//             tooltip: useManualInput ? "Chuyển sang quét QR" : "Chuyển sang nhập tay",
//           ),
//         ],
//       ),
//       body: Column(
//         children: [
//           if (!useManualInput && isScanning)
//             SizedBox(
//               height: 300,
//               child: MobileScanner(
//                 controller: scannerController,
//                 onDetect: _onScan,
//               ),
//             )
//           else if (!useManualInput && !isScanning)
//             Card(
//               margin: const EdgeInsets.all(16),
//               child: ListTile(
//                 title: const Text("Sản phẩm đã scan"),
//                 subtitle: Text("Product ID: $scannedProductId"),
//                 trailing: IconButton(
//                   icon: const Icon(Icons.refresh),
//                   onPressed: () {
//                     setState(() {
//                       isScanning = true;
//                       scannedProductId = null;
//                       productIdController.clear();
//                       scannerController.start();
//                     });
//                   },
//                 ),
//               ),
//             ),
//           Padding(
//             padding: const EdgeInsets.all(16),
//             child: Column(
//               children: [
//                 if (useManualInput)
//                   TextField(
//                     controller: productIdController,
//                     keyboardType: TextInputType.number,
//                     decoration: const InputDecoration(labelText: "Product ID (nhập tay)"),
//                   ),
//                 const SizedBox(height: 12),
//                 TextField(
//                   keyboardType: TextInputType.number,
//                   decoration: const InputDecoration(labelText: "Mã đơn hàng (Order ID)"),
//                   onChanged: (v) => orderId = int.tryParse(v),
//                   controller: widget.presetOrderId != null
//                       ? TextEditingController(text: widget.presetOrderId.toString())
//                       : null,
//                   readOnly: widget.presetOrderId != null,
//                 ),
//                 const SizedBox(height: 12),
//                 Row(
//                   children: [
//                     Expanded(
//                       child: TextField(
//                         keyboardType: TextInputType.number,
//                         decoration: const InputDecoration(labelText: "Số lượng"),
//                         onChanged: (v) => quantity = int.tryParse(v) ?? 1,
//                         controller: TextEditingController(text: quantity.toString()),
//                       ),
//                     ),
//                     Column(
//                       children: [
//                         IconButton(
//                           icon: const Icon(Icons.add_circle),
//                           onPressed: () => setState(() => quantity++),
//                         ),
//                         IconButton(
//                           icon: const Icon(Icons.remove_circle),
//                           onPressed: () {
//                             if (quantity > 1) setState(() => quantity--);
//                           },
//                         ),
//                       ],
//                     ),
//                   ],
//                 ),
//                 if (widget.isImport) ...[
//                   const SizedBox(height: 12),
//                   ElevatedButton.icon(
//                     onPressed: _pickLocation,
//                     icon: const Icon(Icons.place),
//                     label: Text(selectedLocationPath.isEmpty ? "Chọn vị trí" : selectedLocationPath),
//                   ),
//                 ],
//                 const SizedBox(height: 24),
//                 if (error != null) Text(error!, style: const TextStyle(color: Colors.red)),
//                 const SizedBox(height: 12),
//                 ElevatedButton(
//                   onPressed: submitting ? null : _submit,
//                   style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50)),
//                   child: submitting ? const CircularProgressIndicator() : const Text("Xác nhận"),
//                 ),
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }

//bản mới
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/scan_service.dart';
import 'location_picker_screen.dart';

class ScanScreen extends StatefulWidget {
  final bool isImport;
  final int? presetOrderId;
  final String? presetOrderCode;
  final int? presetLocationId;
  final String? presetLocationPath;
  const ScanScreen({
    super.key,
    required this.isImport,
    this.presetOrderId,
    this.presetOrderCode,
    this.presetLocationId,
    this.presetLocationPath,
  });

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen> {
  final MobileScannerController scannerController = MobileScannerController();
  bool isScanning = true;
  String? scannedProductId;
  final TextEditingController productIdController = TextEditingController();
  int? orderId;
  int quantity = 1;
  int? selectedLocationId;
  String selectedLocationPath = '';
  String? error;
  bool submitting = false;
  bool useManualInput = false;

  @override
  void initState() {
    super.initState();
    if (widget.presetOrderId != null) {
      orderId = widget.presetOrderId;
    }
    if (widget.presetLocationId != null) {
      selectedLocationId = widget.presetLocationId;
      selectedLocationPath = widget.presetLocationPath ?? '';
    }
  }

  @override
  void dispose() {
    scannerController.dispose();
    productIdController.dispose();
    super.dispose();
  }

  void _onScan(BarcodeCapture capture) {
    if (!isScanning) return;
    final String? raw = capture.barcodes.first.rawValue;
    if (raw != null) {
      setState(() {
        isScanning = false;
        scannedProductId = raw;
        productIdController.text = raw;
        useManualInput = false;
      });
      scannerController.stop();
    }
  }

  void _toggleInputMode() {
    setState(() {
      useManualInput = !useManualInput;
      if (useManualInput) {
        isScanning = false;
        scannerController.stop();
      } else {
        isScanning = true;
        scannedProductId = null;
        productIdController.clear();
        scannerController.start();
      }
    });
  }

  Future<void> _submit() async {
    final token = Provider.of<AuthProvider>(context, listen: false).token;
    if (token == null) {
      setState(() => error = "Chưa đăng nhập");
      return;
    }

    String productId = useManualInput
        ? productIdController.text.trim()
        : (scannedProductId ?? '');
    if (productId.isEmpty || orderId == null) {
      setState(() => error = "Vui lòng nhập/scan Product ID và Mã đơn");
      return;
    }
    if (selectedLocationId == null) {
      setState(() => error = "Vui lòng chọn vị trí kho");
      return;
    }

    setState(() { submitting = true; error = null; });
    try {
      String message;
      if (widget.isImport) {
        message = await ScanService.scanImport(
          importId: orderId!,
          barcode: productId,
          locationId: selectedLocationId!,
          quantity: quantity,
          token: token,
        );
      } else {
        message = await ScanService.scanExport(
          exportId: orderId!,
          barcode: productId,
          locationId: selectedLocationId!,
          quantity: quantity,
          token: token,
        );
      }
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
      Navigator.pop(context, true);
    } catch (e) {
      setState(() { error = e.toString(); submitting = false; });
    }
  }

  void _pickLocation() async {
    final token = Provider.of<AuthProvider>(context, listen: false).token;
    if (token == null) return;
    await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => LocationPickerScreen(
          token: token,
          onSelected: (id, path) {
            setState(() {
              selectedLocationId = id;
              selectedLocationPath = path;
            });
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.isImport ? "Nhập kho" : "Xuất kho"),
        actions: [
          IconButton(
            icon: Icon(useManualInput ? Icons.qr_code_scanner : Icons.edit),
            onPressed: _toggleInputMode,
            tooltip: useManualInput ? "Chuyển sang quét QR" : "Chuyển sang nhập tay",
          ),
        ],
      ),
      body: Column(
        children: [
          if (!useManualInput && isScanning)
            SizedBox(
              height: 300,
              child: MobileScanner(
                controller: scannerController,
                onDetect: _onScan,
              ),
            )
          else if (!useManualInput && !isScanning)
            Card(
              margin: const EdgeInsets.all(16),
              child: ListTile(
                title: const Text("Sản phẩm đã scan"),
                subtitle: Text("Product ID: $scannedProductId"),
                trailing: IconButton(
                  icon: const Icon(Icons.refresh),
                  onPressed: () {
                    setState(() {
                      isScanning = true;
                      scannedProductId = null;
                      productIdController.clear();
                      scannerController.start();
                    });
                  },
                ),
              ),
            ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                if (useManualInput)
                  TextField(
                    controller: productIdController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: "Barcode (nhập tay)"),
                  ),
                const SizedBox(height: 12),
                // Hiển thị mã code nếu có, nếu không thì hiển thị ô nhập ID
                widget.presetOrderId != null && widget.presetOrderCode != null
                    ? TextFormField(
                  initialValue: widget.presetOrderCode,
                  readOnly: true,
                  decoration: const InputDecoration(
                    labelText: "Mã đơn hàng",
                    border: OutlineInputBorder(),
                  ),
                  style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold),
                )
                    : TextField(
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(labelText: "Mã đơn hàng (Order ID)"),
                  onChanged: (v) => orderId = int.tryParse(v),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(labelText: "Số lượng"),
                        onChanged: (v) => quantity = int.tryParse(v) ?? 1,
                        controller: TextEditingController(text: quantity.toString()),
                      ),
                    ),
                    Column(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.add_circle),
                          onPressed: () => setState(() => quantity++),
                        ),
                        IconButton(
                          icon: const Icon(Icons.remove_circle),
                          onPressed: () {
                            if (quantity > 1) setState(() => quantity--);
                          },
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                ElevatedButton.icon(
                  onPressed: widget.presetLocationId != null ? null : _pickLocation,
                  icon: const Icon(Icons.place),
                  label: Text(selectedLocationPath.isEmpty ? "Chọn vị trí" : selectedLocationPath),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: widget.presetLocationId != null ? Colors.grey : null,
                  ),
                ),
                const SizedBox(height: 24),
                if (error != null) Text(error!, style: const TextStyle(color: Colors.red)),
                const SizedBox(height: 12),
                ElevatedButton(
                  onPressed: submitting ? null : _submit,
                  style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50)),
                  child: submitting ? const CircularProgressIndicator() : const Text("Xác nhận"),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}