# Flow Hệ Thống Quản Lý Kho (WareFlow)

## 0. Tài Liệu Cho Sếp Và Khách Hàng (Không Cần Hiểu Code)

### 0.1 Tổng Quan Hệ Thống Bằng Ngôn Ngữ Dễ Hiểu

Hệ thống quản lý kho của chúng tôi có 2 phần chính:

**Phần 1 - Web cho Quản trị viên (Admin)**
- Dùng trên máy tính
- Dành cho người quản lý kho
- Tạo đơn hàng, duyệt đơn, xem báo cáo

**Phần 2 - App điện thoại cho Nhân viên kho (Staff)**
- Dùng trên điện thoại
- Dành cho nhân viên làm việc thực tế tại kho
- Quét mã vạch, thực hiện nhập/xuất hàng

**Cách hoạt động chung:**
1. Admin tạo đơn hàng trên Web
2. Staff nhận thông báo trên điện thoại
3. Staff quét mã vạch sản phẩm để thực hiện
4. Hệ thống tự động kiểm tra và cập nhật
5. Admin duyệt đơn để hoàn tất
6. Tồn kho được cập nhật tự động

---

### 0.2 Luồng Dữ Liệu Nhập Kho - Chi Tiết Các Trường Hợp

#### TRƯỜNG HỢP 1: Nhập kho thành công (Luồng chuẩn)

**Bước 1 - Admin tạo đơn nhập**
- Admin đăng nhập vào Web
- Chọn "Tạo đơn nhập"
- Nhập thông tin: tên đơn, danh sách sản phẩm cần nhập, số lượng, vị trí lưu trữ
- Hệ thống tạo đơn với trạng thái "CHỜ XỬ LÝ" (PENDING)
- Staff nhận thông báo trên điện thoại

**Bước 2 - Staff bắt đầu quét hàng**
- Staff mở app điện thoại
- Chọn đơn nhập cần làm
- Quét mã vạch của sản phẩm đầu tiên
- Hệ thống kiểm tra: mã vạch có đúng không?
  - Nếu đúng: tiếp tục
  - Nếu sai: báo lỗi, yêu cầu quét lại
- Hệ thống cập nhật số lượng đã quét
- Đơn chuyển sang trạng thái "ĐANG XỬ LÝ" (PROCESSING)

**Bước 3 - Staff tiếp tục quét các sản phẩm còn lại**
- Staff quét từng sản phẩm một
- Mỗi lần quét thành công:
  - Hệ thống cộng thêm số lượng đã quét
  - Hiển thị tiến độ (ví dụ: đã quét 5/10 sản phẩm)
- Staff có thể quét nhiều lần cùng một sản phẩm nếu cần

**Bước 4 - Hệ thống tự động hoàn tất khi quét đủ**
- Khi số lượng đã quét = số lượng yêu cầu
- Hệ thống tự động chuyển đơn sang trạng thái "ĐÃ XONG" (DONE)
- Staff thấy thông báo: "Đơn đã hoàn tất, chờ admin duyệt"

**Bước 5 - Admin duyệt đơn**
- Admin Web nhận thông báo đơn đã xong
- Admin kiểm tra lại thông tin
- Nhấn nút "Duyệt đơn"
- Hệ thống:
  - Cộng số lượng vào tồn kho
  - Ghi lại lịch sử giao dịch
  - Chuyển đơn sang trạng thái "ĐÃ DUYỆT" (APPROVED)
- Nhập kho hoàn tất

---

#### TRƯỜNG HỢP 2: Nhập kho - Staff quét sai mã vạch

**Bước 1 - Staff quét mã không tồn tại**
- Staff quét mã vạch
- Hệ thống kiểm tra trong cơ sở dữ liệu
- Không tìm thấy sản phẩm tương ứng
- Hệ thống hiển thị: "Mã vạch không tồn tại trong hệ thống"
- Staff cần:
  - Kiểm tra lại mã vạch
  - Hoặc báo cho Admin thêm sản phẩm mới

**Bước 2 - Staff quét mã không thuộc đơn này**
- Staff quét mã vạch có tồn tại
- Nhưng mã này không nằm trong đơn nhập hiện tại
- Hệ thống hiển thị: "Sản phẩm này không thuộc đơn nhập này"
- Staff cần quét đúng sản phẩm trong đơn

