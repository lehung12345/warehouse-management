# Flow Hệ Thống Quản Lý Kho (WareFlow)

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
