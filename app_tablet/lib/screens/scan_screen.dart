import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/scan_service.dart';
import '../services/order_service.dart';
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
  final TextEditingController orderCodeController = TextEditingController();
  int? orderId;
  String? orderCode;
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
      orderCode = widget.presetOrderCode;
      orderCodeController.text = widget.presetOrderCode ?? '';
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
    orderCodeController.dispose();
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
    
    // If orderId is not preset, try to get it from orderCode
    if (orderId == null && orderCode != null && orderCode!.isNotEmpty) {
      setState(() { submitting = true; error = null; });
      try {
        int? foundId;
        if (widget.isImport) {
          foundId = await OrderService.getImportIdByCode(orderCode!, token);
        } else {
          foundId = await OrderService.getExportIdByCode(orderCode!, token);
        }
        if (foundId != null) {
          orderId = foundId;
        } else {
          setState(() { 
            error = "Không tìm thấy mã đơn: $orderCode"; 
            submitting = false; 
          });
          return;
        }
      } catch (e) {
        setState(() { 
          error = "Lỗi tìm mã đơn: $e"; 
          submitting = false; 
        });
        return;
      }
    }

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
      // Return true to indicate successful scan, so parent can refresh
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
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;
    final isSmallScreen = screenWidth < 600;
    
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
      body: SingleChildScrollView(
        child: Column(
          children: [
            if (!useManualInput && isScanning)
              SizedBox(
                height: screenHeight * 0.35,
                child: MobileScanner(
                  controller: scannerController,
                  onDetect: _onScan,
                ),
              )
            else if (!useManualInput && !isScanning)
              Card(
                margin: EdgeInsets.all(isSmallScreen ? 12 : 16),
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
              padding: EdgeInsets.all(isSmallScreen ? 12 : 16),
              child: Column(
                children: [
                  if (useManualInput)
                    TextField(
                      controller: productIdController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: "Barcode (nhập tay)"),
                    ),
                  SizedBox(height: isSmallScreen ? 10 : 12),
                  // Hiển thị mã code nếu có preset, nếu không thì hiển thị ô nhập code
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
                    controller: orderCodeController,
                    keyboardType: TextInputType.text,
                    textCapitalization: TextCapitalization.characters,
                    decoration: const InputDecoration(
                      labelText: "Mã đơn hàng (ví dụ: IMP001, EXP002)",
                      border: OutlineInputBorder(),
                    ),
                    style: const TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.bold),
                    onChanged: (v) {
                      orderCode = v.trim().toUpperCase();
                    },
                  ),
                  SizedBox(height: isSmallScreen ? 10 : 12),
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
                  SizedBox(height: isSmallScreen ? 10 : 12),
                  ElevatedButton.icon(
                    onPressed: widget.presetLocationId != null ? null : _pickLocation,
                    icon: const Icon(Icons.place),
                    label: Text(selectedLocationPath.isEmpty ? "Chọn vị trí" : selectedLocationPath),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: widget.presetLocationId != null ? Colors.grey : null,
                    ),
                  ),
                  SizedBox(height: isSmallScreen ? 20 : 24),
                  if (error != null) Text(error!, style: const TextStyle(color: Colors.red)),
                  SizedBox(height: isSmallScreen ? 10 : 12),
                  ElevatedButton(
                    onPressed: submitting ? null : _submit,
                    style: ElevatedButton.styleFrom(minimumSize: Size(double.infinity, isSmallScreen ? 45 : 50)),
                    child: submitting ? const CircularProgressIndicator() : const Text("Xác nhận"),
                  ),
                  SizedBox(height: isSmallScreen ? 20 : 24),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}