# quan_ly_kho_3

## Yêu cầu chung

Thiết kế 1 hệ thống Quản lý kho gồm các tính năng sau:

- Xuất/Nhập kho (theo đơn hàng, theo sản phẩm, …)
- Quản lý vị trí (vật tư nào nằm ở đâu)
- Tồn kho (có cảnh báo nếu đạt giới hạn)
- Lập biểu đồ, đồ thị so sánh

### Công cụ lập trình

- Backend: golang
- FE: vite
- Database: postgresql v17

Phần cứng cung cấp:

- 01 súng quét QR code và đọc HF RFID (được cung cấp khi làm đến phần này)

#### Chú ý:
- Project cần phải có file README viết rõ ràng:
  + Sử dụng thư viện gì
  + Sử dụng phiên bản bao nhiêu
  + Hướng dẫn cách chạy code

### Yêu cầu đầu ra

- 01 sản phẩm hoàn thiện có thể service trên Windows hoặc Linux (ubuntu 24.04)
- 01 app có thể cài trên Máy tính bảng (android)

---

### Yêu cầu cần làm

1. Viết chi tiết luồng dữ liệu và phân tách các trường hợp trước khi bắt đầu triển khai thực tế
2. Viết lại các tính năng của phần mềm vào thẻ này

## Hướng dẫn
```
cd existing_repo
git remote add origin https://git.vnatechlab.com/thuc_tap_sinh/software/quan_ly_kho_3.git
git branch -M main
git push -uf origin main
```