---

#### TRƯỜNG HỢP 3: Nhập kho - Admin hủy đơn

**Tình huống A: Hủy khi đơn đang CHỜ XỬ LÝ**
- Admin quyết định không nhập nữa
- Admin nhấn "Hủy đơn" trên Web
- Hệ thống chuyển đơn sang trạng thái "ĐÃ HỦY" (CANCELLED)
- Staff nhận thông báo: "Đơn đã bị hủy"
- Không có gì thay đổi trong tồn kho

**Tình huống B: Hủy khi đơn đang ĐANG XỬ LÝ**
- Staff đang quét hàng
- Admin quyết định hủy
- Admin nhấn "Hủy đơn"
- Hệ thống chuyển đơn sang "ĐÃ HỦY"
- Staff nhận thông báo ngay lập tức
- Những gì đã quét không được tính vào tồn kho

**Tình huống C: Hủy khi đơn đã ĐÃ XONG**
- Staff đã quét xong, chờ duyệt
- Admin kiểm tra và thấy sai sót
- Admin hủy đơn thay vì duyệt
- Hệ thống chuyển sang "ĐÃ HỦY"
- Tồn kho không thay đổi
- Admin có thể tạo đơn mới để sửa

---

#### TRƯỜNG HỢP 4: Nhập kho - Quét thừa số lượng

**Tình huống: Staff quét nhiều hơn yêu cầu**
- Đơn yêu cầu: 10 cái
- Staff đã quét: 10 cái (đủ)
- Staff vô tình quét thêm cái thứ 11
- Hệ thống hiển thị: "Đã quét đủ số lượng, không thể quét thêm"
- Staff cần dừng quét đơn này

---

### 0.3 Luồng Dữ Liệu Xuất Kho - Chi Tiết Các Trường Hợp

#### TRƯỜNG HỢP 1: Xuất kho thành công (Luồng chuẩn)

**Bước 1 - Admin tạo đơn xuất**
- Admin đăng nhập vào Web
- Chọn "Tạo đơn xuất"
- Nhập thông tin: tên đơn, danh sách sản phẩm cần xuất, số lượng, vị trí lấy hàng
- Hệ thống tạo đơn với trạng thái "CHỜ XỬ LÝ" (PENDING)
- Staff nhận thông báo trên điện thoại

**Bước 2 - Staff bắt đầu quét hàng**
- Staff mở app điện thoại
- Chọn đơn xuất cần làm
- Quét mã vạch của sản phẩm đầu tiên
- Hệ thống kiểm tra:
  1. Mã vạch có đúng không?
  2. Sản phẩm có đủ trong kho không?
- Nếu cả 2 đều OK: tiếp tục
- Nếu không: báo lỗi cụ thể
- Hệ thống cập nhật số lượng đã quét
- Đơn chuyển sang trạng thái "ĐANG XỬ LÝ" (PROCESSING)

**Bước 3 - Staff tiếp tục quét các sản phẩm còn lại**
- Staff quét từng sản phẩm một
- Mỗi lần quét thành công:
  - Hệ thống ghi nhận số lượng đã quét
  - Kiểm tra lại tồn kho thực tế
  - Hiển thị tiến độ
- Staff có thể quét nhiều lần nếu cần

**Bước 4 - Hệ thống tự động hoàn tất khi quét đủ**
- Khi số lượng đã quét = số lượng yêu cầu
- Hệ thống tự động chuyển đơn sang "ĐÃ XONG" (DONE)
- Staff thấy thông báo: "Đơn đã hoàn tất, chờ admin duyệt"

**Bước 5 - Admin duyệt đơn**
- Admin Web nhận thông báo đơn đã xong
- Admin kiểm tra lại thông tin
- Nhấn nút "Duyệt đơn"
- Hệ thống:
  - Trừ số lượng khỏi tồn kho
  - Ghi lại lịch sử giao dịch
  - Chuyển đơn sang "ĐÃ DUYỆT" (APPROVED)
- Xuất kho hoàn tất

---

#### TRƯỜNG HỢP 2: Xuất kho - Không đủ hàng trong kho

