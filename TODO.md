# TODO - Warehouse Management System

## Tính năng hệ thống Quản lý Kho (Warehouse Management System)

### 1. Backend (Go API)

#### 1.1 Authentication & Authorization
- Đăng nhập với username/email/password
- JWT token authentication
- Phân quyền theo platform (web cho ADMIN, mobile cho STAFF)
- Middleware xác thực JWT
- Seed tài khoản admin mặc định

#### 1.2 User Management (cho Admin)
- Lấy danh sách nhân viên (GET /api/users/staff)
- Tạo tài khoản nhân viên (POST /api/users/staff)
- Cập nhật thông tin nhân viên (PUT /api/users/staff/:id)
- Xóa nhân viên (DELETE /api/users/staff/:id)
- Reset mật khẩu nhân viên (PUT /api/users/staff/:id/reset-password)

#### 1.3 Product Management
- CRUD sản phẩm (GET/POST/PUT/DELETE /api/products)
- Sản phẩm có: Name, SKU, Barcode, RFIDCode, Unit
- Tự động sinh SKU/Barcode, RFIDCode
- Hỗ trợ QR code và Barcode

#### 1.4 Location Management
- Quản lý vị trí kho theo cấu trúc cây (tree structure)
- 3 loại vị trí: WAREHOUSE, SHELF, BIN
- Mỗi vị trí có: Name, Type, ParentID, Capacity
- API lấy cây vị trí (GET /api/locations/tree)
- Tạo vị trí mới (POST /api/locations)

#### 1.5 Inventory Management
- Liệt kê tồn kho với phân trang (GET /api/inventories)
- Lọc theo status (OK, LOW)
- Import sản phẩm vào kho (POST /api/inventories/import)
- Export sản phẩm khỏi kho (POST /api/inventories/export)
- Cập nhật số lượng tối thiểu (PUT /api/inventories/:id/min-quantity)
- Tự động tính status dựa trên quantity vs min_quantity

#### 1.6 Order Management
- Tạo đơn nhập kho (POST /api/orders/import)
- Tạo đơn xuất kho (POST /api/orders/export)
- Lấy danh sách đơn nhập (GET /api/orders/import)
- Lấy danh sách đơn xuất (GET /api/orders/export)
- Lấy đơn nhập theo location (GET /api/orders/import/location/:locationId)
- Lấy đơn xuất theo location (GET /api/orders/export/location/:locationId)
- Tìm đơn nhập theo code (GET /api/orders/import/code/:code)
- Tìm đơn xuất theo code (GET /api/orders/export/code/:code)
- Hủy đơn hàng (PUT /api/orders/import/:id/cancel, PUT /api/orders/export/:id/cancel)
- Duyệt đơn hàng (PUT /api/orders/import/:id/approve, PUT /api/orders/export/:id/approve)
- Xem chi tiết đơn hàng với các items
- Đánh dấu đơn đã xem (POST /api/orders/mark-seen)
- Lấy số lượng đơn chưa xem theo status (GET /api/orders/unseen-counts)

#### 1.7 Scan Management
- Quét barcode sản phẩm để nhập/xuất (POST /api/scan/import, POST /api/scan/export)
- Tìm sản phẩm theo barcode
- Xử lý quét cho import/export với location được chọn
- Theo dõi số lượng đã quét (scanned_quantity)

#### 1.8 Report Management
- Báo cáo nhập/xuất theo ngày (GET /api/reports/import-export)
- Báo cáo tồn kho theo sản phẩm (GET /api/reports/stock)
- Báo cáo top sản phẩm xuất nhiều nhất (GET /api/reports/top-products)

### 2. Frontend Web (React/TypeScript)

#### 2.1 Admin Dashboard
- Thống kê tổng quan (tổng sản phẩm, tổng tồn kho, đơn nhập, đơn xuất)
- Thao tác nhanh đến các trang quản lý
- Sidebar navigation
- Layout hiện đại với dark theme

