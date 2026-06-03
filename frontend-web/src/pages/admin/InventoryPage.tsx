// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../api/auth";

// export default function InventoryPage() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [data, setData] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   const fetchData = async () => {
//     try {
//       const res = await api.get("/api/inventories");
//       setData(res.data || []);
//     } catch (err) {
//       console.error("Lỗi khi tải dữ liệu tồn kho:", err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate("/login", { replace: true });
//   };

//   // Hàm helper lấy ký tự đầu làm Avatar tròn giống các trang khác
//   const getAvatarChar = (name: string) => {
//     if (!name) return "A";
//     const parts = name.trim().split(" ");
//     return parts[parts.length - 1].charAt(0).toUpperCase();
//   };

//   // Lọc dữ liệu theo từ khóa tìm kiếm (SKU hoặc Tên sản phẩm hoặc Vị trí)
//   const filteredData = data.filter((item) => {
//     const term = searchTerm.toLowerCase();
//     return (
//       item.product?.toLowerCase().includes(term) ||
//       item.sku?.toLowerCase().includes(term) ||
//       item.location?.toLowerCase().includes(term)
//     );
//   });

//   // Thống kê nhanh để hiển thị lên thẻ Badge phía trên
//   const totalProductsWithStock = data.filter(item => item.quantity > 0).length;
//   const lowStockCount = data.filter(item => item.status === "LOW").length;

//   return (
//     <div className="dashboard-root">
      
//       {/* ── SIDEBAR CHUẨN ĐỒNG BỘ ──────────────────────────────── */}
//       <aside className="sidebar">
//         <div className="sidebar-brand" onClick={() => navigate("/admin")}>
//           <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
//             <rect width="48" height="48" rx="12" fill="url(#sideGrad)" />
//             <path d="M10 18L24 10L38 18V30L24 38L10 30V18Z" stroke="white" strokeWidth="2.5" fill="none" />
//             <defs>
//               <linearGradient id="sideGrad" x1="0" y1="0" x2="48" y2="48">
//                 <stop stopColor="#6366F1" />
//                 <stop offset="1" stopColor="#8B5CF6" />
//               </linearGradient>
//             </defs>
//           </svg>
//           <span>WareFlow</span>
//         </div>

//         <nav className="sidebar-nav">
//           <div className="nav-section-title">QUẢN LÝ</div>
//           <button className="nav-item" onClick={() => navigate("/admin")}>
//             <span className="nav-icon">📊</span> Dashboard
//           </button>
//           <button className="nav-item" onClick={() => navigate("/admin/products")}>
//             <span className="nav-icon">📦</span> Sản phẩm
//           </button>
//           <button className="nav-item" onClick={() => navigate("/admin/users")}>
//             <span className="nav-icon">👥</span> Nhân viên
//           </button>
//           <button className="nav-item active" onClick={() => navigate("/admin/inventory")}>
//             <span className="nav-icon">📁</span> Tồn kho
//           </button>
//         </nav>

//         {/* User Card góc dưới chuẩn chỉnh */}
//         <div className="sidebar-user-card">
//           <div className="user-avatar-circle">
//             {getAvatarChar(user?.username || "Admin")}
//           </div>
//           <div className="user-info-meta">
//             <span className="user-display-name">{user?.username || "Nguyễn Huy An"}</span>
//             <span className="user-role-badge">ADMIN</span>
//           </div>
//         </div>

//         <button className="logout-button-sidebar" onClick={handleLogout}>
//           <span className="logout-icon-sub">↩</span> Đăng xuất
//         </button>
//       </aside>

//       {/* ── MAIN CONTENT ──────────────────────────────────────── */}
//       <main className="dashboard-main">
        
//         {/* Header trang */}
//         <div className="page-header-container">
//           <div className="header-titles">
//             <h1 className="page-main-title">🏢 Tồn kho</h1>
//             <p className="page-sub-title">Thống kê tồn kho chi tiết & Vị trí các sản phẩm trong hệ thống</p>
//           </div>
//         </div>

//         {/* Thẻ thống kê nhanh (Mini Badges) */}
//         <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
//           <div style={{
//             background: 'rgba(255,255,255,0.03)',
//             border: '1px solid var(--border)',
//             padding: '8px 16px',
//             borderRadius: '20px',
//             fontSize: '14px',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             color: 'var(--text-secondary)'
//           }}>
//             <span style={{ fontSize: '16px' }}>👥</span> Tổng sản phẩm (có tồn): <strong style={{ color: 'var(--text-primary)' }}>{totalProductsWithStock}</strong>
//           </div>
//           <div style={{
//             background: 'rgba(239, 68, 68, 0.05)',
//             border: '1px solid rgba(239, 68, 68, 0.15)',
//             padding: '8px 16px',
//             borderRadius: '20px',
//             fontSize: '14px',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             color: '#EF4444'
//           }}>
//             <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }}></span>
//             Trạng thái thấp: <strong>{lowStockCount}</strong>
//           </div>
//         </div>