**Tình huống: Tồn kho ít hơn yêu cầu**
- Đơn yêu cầu xuất: 20 cái
- Tồn kho thực tế: chỉ có 15 cái
- Staff quét đến cái thứ 16
- Hệ thống kiểm tra và hiển thị: "Không đủ hàng trong kho. Còn 15 cái, yêu cầu 20 cái"
- Staff cần:
  - Báo cho Admin biết
  - Admin có thể:
    - Giảm số lượng trong đơn
    - Hoặc hủy đơn
    - Hoặc chờ nhập thêm hàng trước

---

#### TRƯỜNG HỢP 3: Xuất kho - Staff quét sai mã vạch

**Tình huống A: Quét mã không tồn tại**
- Tương tự nhập kho
- Hệ thống báo: "Mã vạch không tồn tại"

**Tình huống B: Quét mã không thuộc đơn này**
- Tương tự nhập kho
- Hệ thống báo: "Sản phẩm này không thuộc đơn xuất này"

**Tình huống C: Quét mã đúng nhưng sai vị trí**
- Sản phẩm có trong đơn
- Nhưng Staff quét mã từ vị trí khác
- Hệ thống có thể:
  - Chấp nhận (nếu không quan trọng vị trí)
  - Hoặc báo lỗi (nếu cần lấy đúng từ vị trí đã chỉ định)

---

#### TRƯỜNG HỢP 4: Xuất kho - Admin hủy đơn

**Tương tự nhập kho:**
- Có thể hủy ở bất kỳ trạng thái nào
- Nếu hủy sau khi đã duyệt:
  - Hệ thống cần hoàn trả số lượng vào kho
  - Ghi lại lịch sử điều chỉnh

---

### 0.4 Các Tình Huống Đặc Biết Khác

#### Tình huống 1: Một sản phẩm ở nhiều vị trí khác nhau

**Ví dụ:**
- Sản phẩm A có 100 cái
- 50 cái ở vị trí Kệ 1
- 50 cái ở vị trí Kệ 2

**Khi nhập:**
- Admin chỉ định rõ: 30 cái vào Kệ 1, 70 cái vào Kệ 2
- Staff phải quét đúng vị trí khi thực hiện

**Khi xuất:**
- Admin có thể chỉ định: lấy từ Kệ 1
- Hoặc không chỉ định (lấy từ đâu cũng được)
- Hệ thống tự động trừ từ vị trí có hàng

---

#### Tình huống 2: Cùng lúc nhiều đơn hàng

**Ví dụ:**
- Đơn nhập A: 50 cái sản phẩm X
- Đơn nhập B: 30 cái sản phẩm X
- Cả 2 đơn đều đang chờ xử lý

**Cách xử lý:**
- Staff có thể chọn làm đơn nào trước
- Hệ thống ghi nhận riêng từng đơn
- Tồn kho chỉ cập nhật khi đơn được duyệt
- Không bị xung đột dữ liệu

---

#### Tình huống 3: Staff làm việc ở nhiều vị trí kho

**Ví dụ:**
- Kho có 2 khu vực: Khu A và Khu B
- Staff 1 làm ở Khu A
- Staff 2 làm ở Khu B

**Cách xử lý:**
- Admin có thể gán đơn theo khu vực
- Hoặc Staff tự chọn đơn theo vị trí mình làm việc
- Hệ thống cho phép lọc đơn theo vị trí
- Mỗi staff thấy đơn của mình cần làm

---

#### Tình huống 4: Sản phẩm có mã vạch và RFID

**Ví dụ:**
- Sản phẩm có cả mã vạch và chip RFID
- Có thể quét bằng 2 cách

**Cách xử lý:**
- Hệ thống chấp nhận cả 2 loại mã
- Staff có thể dùng máy quét mã vạch hoặc máy đọc RFID
- Hệ thống tự động nhận biết loại mã
- Cập nhật như nhau

---

#### Tình huống 5: Cảnh báo hàng sắp hết

**Cách hoạt động:**
- Admin đặt mức tối thiểu cho mỗi sản phẩm (ví dụ: 10 cái)
- Khi tồn kho xuống dưới mức này:
  - Hệ thống tự động cảnh báo
  - Admin thấy danh sách "Hàng thấp"
  - Admin có thể tạo đơn nhập ngay