#### 2.2 Product Management
- Liệt kê sản phẩm với tìm kiếm (theo tên, SKU, Barcode)
- Tạo sản phẩm mới
- Cập nhật sản phẩm
- Xóa sản phẩm
- Hiển thị QR code/Barcode/Mã Vạch cho sản phẩm
- Modal xem QR/Barcode/Mã Vạch

#### 2.3 Inventory Management
- Xem danh sách tồn kho
- Tìm kiếm theo tên sản phẩm, SKU, vị trí
- Phân trang
- Cập nhật số lượng tối thiểu
- Hiển thị status (OK/LOW) với badge
- Thống kê tổng sản phẩm và cảnh báo tồn kho thấp

#### 2.4 Order Management
- Xem danh sách đơn nhập/xuất
- Tạo đơn nhập mới
- Tạo đơn xuất mới
- Xem chi tiết đơn hàng
- Hiển thị status với badge màu sắc
- Sắp xếp theo ngày tạo
- Layout 2 cột song song cho Import/Export

#### 2.5 User Management
- Quản lý nhân viên
- Tạo tài khoản nhân viên với validation
- Cập nhật thông tin nhân viên
- Xóa nhân viên với xác nhận
- Reset mật khẩu nhân viên
- Tìm kiếm nhân viên (username, email)
- Thống kê tổng nhân viên
- Modal UI cho các thao tác

#### 2.6 Location Management
- Xem cây vị trí kho với expand/collapse
- Tạo vị trí mới (Warehouse, Shelf, Bin)
- Chọn parent cho Shelf/Bin
- Layout card ngang cho Warehouses
- Hiển thị sức chứa
- Mở rộng/thu gọn cây con

#### 2.7 Report Management
- Biểu đồ nhập/xuất theo ngày (Line chart)
- Biểu đồ tồn kho theo sản phẩm (Pie chart với custom legend scrollable)
- Biểu đồ top sản phẩm xuất (Bar chart)
- KPI tổng quan (Tổng nhập, Tổng xuất, Tồn kho)
- Tab navigation cho các biểu đồ
- Sắp xếp ngày tăng dần

### 3. App Tablet (Flutter/Dart)

#### 3.1 Authentication
- Đăng nhập với username/password
- Lưu token với Provider
- Auto-login với token đã lưu

#### 3.2 Staff Home Screen
- Hiển thị thông tin nhân viên (username, avatar)
- 4 chức năng nhanh: Quét QR, Nhập Kho, Xuất Kho, Đơn Hàng
- Card UI với icon
- Logout button

#### 3.3 Scan Screen
- Quét Barcode sản phẩm với camera (không còn quét QR vị trí)
- Nhập tay barcode nếu không quét được
- Chuyển đổi giữa chế độ quét và nhập tay
- Chọn đơn hàng (Import/Export) theo mã code
- Chọn vị trí kho (Location Picker) với cấu trúc cây
- Nhập số lượng
- Xác nhận quét
- Hiển thị thông báo thành công/thất bại
- Hỗ trợ preset order code và location từ Order Detail

#### 3.4 Warehouse Picker Screen
- Chọn kho (Warehouse) để làm việc
- Hiển thị danh sách tất cả warehouses
- Card UI với icon warehouse
- Hiển thị path của warehouse
- Navigation đến Warehouse Orders Screen với locationId

#### 3.5 Warehouse Orders Screen
- Tab đơn nhập/xuất cho một warehouse cụ thể
- Lọc theo status (ALL, DONE, PROCESSING, PENDING, CANCELLED, APPROVED)
- Sắp xếp theo ngày
- Card UI cho từng đơn
- Badge status với màu sắc
- Pull-to-refresh
- Navigation đến chi tiết đơn
- **Theo dõi đơn chưa xem** với notification highlighting
- Hiển thị badge đỏ cho status có đơn chưa xem
- Auto-refresh unseen counts mỗi 5 giây
- Đánh dấu đơn đã xem khi chọn status hoặc mở tab
- Hiển thị tên warehouse và path