//         {/* Thanh tìm kiếm */}
//         <div className="search-bar-wrapper" style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
//           <div style={{ position: 'relative', flex: 1 }}>
//             <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>🔍</span>
//             <input 
//               type="text" 
//               placeholder="Tìm sản phẩm theo SKU hoặc vị trí kho..." 
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               style={{
//                 width: '100%',
//                 padding: '12px 16px 12px 40px',
//                 background: 'var(--bg-overlay)',
//                 border: '1px solid var(--border)',
//                 borderRadius: '10px',
//                 color: 'var(--text-primary)',
//                 fontSize: '14px',
//                 outline: 'none'
//               }}
//             />
//           </div>
//           {searchTerm && (
//             <button 
//               onClick={() => setSearchTerm("")}
//               style={{
//                 padding: '0 16px',
//                 background: 'var(--border)',
//                 border: '1px solid var(--border)',
//                 borderRadius: '10px',
//                 color: 'var(--text-secondary)',
//                 cursor: 'pointer',
//                 fontSize: '13px'
//               }}
//             >
//               ✕ Xóa lọc
//             </button>
//           )}
//         </div>

//         {/* Bảng dữ liệu hiện đại */}
//         <div className="data-card-table-wrapper">
//           <div className="table-responsive">
//             <table className="modern-data-table">
//               <thead>
//                 <tr>
//                   <th style={{ width: '60px', textAlign: 'center' }}>#</th>
//                   <th>SẢN PHẨM</th>
//                   <th>SKU</th>
//                   <th>SỐ LƯỢNG</th>
//                   <th>VỊ TRÍ (KHO &gt; KỆ &gt; Ô TẦNG)</th>
//                   <th style={{ textAlign: 'center' }}>TRẠNG THÁI</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredData.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
//                       Không tìm thấy dữ liệu tồn kho phù hợp.
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredData.map((item, idx) => (
//                     <tr key={idx}>
//                       <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{idx + 1}</td>
//                       <td>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                           <div style={{
//                             width: '32px',
//                             height: '32px',
//                             borderRadius: '50%',
//                             background: '#6366F1',
//                             color: 'var(--text-primary)',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             fontWeight: 600,
//                             fontSize: '13px'
//                           }}>
//                             {getAvatarChar(item.product)}
//                           </div>
//                           <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.product}</span>
//                         </div>
//                       </td>
//                       <td>
//                         <span style={{ 
//                           fontFamily: 'monospace', 
//                           color: 'var(--text-secondary)', 
//                           background: 'rgba(255,255,255,0.03)', 
//                           padding: '4px 8px', 
//                           borderRadius: '4px',
//                           border: '1px solid var(--border)'
//                         }}>
//                           {item.sku}
//                         </span>
//                       </td>
//                       <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.quantity}</td>
//                       <td style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{item.location}</td>

//                       {/* Trạng thái phát sáng chấm xanh/đỏ */}
//                       <td style={{ textAlign: 'center' }}>
//                         {item.status === "LOW" ? (
//                           <span style={{
//                             inlineSize: 'max-content',
//                             display: 'inline-flex',
//                             alignItems: 'center',
//                             gap: '6px',
//                             background: 'rgba(239, 68, 68, 0.1)',
//                             color: '#EF4444',
//                             padding: '4px 12px',
//                             borderRadius: '12px',
//                             fontSize: '12px',
//                             fontWeight: 500
//                           }}>
//                             <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444' }}></span>
//                             CẢNH BÁO
//                           </span>
//                         ) : (
//                           <span style={{
//                             inlineSize: 'max-content',
//                             display: 'inline-flex',
//                             alignItems: 'center',
//                             gap: '6px',
//                             background: 'rgba(16, 185, 129, 0.1)',
//                             color: '#10B981',
//                             padding: '4px 12px',
//                             borderRadius: '12px',
//                             fontSize: '12px',
//                             fontWeight: 500
//                           }}>
//                             <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }}></span>
//                             OK
//                           </span>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }



// bản xịn 

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../api/auth";

// export default function InventoryPage() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [data, setData] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   const fetchData = async () => {
//     try {
//       const res = await api.get("/api/inventories");
//       setData(res.data || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate("/login", { replace: true });
//   };

//   // Hàm tạo ký tự đại diện cho Avatar sản phẩm trong bảng
//   const getProductInitial = (name: string) => {
//     if (!name) return "P";
//     const parts = name.trim().split(" ");
//     return parts[parts.length - 1].charAt(0).toUpperCase();
//   };

//   // Bộ lọc tìm kiếm Client-side mượt mà theo Tên, SKU hoặc Vị trí
//   const filteredData = data.filter((item) => {
//     const term = searchTerm.toLowerCase();
//     return (
//       (item.product && item.product.toLowerCase().includes(term)) ||
//       (item.sku && item.sku.toLowerCase().includes(term)) ||
//       (item.location && item.location.toLowerCase().includes(term))
//     );
//   });

//   const totalProducts = data.length;
//   const lowStockCount = data.filter((item) => item.status === "LOW").length;

//   return (
//     <div className="dashboard-root">

//       {/* ── SIDEBAR GỐC CỦA BẠN (GIỮ NGUYÊN 100%) ────────────────── */}
//       <aside className="sidebar">
//         <div className="sidebar-brand" onClick={() => navigate("/admin")}>
//           WareFlow
//         </div>

//         <nav className="sidebar-nav">
//           <a href="/admin">Dashboard</a>
//           <a href="/admin/products">Sản phẩm</a>
//           <a className="active" href="/admin/inventory">Tồn kho</a>
//         </nav>

//         <div className="sidebar-footer">
//           <div>{user?.username}</div>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       </aside>

//       {/* ── PHẦN MAIN BÊN PHẢI (LÀM ĐẸP HIỆN ĐẠI) ────────────────── */}
//       <main className="dashboard-main">

//         {/* Tiêu đề trang */}
//         <div style={{ marginBottom: "20px" }}>
//           <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
//             🏬 Tồn kho
//           </h1>
//           <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
//             Thống kê tồn kho chi tiết và vị trí các sản phẩm trong hệ thống
//           </p>
//         </div>

//         {/* Cụm Badges thống kê nhanh số liệu */}
//         <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
//           <div style={{
//             background: "rgba(255, 255, 255, 0.03)",
//             border: "1px solid var(--border)",
//             padding: "6px 14px",
//             borderRadius: "20px",
//             fontSize: "13px",
//             color: "var(--text-secondary)",
//             display: "flex",
//             alignItems: "center",
//             gap: "6px"
//           }}>
//             <span>📦</span> Tổng sản phẩm (có tồn): <strong style={{ color: "var(--text-primary)" }}>{totalProducts}</strong>
//           </div>
//           <div style={{
//             background: "rgba(239, 68, 68, 0.05)",
//             border: "1px solid rgba(239, 68, 68, 0.15)",
//             padding: "6px 14px",
//             borderRadius: "20px",
//             fontSize: "13px",
//             color: "#EF4444",
//             display: "flex",
//             alignItems: "center",
//             gap: "6px"
//           }}>
//             <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#EF4444" }}></span>
//             Trạng thái thấp: <strong>{lowStockCount}</strong>
//           </div>
//         </div>

//         {/* Thanh tìm kiếm thời gian thực */}
//         <div style={{ marginBottom: "20px", display: "flex", gap: "12px" }}>
//           <div style={{ position: "relative", flex: 1 }}>
//             <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}>🔍</span>
//             <input 
//               type="text" 
//               placeholder="Tìm sản phẩm theo SKU hoặc vị trí kho..." 
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               style={{
//                 width: "100%",
//                 padding: "12px 16px 12px 40px",
//                 background: "var(--bg-overlay)",
//                 border: "1px solid var(--border)",
//                 borderRadius: "10px",
//                 color: "var(--text-primary)",
//                 fontSize: "14px",
//                 outline: "none"
//               }}
//             />
//           </div>
//           {searchTerm && (
//             <button 
//               onClick={() => setSearchTerm("")}
//               style={{
//                 padding: "0 16px",
//                 background: "var(--border)",
//                 border: "1px solid var(--border)",
//                 borderRadius: "10px",
//                 color: "var(--text-secondary)",
//                 cursor: "pointer",
//                 fontSize: "13px"
//               }}
//             >
//               ✕ Xóa lọc
//             </button>
//           )}
//         </div>

//         {/* Khung chứa bảng dữ liệu Modern Dark */}
//         <div className="stat-card" style={{ padding: "0", overflow: "hidden", border: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
//           <div style={{ overflowX: "auto" }}>
//             <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
//               <thead>
//                 <tr style={{ background: "rgba(255, 255, 255, 0.02)", borderBottom: "1px solid var(--border)" }}>
//                   <th style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", width: "50px", textAlign: "center" }}>#</th>
//                   <th style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Sản phẩm</th>
//                   <th style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>SKU</th>
//                   <th style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Số lượng</th>
//                   <th style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Vị trí (Kho &gt; Kệ &gt; Ô tầng)</th>
//                   <th style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", textAlign: "center" }}>Trạng thái</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredData.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)", fontSize: "14px" }}>
//                       Không tìm thấy dữ liệu tồn kho phù hợp.
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredData.map((item, idx) => (
//                     <tr key={idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)", transition: "background 0.2s" }}>
//                       <td style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: "14px", textAlign: "center" }}>{idx + 1}</td>
                      
//                       {/* Cột sản phẩm kèm Avatar tròn */}
//                       <td style={{ padding: "14px 16px" }}>
//                         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                           <div style={{
//                             width: "30px",
//                             height: "30px",
//                             borderRadius: "50%",
//                             background: "#4F46E5",
//                             color: "var(--text-primary)",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             fontWeight: 600,
//                             fontSize: "12px"
//                           }}>
//                             {getProductInitial(item.product)}
//                           </div>
//                           <span style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: "14px" }}>{item.product}</span>
//                         </div>
//                       </td>

//                       {/* Cột SKU dạng khối Monospace chuyên nghiệp */}
//                       <td style={{ padding: "14px 16px" }}>
//                         <span style={{
//                           fontFamily: "monospace",
//                           color: "var(--text-secondary)",
//                           background: "var(--border)",
//                           padding: "3px 6px",
//                           borderRadius: "4px",
//                           fontSize: "13px",
//                           border: "1px solid rgba(255, 255, 255, 0.03)"
//                         }}>
//                           {item.sku}
//                         </span>
//                       </td>

//                       <td style={{ padding: "14px 16px", fontWeight: 600, color: "var(--text-primary)", fontSize: "14px" }}>{item.quantity}</td>
//                       <td style={{ padding: "14px 16px", color: "var(--text-primary)", fontSize: "13px" }}>{item.location}</td>

//                       {/* Trạng thái dạng Badge phát sáng bo góc */}
//                       <td style={{ padding: "14px 16px", textAlign: "center" }}>
//                         {item.status === "LOW" ? (
//                           <span style={{
//                             display: "inline-flex",
//                             alignItems: "center",
//                             gap: "6px",
//                             background: "rgba(239, 68, 68, 0.1)",
//                             color: "#EF4444",
//                             padding: "4px 10px",
//                             borderRadius: "12px",
//                             fontSize: "12px",
//                             fontWeight: 500
//                           }}>
//                             <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#EF4444" }}></span>
//                             CẢNH BÁO
//                           </span>
//                         ) : (
//                           <span style={{
//                             display: "inline-flex",
//                             alignItems: "center",
//                             gap: "6px",
//                             background: "rgba(16, 185, 129, 0.1)",
//                             color: "#10B981",
//                             padding: "4px 10px",
//                             borderRadius: "12px",
//                             fontSize: "12px",
//                             fontWeight: 500
//                           }}>
//                             <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981" }}></span>
//                             OK
//                           </span>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }



//bản giao diện 

// import { useEffect, useState } from "react";
// import api from "../../api/auth";
// import AdminLayout from "./AdminLayout";

// export default function InventoryPage() {
//   const [inventories, setInventories] = useState<any[]>([]);
//   const [total, setTotal] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [editingMinQuantity, setEditingMinQuantity] = useState<{ [key: number]: number }>({});
//   const pageSize = 10; 

//   const fetchData = async (page: number) => {
//     try {
//       const res = await api.get(`/api/inventories?page=${page}&limit=${pageSize}`);
//       if (res.data) {
//         setInventories(res.data.data || []);
//         setTotal(res.data.total || 0);
//       }
//     } catch (err) {
//       console.error("Lỗi khi fetch dữ liệu tồn kho:", err);
//       setInventories([]);
//       setTotal(0);
//     }
//   };

//   useEffect(() => {
//     fetchData(currentPage);
//   }, [currentPage]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm]);

//   const getProductInitial = (name: string) => {
//     if (!name) return "P";
//     const parts = name.trim().split(" ");
//     return parts[parts.length - 1].charAt(0).toUpperCase();
//   };

//   const filteredData = inventories.filter((item) => {
//     const term = searchTerm.toLowerCase();
//     return (
//       (item.product && item.product.toLowerCase().includes(term)) ||
//       (item.sku && item.sku.toLowerCase().includes(term)) ||
//       (item.location && item.location.toLowerCase().includes(term))
//     );
//   });

//   const totalPages = Math.ceil(total / pageSize) || 1;
//   const lowStockCount = inventories.filter((item) => item.status === "LOW").length;

//   const handleMinQuantityChange = (inventoryId: number, value: number) => {
//     setEditingMinQuantity(prev => ({ ...prev, [inventoryId]: value }));
//   };

//   const saveMinQuantity = async (inventoryId: number, value: number) => {
//     try {
//       await api.put(`/api/inventories/${inventoryId}/min-quantity`, { min_quantity: value });
//       // Update local state
//       setInventories(prev => prev.map(item => 
//         item.id === inventoryId ? { ...item, min_quantity: value } : item
//       ));
//     } catch (err) {
//       console.error("Lỗi khi cập nhật số lượng tối thiểu:", err);
//     }
//   };

//   return (
//     <AdminLayout>

//         {/* Tiêu đề trang */}
//         <div style={{ marginBottom: "20px" }}>
//           <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
//             Quản lý Tồn kho
//           </h1>
//           <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
//             Hệ thống giám sát và phân vị trí hàng hóa lưu kho thời gian thực
//           </p>
//         </div>

//         {/* Cụm Badges thống kê */}
//         <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
//           <div style={{
//             background: "rgba(255, 255, 255, 0.03)",
//             border: "1px solid var(--border)",
//             padding: "6px 14px",
//             borderRadius: "20px",
//             fontSize: "13px",
//             color: "var(--text-secondary)",
//             display: "flex",
//             alignItems: "center",
//             gap: "6px"
//           }}>
//             <span>📦</span> Tổng sản phẩm hệ thống: <strong style={{ color: "var(--text-primary)" }}>{total}</strong>
//           </div>
//           <div style={{
//             background: "rgba(239, 68, 68, 0.05)",
//             border: "1px solid rgba(239, 68, 68, 0.15)",
//             padding: "6px 14px",
//             borderRadius: "20px",
//             fontSize: "13px",
//             color: "#EF4444",
//             display: "flex",
//             alignItems: "center",
//             gap: "6px"
//           }}>
//             <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#EF4444" }}></span>
//             Cảnh báo trang này: <strong>{lowStockCount}</strong>
//           </div>
//         </div>

//         {/* Thanh tìm kiếm */}
//         <div style={{ marginBottom: "20px", display: "flex", gap: "12px" }}>
//           <div style={{ position: "relative", flex: 1 }}>
//             <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}>🔍</span>
//             <input 
//               type="text" 
//               placeholder="Tìm kiếm sản phẩm trên trang hiện tại..." 
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               style={{
//                 width: "100%",
//                 padding: "12px 16px 12px 40px",
//                 background: "var(--bg-overlay)",
//                 border: "1px solid var(--border)",
//                 borderRadius: "10px",
//                 color: "var(--text-primary)",
//                 fontSize: "14px",
//                 outline: "none"
//               }}
//             />
//           </div>
//         </div>

//         {/* Khung chứa bảng dữ liệu */}
//         <div className="stat-card" style={{ padding: "0", overflow: "hidden", border: "1px solid var(--border)", background: "var(--bg-elevated)", borderRadius: "12px", display: "flex", flexDirection: "column" }}>
//           <div style={{ overflowX: "auto", width: "100%" }}>
//             <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
//               <thead>
//                 <tr style={{ background: "rgba(255, 255, 255, 0.02)", borderBottom: "1px solid var(--border)" }}>
//                   <th style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", width: "60px", textAlign: "center" }}>#</th>
//                   <th style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Sản phẩm</th>
//                   <th style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>SKU</th>
//                   <th style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Số lượng</th>
//                   <th style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>SL Tối thiểu</th>
//                   <th style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Vị trí (Kho &gt; Kệ &gt; Ô tầng)</th>
//                   <th style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", textAlign: "center" }}>Trạng thái</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredData.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)", fontSize: "14px" }}>
//                       Không tìm thấy dữ liệu tồn kho phù hợp.
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredData.map((item, idx) => (
//                     <tr key={idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
//                       <td style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: "14px", textAlign: "center" }}>
//                         {(currentPage - 1) * pageSize + idx + 1}
//                       </td>
//                       <td style={{ padding: "14px 16px" }}>
//                         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                           <div style={{
//                             width: "30px", height: "30px", borderRadius: "50%", background: "#4F46E5",
//                             color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: "12px"
//                           }}>
//                             {getProductInitial(item.product)}
//                           </div>
//                           <span style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: "14px" }}>{item.product}</span>
//                         </div>
//                       </td>
//                       <td style={{ padding: "14px 16px" }}>
//                         <span style={{
//                           fontFamily: "monospace", color: "var(--text-secondary)", background: "var(--border)",
//                           padding: "3px 6px", borderRadius: "4px", fontSize: "13px", border: "1px solid rgba(255, 255, 255, 0.03)"
//                         }}>
//                           {item.sku}
//                         </span>
//                       </td>
//                       <td style={{ 
//                         padding: "14px 16px", 
//                         fontWeight: 600, 
//                         color: (item.min_quantity && item.quantity < item.min_quantity) ? "#EF4444" : "var(--text-primary)", 
//                         fontSize: "14px" 
//                       }}>
//                         {item.quantity}
//                       </td>
//                       <td style={{ padding: "14px 16px" }}>
//                         <input
//                           type="number"
//                           min="0"
//                           value={editingMinQuantity[item.id] !== undefined ? editingMinQuantity[item.id] : (item.min_quantity || 0)}
//                           onChange={(e) => handleMinQuantityChange(item.id, parseInt(e.target.value) || 0)}
//                           onBlur={() => saveMinQuantity(item.id, editingMinQuantity[item.id] !== undefined ? editingMinQuantity[item.id] : (item.min_quantity || 0))}
//                           style={{
//                             width: "70px",
//                             padding: "6px 8px",
//                             background: "var(--border)",
//                             border: "1px solid var(--border)",
//                             borderRadius: "6px",
//                             color: "var(--text-primary)",
//                             fontSize: "13px",
//                             outline: "none",
//                             textAlign: "center"
//                           }}
//                         />
//                       </td>
//                       <td style={{ padding: "14px 16px", color: "var(--text-primary)", fontSize: "13px" }}>{item.location}</td>
//                       <td style={{ padding: "14px 16px", textAlign: "center" }}>
//                         <span style={{
//                           display: "inline-flex", alignItems: "center", gap: "6px",
//                           background: item.status === "LOW" ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
//                           color: item.status === "LOW" ? "#EF4444" : "#10B981",
//                           padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: 500
//                         }}>
//                           <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: item.status === "LOW" ? "#EF4444" : "#10B981" }}></span>
//                           {item.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* ── 🔥 FIX THANH PHÂN TRANG: ĐỘC LẬP - FULL WIDTH DƯỚI ĐÁY BẢNG ── */}
//           <div style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             padding: "16px 24px",
//             background: "rgba(15, 23, 42, 0.4)",
//             borderTop: "1px solid var(--border)",
//             width: "100%",
//             boxSizing: "border-box"
//           }}>
//             {/* Thống kê số dòng nằm bên trái */}
//             <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
//               Hiển thị từ <strong>{total === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> đến <strong>{Math.min(currentPage * pageSize, total)}</strong> trên tổng số <strong>{total}</strong> dòng dữ liệu
//             </div>
            
//             {/* Cụm nút bấm chuyển trang nằm bên phải độc lập */}
//             <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 style={{
//                   padding: "6px 14px",
//                   background: currentPage === 1 ? "rgba(255,255,255,0.02)" : "#374151",
//                   border: "1px solid var(--border)",
//                   borderRadius: "6px",
//                   color: currentPage === 1 ? "#4B5563" : "var(--text-primary)",
//                   cursor: currentPage === 1 ? "not-allowed" : "pointer",
//                   fontSize: "13px",
//                   transition: "all 0.2s"
//                 }}
//               >
//                 ◀ Trước
//               </button>

//               {Array.from({ length: totalPages }).map((_, i) => {
//                 const pageNum = i + 1;
//                 const isActive = pageNum === currentPage;
//                 return (
//                   <button
//                     key={pageNum}
//                     onClick={() => setCurrentPage(pageNum)}
//                     style={{
//                       minWidth: "32px",
//                       height: "32px",
//                       background: isActive ? "#4F46E5" : "transparent",
//                       border: isActive ? "none" : "1px solid var(--border)",
//                       borderRadius: "6px",
//                       color: "var(--text-primary)",
//                       fontWeight: isActive ? 600 : 400,
//                       cursor: "pointer",
//                       fontSize: "13px",
//                       transition: "all 0.2s"
//                     }}
//                   >
//                     {pageNum}
//                   </button>
//                 );
//               })}

//               <button
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 style={{
//                   padding: "6px 14px",
//                   background: currentPage === totalPages ? "rgba(255,255,255,0.02)" : "#374151",
//                   border: "1px solid var(--border)",
//                   borderRadius: "6px",
//                   color: currentPage === totalPages ? "#4B5563" : "var(--text-primary)",
//                   cursor: currentPage === totalPages ? "not-allowed" : "pointer",
//                   fontSize: "13px",
//                   transition: "all 0.2s"
//                 }}
//               >
//                 Sau ▶
//               </button>
//             </div>
//           </div>

//         </div>
//     </AdminLayout>
//   );
// }



//bản css mới có thêm cột min 
import { useEffect, useState } from "react";
import api from "../../api/auth";
import AdminLayout from "./AdminLayout";

export default function InventoryPage() {
  const [inventories, setInventories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMinQuantity, setEditingMinQuantity] = useState<{ [key: number]: number }>({});
  const pageSize = 10; 

  const fetchData = async (page: number) => {
    try {
      const res = await api.get(`/api/inventories?page=${page}&limit=${pageSize}`);
      if (res.data) {
        setInventories(res.data.data || []);
        setTotal(res.data.total || 0);
      }
    } catch (err) {
      console.error("Lỗi khi fetch dữ liệu tồn kho:", err);
      setInventories([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getProductInitial = (name: string) => {
    if (!name) return "P";
    const parts = name.trim().split(" ");
    return parts[parts.length - 1].charAt(0).toUpperCase();
  };

  const filteredData = inventories.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      (item.product && item.product.toLowerCase().includes(term)) ||
      (item.sku && item.sku.toLowerCase().includes(term)) ||
      (item.location && item.location.toLowerCase().includes(term))
    );
  });

  const totalPages = Math.ceil(total / pageSize) || 1;
  const lowStockCount = inventories.filter((item) => item.status === "LOW").length;

  const handleMinQuantityChange = (inventoryId: number, value: number) => {
    setEditingMinQuantity(prev => ({ ...prev, [inventoryId]: value }));
  };

  const saveMinQuantity = async (inventoryId: number, value: number) => {
    try {
      await api.put(`/api/inventories/${inventoryId}/min-quantity`, { min_quantity: value });
      // Update local state
      setInventories(prev => prev.map(item => 
        item.id === inventoryId ? { ...item, min_quantity: value } : item
      ));
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng tối thiểu:", err);
    }
  };

  return (
    <AdminLayout>

        {/* Tiêu đề trang */}
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
            Quản lý Tồn kho
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Hệ thống giám sát và phân vị trí hàng hóa lưu kho thời gian thực
          </p>
        </div>

        {/* Cụm Badges thống kê */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--border)",
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "13px",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <span>📦</span> Tổng sản phẩm hệ thống: <strong style={{ color: "var(--text-primary)" }}>{total}</strong>
          </div>
          <div style={{
            background: "rgba(239, 68, 68, 0.05)",
            border: "1px solid rgba(239, 68, 68, 0.15)",
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "13px",
            color: "#EF4444",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#EF4444" }}></span>
            Cảnh báo trang này: <strong>{lowStockCount}</strong>
          </div>
        </div>

        {/* Thanh tìm kiếm */}
        <div style={{ marginBottom: "20px", display: "flex", gap: "12px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}>🔍</span>
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm trên trang hiện tại..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 40px",
                background: "var(--bg-overlay)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                color: "var(--text-primary)",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>
        </div>

        {/* Khung chứa bảng dữ liệu */}
        <div className="stat-card" style={{ padding: "0", overflow: "hidden", border: "1px solid var(--border)", background: "var(--bg-elevated)", borderRadius: "12px", display: "flex", flexDirection: "column" }}>
          <div style={{ overflowX: "auto", width: "100%", minHeight: "200px" }}>
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse", 
              textAlign: "left",
              tableLayout: "fixed"
            }}>
              <thead>
                <tr style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "14px 12px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", width: "50px", textAlign: "center", whiteSpace: "nowrap" }}>#</th>
                  <th style={{ padding: "14px 12px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", width: "200px", whiteSpace: "nowrap" }}>Sản phẩm</th>
                  <th style={{ padding: "14px 12px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", width: "120px", whiteSpace: "nowrap" }}>SKU</th>
                  <th style={{ padding: "14px 12px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", width: "100px", textAlign: "center", whiteSpace: "nowrap" }}>Số lượng</th>
                  <th style={{ padding: "14px 12px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", width: "100px", textAlign: "center", whiteSpace: "nowrap" }}>SL Tối thiểu</th>
                  <th style={{ padding: "14px 12px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", width: "300px", whiteSpace: "nowrap" }}>Vị trí (Kho &gt; Kệ &gt; Ô tầng)</th>
                  <th style={{ padding: "14px 12px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", width: "80px", textAlign: "center", whiteSpace: "nowrap" }}>Trạng thái</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)", fontSize: "14px" }}>
                      Không tìm thấy dữ liệu tồn kho phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                      <td style={{ padding: "14px 12px", color: "var(--text-secondary)", fontSize: "14px", textAlign: "center", whiteSpace: "nowrap" }}>
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td style={{ padding: "14px 12px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            minWidth: "30px",
                            width: "30px", 
                            height: "30px", 
                            borderRadius: "50%", 
                            background: "#4F46E5",
                            color: "var(--text-primary)", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            fontWeight: 600, 
                            fontSize: "12px",
                            flexShrink: 0
                          }}>
                            {getProductInitial(item.product)}
                          </div>
                          <span 
                            title={item.product}
                            className="truncate-cell"
                            style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: "13px", cursor: "help" }}
                          >
                            {item.product}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 12px", whiteSpace: "nowrap" }}>
                        <span 
                          title={item.sku}
                          className="truncate-cell"
                          style={{
                            fontFamily: "monospace", 
                            color: "var(--text-secondary)", 
                            background: "var(--border)",
                            padding: "3px 6px", 
                            borderRadius: "4px", 
                            fontSize: "12px", 
                            border: "1px solid rgba(255, 255, 255, 0.03)",
                            cursor: "help"
                          }}>
                          {item.sku}
                        </span>
                      </td>
                      <td style={{ 
                        padding: "14px 12px", 
                        fontWeight: 600, 
                        color: (item.min_quantity && item.quantity < item.min_quantity) ? "#EF4444" : "var(--text-primary)", 
                        fontSize: "14px",
                        textAlign: "center",
                        whiteSpace: "nowrap"
                      }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: "14px 12px", textAlign: "center", whiteSpace: "nowrap" }}>
                        <input
                          type="number"
                          min="0"
                          value={editingMinQuantity[item.id] !== undefined ? editingMinQuantity[item.id] : (item.min_quantity || 0)}
                          onChange={(e) => handleMinQuantityChange(item.id, parseInt(e.target.value) || 0)}
                          onBlur={() => saveMinQuantity(item.id, editingMinQuantity[item.id] !== undefined ? editingMinQuantity[item.id] : (item.min_quantity || 0))}
                          style={{
                            width: "70px",
                            padding: "6px 8px",
                            background: "var(--border)",
                            border: "1px solid var(--border)",
                            borderRadius: "6px",
                            color: "var(--text-primary)",
                            fontSize: "13px",
                            outline: "none",
                            textAlign: "center"
                          }}
                        />
                      </td>
                      <td style={{ padding: "14px 12px", color: "var(--text-primary)", fontSize: "13px", cursor: "help" }}>
                        <div title={item.location} className="truncate-cell">{item.location}</div>
                      </td>
                      <td style={{ padding: "14px 12px", textAlign: "center", whiteSpace: "nowrap" }}>
                        <span style={{
                          display: "inline-flex", 
                          alignItems: "center", 
                          gap: "6px",
                          background: item.status === "LOW" ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
                          color: item.status === "LOW" ? "#EF4444" : "#10B981",
                          padding: "4px 10px", 
                          borderRadius: "12px", 
                          fontSize: "12px", 
                          fontWeight: 500
                        }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: item.status === "LOW" ? "#EF4444" : "#10B981", flexShrink: 0 }}></span>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── THANH PHÂN TRANG: ĐỘC LẬP - FULL WIDTH DƯỚI ĐÁY BẢNG ── */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            background: "var(--bg-surface)",
            borderTop: "1px solid var(--border)",
            width: "100%",
            boxSizing: "border-box",
            flexWrap: "wrap",
            gap: "16px"
          }}>
            {/* Thống kê số dòng nằm bên trái */}
            <div style={{ color: "var(--text-secondary)", fontSize: "13px", whiteSpace: "nowrap" }}>
              Hiển thị từ <strong>{total === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> đến <strong>{Math.min(currentPage * pageSize, total)}</strong> trên tổng số <strong>{total}</strong> dòng dữ liệu
            </div>
            
            {/* Cụm nút bấm chuyển trang nằm bên phải độc lập */}
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                style={{
                  padding: "6px 14px",
                  background: currentPage === 1 ? "rgba(255,255,255,0.02)" : "#374151",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  color: currentPage === 1 ? "#4B5563" : "var(--text-primary)",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontSize: "13px",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap"
                }}
              >
                ◀ Trước
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      minWidth: "32px",
                      height: "32px",
                      background: isActive ? "#4F46E5" : "transparent",
                      border: isActive ? "none" : "1px solid var(--border)",
                      borderRadius: "6px",
                      color: "var(--text-primary)",
                      fontWeight: isActive ? 600 : 400,
                      cursor: "pointer",
                      fontSize: "13px",
                      transition: "all 0.2s"
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                style={{
                  padding: "6px 14px",
                  background: currentPage === totalPages ? "rgba(255,255,255,0.02)" : "#374151",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  color: currentPage === totalPages ? "#4B5563" : "var(--text-primary)",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  fontSize: "13px",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap"
                }}
              >
                Sau ▶
              </button>
            </div>
          </div>

        </div>
    </AdminLayout>
  );
}