**Lợi ích:**
- Không bị thiếu hàng khi cần xuất
- Chủ động nhập hàng trước khi hết

---

### 0.5 Báo Cáo Và Thống Kê

#### Báo cáo Admin có thể xem:

**1. Báo cáo tồn kho hiện tại**
- Danh sách tất cả sản phẩm
- Số lượng từng sản phẩm
- Vị trí lưu trữ
- Sản phẩm nào đang thấp (dưới mức tối thiểu)

**2. Báo cáo nhập kho**
- Tổng số lượng đã nhập trong tháng/quý/năm
- Danh sách các đơn nhập
- Sản phẩm nào nhập nhiều nhất
- Nhân viên nào làm nhiều nhất

**3. Báo cáo xuất kho**
- Tổng số lượng đã xuất
- Danh sách các đơn xuất
- Sản phẩm nào xuất nhiều nhất
- Xuất cho đối tượng nào (nếu có)

**4. Báo cáo lịch sử giao dịch**
- Chi tiết từng lần nhập/xuất
- Ai làm, khi nào, làm gì
- Dễ dàng tra cứu khi cần

---

### 0.6 Quy Trình Khi Có Vấn Đề

#### Vấn đề 1: Tồn kho không khớp thực tế

**Nguyên nhân có thể:**
- Nhập/xuất không quét đúng
- Hàng hỏng/mất
- Sai sót khi đếm

**Cách xử lý:**
- Admin kiểm tra lại lịch sử giao dịch
- So sánh với thực tế
- Điều chỉnh tồn kho (nếu có quyền)
- Ghi lại lý do điều chỉnh

---

#### Vấn đề 2: Không tìm thấy sản phẩm khi quét

**Cách xử lý:**
- Kiểm tra lại mã vạch
- Nếu mã đúng nhưng không có trong hệ thống:
  - Admin thêm sản phẩm mới
  - Gán mã vạch cho sản phẩm
- Nếu mã bị lỗi:
  - In lại mã vạch mới
  - Cập nhật trong hệ thống

---

#### Vấn đề 3: App không kết nối được

**Cách xử lý:**
- Kiểm tra kết nối internet
- Nếu mất kết nối:
  - App có thể lưu dữ liệu tạm
  - Khi có mạng lại sẽ đồng bộ
- Admin có thể làm việc trên Web bình thường

---

### 0.7 Lợi Ích Của Hệ Thống

**Cho Quản trị viên (Admin):**
1. **Kiểm soát tốt hơn:** Biết chính xác có bao nhiêu hàng trong kho
2. **Tiết kiệm thời gian:** Không cần đếm thủ công
3. **Giảm sai sót:** Quét mã vạch chính xác hơn nhập tay
4. **Báo cáo tự động:** Xem thống kê bất cứ lúc nào
5. **Lịch sử đầy đủ:** Biết ai làm gì, khi nào

**Cho Nhân viên kho (Staff):**
1. **Làm việc nhanh:** Quét mã thay vì viết tay
2. **Ít sai sót:** Hệ thống kiểm tra lỗi
3. **Rõ ràng:** Biết mình cần làm gì
4. **Tiện lợi:** Dùng điện thoại, di chuyển dễ

**Cho Doanh nghiệp:**
1. **Tối ưu tồn kho:** Biết khi nào cần nhập hàng
2. **Giảm thất thoát:** Theo dõi chặt chẽ từng sản phẩm
3. **Tăng năng suất:** Làm việc nhanh hơn
4. **Dữ liệu chính xác:** Ra quyết định dựa trên số liệu thực

---

## 1. Kiến Trúc Tổng Quan

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web Admin<br/>React/TypeScript<br/>Quản trị viên]
        MOBILE[Mobile App<br/>Flutter<br/>Nhân viên kho]
    end
    
    subgraph "API Layer"
        API[Backend API<br/>Go + Gin Framework<br/>REST API]
        AUTH[Authentication<br/>JWT Token]
    end
    
    subgraph "Data Layer"
        DB[(PostgreSQL Database)]
    end
    
    WEB -->|HTTPS| API
    MOBILE -->|HTTPS| API
    API --> AUTH
    API --> DB
    
    style WEB fill:#e1f5ff
    style MOBILE fill:#fff4e1
    style API fill:#e8f5e9
    style DB fill:#f3e5f5