#### 3.6 Location Picker Screen
- Chọn vị trí từ cây vị trí
- Hiển thị cấu trúc cây (Warehouse > Shelf > Bin)
- ExpansionTile cho các node có con
- ListTile cho node lá với icon check
- Trả về location ID và path đầy đủ

#### 3.7 Import/Export Inventory Screen
- Danh sách đơn nhập/xuất riêng biệt
- Lọc theo status với horizontal scroll
- Sắp xếp theo ngày
- Card UI với icon và badge
- Navigation đến chi tiết đơn
- Refresh sau khi quay lại từ chi tiết

#### 3.8 Order Detail Screen
- Xem chi tiết đơn hàng
- Xem danh sách items với thông tin sản phẩm và vị trí
- Hiển thị số lượng cần và số lượng đã quét (scanned_quantity)
- Icon check/pending cho từng item dựa trên tiến độ quét
- Tap vào item để mở Scan Screen với preset order code và location
- Hủy đơn hàng (nếu chưa DONE)
- Duyệt đơn hàng (nếu PENDING/PROCESSING)
- Hiển thị status và ngày tạo
- Card UI cho items
- Button "QUÉT SẢN PHẨM" hoặc disabled nếu đơn đã hoàn thành/hủy/duyệt

### 4. Database Schema (PostgreSQL)

#### 4.1 Tables
- **users**: ID, Username, Email, Password, Role (ADMIN/STAFF), CreatedAt, UpdatedAt
- **products**: ID, Name, SKU, Barcode, RFIDCode, Unit, CreatedAt, UpdatedAt
- **locations**: ID, Name, Type (WAREHOUSE/SHELF/BIN), ParentID, Capacity, CreatedAt, UpdatedAt
- **inventories**: ID, ProductID, LocationID, Quantity, MinQuantity, CreatedAt, UpdatedAt
- **imports**: ID, Code, Name, UserID, Status (PENDING/APPROVED/PROCESSING/DONE/CANCELLED), CreatedAt, UpdatedAt
- **import_items**: ID, ImportID, ProductID, Quantity, LocationID, ScannedQuantity
- **exports**: ID, Code, Name, UserID, Status (PENDING/APPROVED/PROCESSING/DONE/CANCELLED), CreatedAt, UpdatedAt
- **export_items**: ID, ExportID, ProductID, Quantity, LocationID
- **transactions**: ID, Type (IMPORT/EXPORT), OrderID, ProductID, Quantity, LocationID, UserID, ReferenceID, ReferenceType, CreatedAt
- **order_seen_status**: ID, UserID, OrderID, OrderType (IMPORT/EXPORT), SeenAt, CreatedAt

#### 4.2 Relationships
- Location: Self-referential (ParentID) cho tree structure
- Inventory: N-N relationship giữa Product và Location
- Import/Export: One-to-many với Items
- Transactions: Log tất cả các giao dịch nhập/xuất
- OrderSeenStatus: Tracking đơn hàng chưa xem cho từng user

### 5. Công nghệ sử dụng

#### 5.1 Backend
- Go (Golang)
- Gin Framework (HTTP router)
- GORM (ORM)
- JWT (Authentication)
- PostgreSQL (Database)

#### 5.2 Frontend Web
- React
- TypeScript
- Axios (HTTP client)
- React Router (Navigation)
- Chart.js (Biểu đồ)
- react-chartjs-2 (React wrapper cho Chart.js)
- Context API (State management)

#### 5.3 Mobile App
- Flutter
- Dart
- Provider (State management)
- http (HTTP client)
- flutter_dotenv (Environment variables)
- mobile_scanner (Barcode/QR Scanner integration)
- google_fonts (Typography)
- Quét Barcode sản phẩm (không quét QR vị trí)
- Location Picker với cấu trúc cây
- Warehouse Picker để chọn kho làm việc
- Theo dõi đơn hàng chưa xem với notification
- Có thể xuất apk để chạy trên máy thật