```

---

## 2. Luồng Đăng Nhập (Authentication)

```mermaid
sequenceDiagram
    participant Admin as Admin (Web)
    participant Staff as Staff (Mobile)
    participant API as Backend API
    participant DB as Database
    
    Note over Admin,Staff: Đăng Nhập
    Admin->>API: POST /auth/login<br/>{username, email, password, platform: "web"}
    Staff->>API: POST /auth/login<br/>{username, email, password, platform: "mobile"}
    
    API->>DB: Kiểm tra user
    DB-->>API: User info
    
    alt Platform = Web
        API->>API: Kiểm tra role = ADMIN
    else Platform = Mobile
        API->>API: Kiểm tra role = STAFF
    end
    
    API->>API: Verify password
    API->>API: Generate JWT Token
    API-->>Admin: Token + User Info
    API-->>Staff: Token + User Info
```

---

## 3. Luồng Nhập Kho (Import Flow)

```mermaid
flowchart TD
    START([Bắt đầu]) --> ADMIN_CREATE[Admin tạo đơn nhập<br/>Web: POST /orders/import]
    ADMIN_CREATE --> PENDING[Trạng thái: PENDING]
    
    PENDING --> STAFF_SCAN[Staff quét barcode<br/>Mobile: POST /scan/import]
    STAFF_SCAN --> CHECK_BARCODE{Barcode hợp lệ?}
    
    CHECK_BARCODE -->|Không| ERROR1[Thông báo lỗi]
    CHECK_BARCODE -->|Có| UPDATE_SCANNED[Cập nhật scanned_quantity]
    
    UPDATE_SCANNED --> CHECK_STATUS{Trạng thái?}
    CHECK_STATUS -->|PENDING| PROCESSING[Trạng thái: PROCESSING<br/>Lần quét đầu tiên]
    CHECK_STATUS -->|PROCESSING| CHECK_COMPLETE{Đã quét xong?}
    PROCESSING --> CHECK_COMPLETE
    
    CHECK_COMPLETE -->|Chưa| STAFF_SCAN
    CHECK_COMPLETE -->|Rồi| DONE[Trạng thái: DONE<br/>Tự động khi quét đủ]
    
    DONE --> ADMIN_APPROVE{Admin duyệt?}
    ADMIN_APPROVE -->|Có| APPROVED[Trạng thái: APPROVED<br/>Web: POST /orders/import/:id/approve]
    ADMIN_APPROVE -->|Không| CANCEL1[Hủy đơn]
    
    APPROVED --> UPDATE_INVENTORY[Cập nhật tồn kho<br/>Inventory + Quantity]
    UPDATE_INVENTORY --> END([Kết thúc])
    
    PENDING --> CANCEL2{Hủy đơn?}
    CANCEL2 -->|Có| CANCEL1
    CANCEL2 -->|Không| STAFF_SCAN
    
    CANCEL1 --> END
    ERROR1 --> STAFF_SCAN
    
    style ADMIN_CREATE fill:#e1f5ff
    style STAFF_SCAN fill:#fff4e1
    style PROCESSING fill:#fff9c4
    style DONE fill:#c8e6c9
    style APPROVED fill:#4caf50
    style CANCEL1 fill:#ffcdd2
    style ERROR1 fill:#ffcdd2
```

---

## 4. Luồng Xuất Kho (Export Flow)

```mermaid
flowchart TD
    START([Bắt đầu]) --> ADMIN_CREATE[Admin tạo đơn xuất<br/>Web: POST /orders/export]
    ADMIN_CREATE --> PENDING[Trạng thái: PENDING]
    
    PENDING --> STAFF_SCAN[Staff quét barcode<br/>Mobile: POST /scan/export]
    STAFF_SCAN --> CHECK_BARCODE{Barcode hợp lệ?}
    
    CHECK_BARCODE -->|Không| ERROR1[Thông báo lỗi]
    CHECK_BARCODE -->|Có| CHECK_STOCK{Đủ tồn kho?}
    
    CHECK_STOCK -->|Không| ERROR2[Thông báo không đủ hàng]
    CHECK_STOCK -->|Có| UPDATE_SCANNED[Cập nhật scanned_quantity]
    
    UPDATE_SCANNED --> CHECK_STATUS{Trạng thái?}
    CHECK_STATUS -->|PENDING| PROCESSING[Trạng thái: PROCESSING<br/>Lần quét đầu tiên]
    CHECK_STATUS -->|PROCESSING| CHECK_COMPLETE{Đã quét xong?}
    PROCESSING --> CHECK_COMPLETE
    
    CHECK_COMPLETE -->|Chưa| STAFF_SCAN
    CHECK_COMPLETE -->|Rồi| DONE[Trạng thái: DONE<br/>Tự động khi quét đủ]
    
    DONE --> ADMIN_APPROVE{Admin duyệt?}
    ADMIN_APPROVE -->|Có| APPROVED[Trạng thái: APPROVED<br/>Web: POST /orders/export/:id/approve]
    ADMIN_APPROVE -->|Không| CANCEL1[Hủy đơn]
    
    APPROVED --> UPDATE_INVENTORY[Giảm tồn kho<br/>Inventory - Quantity]
    UPDATE_INVENTORY --> END([Kết thúc])
    
    PENDING --> CANCEL2{Hủy đơn?}
    CANCEL2 -->|Có| CANCEL1
    CANCEL2 -->|Không| STAFF_SCAN
    
    CANCEL1 --> END
    ERROR1 --> STAFF_SCAN
    ERROR2 --> STAFF_SCAN
    
    style ADMIN_CREATE fill:#e1f5ff
    style STAFF_SCAN fill:#fff4e1
    style PROCESSING fill:#fff9c4
    style DONE fill:#c8e6c9
    style APPROVED fill:#4caf50
    style CANCEL1 fill:#ffcdd2
    style ERROR1 fill:#ffcdd2
    style ERROR2 fill:#ffcdd2
```

---

## 5. Cấu Trúc Database

```mermaid
erDiagram
    USERS ||--o{ IMPORTS : "tạo đơn"
    USERS ||--o{ EXPORTS : "tạo đơn"
    USERS ||--o{ TRANSACTIONS : "thực hiện"
    USERS ||--o{ ORDER_SEEN_STATUS : "xem đơn"

    PRODUCTS ||--o{ INVENTORIES : "lưu tại"
    PRODUCTS ||--o{ IMPORT_ITEMS : "được nhập"
    PRODUCTS ||--o{ EXPORT_ITEMS : "được xuất"
    PRODUCTS ||--o{ TRANSACTIONS : "di chuyển"

    LOCATIONS ||--o{ INVENTORIES : "chứa"
    LOCATIONS ||--o{ IMPORT_ITEMS : "nhập vào"
    LOCATIONS ||--o{ EXPORT_ITEMS : "xuất từ"
    LOCATIONS ||--o{ TRANSACTIONS : "tại vị trí"
    LOCATIONS ||--o{ LOCATIONS : "cha-con"

    IMPORTS ||--o{ IMPORT_ITEMS : "chứa"
    IMPORTS ||--o{ TRANSACTIONS : "tạo giao dịch"
    IMPORTS ||--o{ ORDER_SEEN_STATUS : "được xem"

    EXPORTS ||--o{ EXPORT_ITEMS : "chứa"
    EXPORTS ||--o{ TRANSACTIONS : "tạo giao dịch"
    EXPORTS ||--o{ ORDER_SEEN_STATUS : "được xem"

    USERS {
        uint id PK
        string username UK
        string email UK
        string password
        string role "ADMIN/STAFF"
        timestamp created_at
        timestamp updated_at
    }

    PRODUCTS {
        uint id PK
        string name
        string sku UK
        string barcode
        string rfid_code
        string unit
        timestamp created_at
        timestamp updated_at
    }

    LOCATIONS {
        uint id PK
        string name
        uint parent_id FK
        string type "WAREHOUSE/SHELF/BIN"
        int capacity
        timestamp created_at
    }

    INVENTORIES {
        uint id PK
        uint product_id FK
        uint location_id FK
        int quantity
        int min_quantity
        timestamp created_at
        timestamp updated_at
        UK "product_id + location_id"
    }

    IMPORTS {
        uint id PK
        string code UK
        string name
        uint user_id FK
        string status "PENDING/APPROVED/PROCESSING/DONE/CANCELLED"
        timestamp created_at
        timestamp updated_at
    }

    IMPORT_ITEMS {
        uint id PK
        uint import_id FK
        uint product_id FK
        uint location_id FK
        int quantity
        int scanned_quantity
        UK "import_id + product_id + location_id"
    }

    EXPORTS {
        uint id PK
        string code UK
        string name
        uint user_id FK
        string status "PENDING/APPROVED/PROCESSING/DONE/CANCELLED"
        timestamp created_at
        timestamp updated_at
    }

    EXPORT_ITEMS {
        uint id PK
        uint export_id FK
        uint product_id FK
        uint location_id FK
        int quantity
        UK "export_id + product_id + location_id"
    }

    TRANSACTIONS {
        uint id PK
        uint product_id FK
        uint location_id FK
        string type "IMPORT/EXPORT"
        int quantity
        uint user_id FK
        uint reference_id
        string reference_type "IMPORT/EXPORT"
        timestamp created_at
    }

    ORDER_SEEN_STATUS {
        uint id PK
        uint user_id FK
        uint order_id
        string order_type "IMPORT/EXPORT"
        timestamp seen_at
        timestamp created_at
    }
```

---

## 6. Chức Năng Chính Theo Vai Trò

### Admin (Web Interface)
```mermaid
mindmap
  root((Admin Web))
    Quản lý User
      Xem danh sách Staff
      Tạo tài khoản Staff
      Sửa thông tin Staff
      Xóa tài khoản Staff
      Reset password Staff
    Quản lý Sản phẩm
      Xem danh sách sản phẩm
      Thêm sản phẩm mới
      Sửa thông tin sản phẩm
      Xóa sản phẩm
      Quản lý Barcode/RFID
    Quản lý Vị trí
      Xem danh sách vị trí
      Thêm vị trí mới
      Xem cây cấu trúc kho
    Quản lý Tồn kho
      Xem danh sách tồn kho
      Cập nhật min quantity
      Lọc theo sản phẩm/vị trí
      Xem hàng thấp (low stock)
    Quản lý Đơn hàng
      Tạo đơn nhập
      Tạo đơn xuất
      Xem danh sách đơn nhập
      Xem danh sách đơn xuất
      Duyệt đơn (chuyển DONE → APPROVED)
      Hủy đơn
      Xem đơn theo vị trí
    Báo cáo
      Báo cáo xuất nhập
      Báo cáo tồn kho
      Top sản phẩm
      Top sản phẩm nhập
```

### Staff (Mobile App)
```mermaid
mindmap
  root((Staff Mobile))
    Đăng nhập
      Xác thực (username + email + password)
    Thông tin cá nhân
      Xem thông tin user
    Xem đơn hàng
      Danh sách đơn nhập
      Danh sách đơn xuất
      Chi tiết đơn
      Đánh dấu đã xem
      Xem số lượng đơn chưa xem
      Xem đơn theo vị trí
    Quét hàng
      Quét Barcode nhập kho
      Quét Barcode xuất kho
      Cập nhật số lượng quét
      Kiểm tra tồn kho (xuất)
    Xem tồn kho
      Danh sách tồn kho
      Lọc theo sản phẩm
      Lọc theo vị trí
      Xem hàng thấp
    Xem vị trí
      Danh sách vị trí
      Cấu trúc cây kho
    Xem sản phẩm
      Danh sách sản phẩm
      Thông tin Barcode/RFID
    Báo cáo
      Báo cáo xuất nhập
      Báo cáo tồn kho
```

---

## 7. Luồng Dữ Liệu Thực Tế

```mermaid
sequenceDiagram
    participant Admin as Admin (Web)
    participant API as Backend API
    participant Staff as Staff (Mobile)
    participant DB as Database
    
    Note over Admin: 1. Tạo đơn nhập
    Admin->>API: POST /orders/import<br/>{name, items: [{product_id, location_id, quantity}]}
    API->>DB: Tạo Import + Import Items
    DB-->>API: OK
    API-->>Admin: Import created (PENDING)
    
    Note over Staff: 2. Staff nhận thông báo
    Staff->>API: GET /orders/unseen-counts
    API-->>Staff: {import_total: 1}
    
    Note over Staff: 3. Staff quét hàng lần đầu
    Staff->>API: POST /scan/import<br/>{import_id, barcode, location_id, quantity}
    API->>DB: Tìm product theo barcode
    API->>DB: Cập nhật scanned_quantity
    API->>DB: Update status = PROCESSING
    DB-->>API: OK
    API-->>Staff: Scan success
    
    Note over Staff: 4. Staff tiếp tục quét
    Staff->>API: POST /scan/import<br/>{import_id, barcode, location_id, quantity}
    API->>DB: Cập nhật scanned_quantity
    DB-->>API: OK
    API-->>Staff: Scan success
    
    Note over Staff: 5. Quét đủ tất cả → DONE
    Staff->>API: POST /scan/import<br/>{import_id, barcode, location_id, quantity}
    API->>DB: Cập nhật scanned_quantity cuối
    API->>DB: Kiểm tra tất cả đã quét đủ
    API->>DB: Update status = DONE
    DB-->>API: OK
    API-->>Staff: Scan success (Order DONE)
    
    Note over Admin: 6. Admin duyệt đơn
    Admin->>API: POST /orders/import/:id/approve
    API->>DB: Kiểm tra status = DONE
    API->>DB: Update status = APPROVED
    API->>DB: Update Inventory (+quantity)
    DB-->>API: OK
    API-->>Admin: Approved
    
    Note over Admin: 7. Admin xem báo cáo
    Admin->>API: GET /admin/reports/inventory
    API->>DB: Query inventories
    DB-->>API: Data
    API-->>Admin: Inventory report
```

---

## 8. Trạng Thái Đơn Hàng

```mermaid
stateDiagram-v2
    [*] --> PENDING: Tạo đơn
    PENDING --> PROCESSING: Staff quét lần đầu
    PENDING --> CANCELLED: Hủy đơn
    
    PROCESSING --> DONE: Quét đủ tất cả
    PROCESSING --> CANCELLED: Hủy đơn
    
    DONE --> APPROVED: Admin duyệt
    DONE --> CANCELLED: Hủy đơn
    
    APPROVED --> [*]
    CANCELLED --> [*]
    
    note right of PENDING
        Đơn mới tạo
        Chờ staff quét
    end note
    
    note right of PROCESSING
        Đang quét
        Cập nhật scanned_quantity
    end note
    
    note right of DONE
        Đã quét đủ
        Chờ admin duyệt để cập nhật tồn kho
    end note
    
    note right of APPROVED
        Đã duyệt
        Đã cập nhật tồn kho
    end note
```

---

## 9. Tóm Tắt Quy Trình Cho Khách Hàng

### Quy trình Nhập kho
1. **Admin** tạo đơn nhập trên Web (PENDING)
2. **Staff** nhận thông báo trên Mobile
3. **Staff** quét barcode từng sản phẩm (PROCESSING)
4. **Hệ thống** tự động chuyển sang DONE khi quét đủ
5. **Admin** duyệt đơn để cập nhật tồn kho (APPROVED)
6. **Admin** xem báo cáo nhập kho

### Quy trình Xuất kho
1. **Admin** tạo đơn xuất trên Web (PENDING)
2. **Staff** nhận thông báo trên Mobile
3. **Staff** quét barcode từng sản phẩm (PROCESSING)
4. **Hệ thống** kiểm tra đủ hàng và tự động chuyển sang DONE khi quét đủ
5. **Admin** duyệt đơn để giảm tồn kho (APPROVED)
6. **Admin** xem báo cáo xuất kho

### Lợi ích
- ✅ **Theo dõi thời gian thực**: Tồn kho luôn cập nhật
- ✅ **Giảm sai sót**: Quét barcode thay vì nhập thủ công
- ✅ **Phân quyền rõ ràng**: Admin quản lý, Staff thực hiện
- ✅ **Lịch sử đầy đủ**: Mọi giao dịch đều được ghi log
- ✅ **Báo cáo tự động**: Dễ dàng xem thống kê
