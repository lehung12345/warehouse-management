// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import QRCode from "qrcode.react";
// import {
//   getProductsAPI,
//   createProductAPI,
//   deleteProductAPI,
//   updateProductAPI,
// } from "../../api/product";

// export default function ProductPage() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [products, setProducts] = useState<any[]>([]);
//   const [name, setName] = useState("");
//   const [unit, setUnit] = useState("");
//   const [editingId, setEditingId] = useState<number | null>(null);

//   const fetchProducts = async () => {
//     try {
//       const res = await getProductsAPI();
//       setProducts(res.data || []);
//     } catch (error) {
//       console.error("Lỗi khi tải sản phẩm:", error);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

// //   const handleCreate = async (e: React.FormEvent) => {
// //     e.preventDefault(); // Tránh reload trang khi submit form
// //     if (!name.trim()) return alert("Nhập tên sản phẩm");

// //     await createProductAPI({ name, unit });
// //     setName("");
// //     setUnit("");
// //     fetchProducts();
// //   };
//     const handleCreate = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!name.trim()) return alert("Nhập tên sản phẩm");

//     try {
//         if (editingId) {
//         // 👉 SỬA
//         await updateProductAPI(editingId, { name, unit });
//         setEditingId(null);
//         } else {
//         // 👉 THÊM
//         await createProductAPI({ name, unit });
//         }

//         setName("");
//         setUnit("");
//         fetchProducts();
//     } catch (err) {
//         console.error(err);
//         alert("Lỗi khi thêm/sửa");
//     }
//     };

//   const handleDelete = async (id: number) => {
//     if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

//     await deleteProductAPI(id);
//     fetchProducts();
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login", { replace: true });
//   };

//   return (
//     <div className="dashboard-root">
//       {/* Sidebar đồng bộ hệ thống */}
//       <aside className="sidebar">
//         <div className="sidebar-brand" onClick={() => navigate("/admin")} style={{ cursor: 'pointer' }}>
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
//           <div className="nav-section-title">Quản lý</div>
//           <a className="nav-item" href="/admin">
//             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
//             </svg>
//             Dashboard
//           </a>
//           <a className="nav-item active" href="/admin/products">
//             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//             </svg>
//             Sản phẩm
//           </a>
//           <a className="nav-item" href="/admin/users">
//             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//             </svg>
//             Nhân viên
//           </a>
//         </nav>

//         <div className="sidebar-footer">
//           <div className="user-info">
//             <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
//             <div>
//               <p className="user-name">{user?.username}</p>
//               <p className="user-role-badge">ADMIN</p>
//             </div>
//           </div>
//           <button className="btn-logout" onClick={handleLogout} id="logout-btn">
//             <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//             </svg>
//             Đăng xuất
//           </button>
//         </div>
//       </aside>

//       {/* Phần nội dung chính (Main Content) */}
//       <main className="dashboard-main">
//         <header className="dashboard-header">
//           <div>
//             <h1>Quản lý sản phẩm</h1>
//             <p>Xem, thêm mới hoặc xóa sản phẩm trong hệ thống kho.</p>
//           </div>
//         </header>

//         {/* Form thêm sản phẩm được làm đẹp */}
//         <div className="stat-card" style={{ display: 'block', marginBottom: '24px', padding: '24px' }}>
//           <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#fff' }}>Thêm sản phẩm mới</h3>
//           <form onSubmit={handleCreate} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '200px' }}>
//               <label style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 500 }}>Tên sản phẩm *</label>
//               <input
//                 type="text"
//                 placeholder="Ví dụ: Thùng Carton A1"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 style={{
//                   background: '#1F2937',
//                   border: '1px solid #374151',
//                   borderRadius: '6px',
//                   padding: '10px 14px',
//                   color: '#fff',
//                   outline: 'none'
//                 }}
//               />
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '180px' }}>
//               <label style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 500 }}>Đơn vị tính</label>
//               <input
//                 type="text"
//                 placeholder="Ví dụ: Cái, Thùng"
//                 value={unit}
//                 onChange={(e) => setUnit(e.target.value)}
//                 style={{
//                   background: '#1F2937',
//                   border: '1px solid #374151',
//                   borderRadius: '6px',
//                   padding: '10px 14px',
//                   color: '#fff',
//                   outline: 'none'
//                 }}
//               />
//             </div>
//             <button 
//               type="submit"
//               className="action-card" 
//               style={{
//                 background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
//                 color: 'white',
//                 border: 'none',
//                 padding: '11px 24px',
//                 borderRadius: '6px',
//                 fontWeight: 600,
//                 cursor: 'pointer',
//                 margin: 0,
//                 height: '42px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
//               }}
//             >
//               <span>+ Thêm sản phẩm</span>
//             </button>
//           </form>
//         </div>

//         {/* Bảng danh sách sản phẩm kiểu Modern Dark CSS */}
//         <div className="stat-card" style={{ display: 'block', padding: '0px', overflow: 'hidden' }}>
//           <div style={{ overflowX: 'auto' }}>
//             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
//               <thead>
//                 <tr style={{ background: '#111827', borderBottom: '1px solid #1F2937' }}>
//                   <th style={{ padding: '16px', color: '#9CA3AF', fontWeight: 600, width: '80px' }}>ID</th>
//                   <th style={{ padding: '16px', color: '#9CA3AF', fontWeight: 600 }}>Tên sản phẩm</th>
//                   <th style={{ padding: '16px', color: '#9CA3AF', fontWeight: 600 }}>SKU</th>
//                   <th style={{ padding: '16px', color: '#9CA3AF', fontWeight: 600 }}>Barcode</th>
//                   <th style={{ padding: '16px' }}>QR</th>
//                   <th style={{ padding: '16px', color: '#9CA3AF', fontWeight: 600, width: '120px' }}>Đơn vị</th>
//                   <th style={{ padding: '16px', color: '#9CA3AF', fontWeight: 600, width: '100px', textAlign: 'center' }}>Thao tác</th>
//                 </tr>
//               </thead>

//               <tbody style={{ color: '#E5E7EB' }}>
//                 {products.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#6B7280' }}>
//                       Chưa có sản phẩm nào trong hệ thống kho.
//                     </td>
//                   </tr>
//                 ) : (
//                   products.map((p, index) => (
//                     <tr key={p.id} style={{ borderBottom: '1px solid #1F2937', background: index % 2 === 0 ? 'transparent' : '#1F2937/30' }}>
//                       <td style={{ padding: '16px', color: '#9CA3AF' }}>#{p.id}</td>
//                       <td style={{ padding: '16px', fontWeight: 500, color: '#FFF' }}>{p.name}</td>
//                       <td style={{ padding: '16px' }}><code style={{ background: '#1F2937', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{p.sku || "—"}</code></td>
//                       <td style={{ padding: '16px', color: '#9CA3AF' }}>{p.barcode || "—"}</td>
//                       <td style={{ padding: '16px' }}>
//                         <QRCode value={p.barcode || p.sku} size={50} />
//                       </td>
//                       <td style={{ padding: '16px' }}>
//                         <span style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#A5B4FC', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 500 }}>
//                           {p.unit || "Chưa rõ"}
//                         </span>
//                       </td>
//                       {/* <td style={{ padding: '16px', textAlign: 'center' }}>
//                         <button 
//                           onClick={() => handleDelete(p.id)}
//                           style={{
//                             background: 'rgba(239, 68, 68, 0.1)',
//                             color: '#EF4444',
//                             border: '1px solid rgba(239, 68, 68, 0.2)',
//                             padding: '6px 12px',
//                             borderRadius: '6px',
//                             cursor: 'pointer',
//                             fontSize: '13px',
//                             fontWeight: 500,
//                             transition: 'all 0.2s'
//                           }}
//                           onMouseOver={(e) => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff' }}
//                           onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#EF4444' }}
//                         >
//                           Xóa
//                         </button>
//                       </td> */}

//                       <td style={{ padding: '16px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        
//                         {/* Nút sửa */}
//                         <button
//                             onClick={() => {
//                             setEditingId(p.id);
//                             setName(p.name);
//                             setUnit(p.unit);
//                             }}
//                             style={{
//                             background: '#3B82F6',
//                             color: '#fff',
//                             border: 'none',
//                             padding: '6px 12px',
//                             borderRadius: '6px',
//                             cursor: 'pointer'
//                             }}
//                         >
//                             Sửa
//                         </button>

//                         {/* Nút xóa */}
//                         <button 
//                             onClick={() => handleDelete(p.id)}
//                             style={{
//                             background: 'rgba(239, 68, 68, 0.1)',
//                             color: '#EF4444',
//                             border: '1px solid rgba(239, 68, 68, 0.2)',
//                             padding: '6px 12px',
//                             borderRadius: '6px',
//                             cursor: 'pointer'
//                             }}
//                         >
//                             Xóa
//                         </button>

//                         </td>
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






import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
// 🛠️ SỬA TẠI ĐÂY: Sử dụng named import QRCodeSVG thay vì import default QRCode
import { QRCodeSVG } from "qrcode.react"; 
import {
  getProductsAPI,
  createProductAPI,
  deleteProductAPI,
  updateProductAPI,
} from "../../api/product";

export default function ProductPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [rfid, setRfid] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await getProductsAPI();
      setProducts(res.data || []);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return alert("Nhập tên sản phẩm");

    try {
        if (editingId) {
          // 👉 SỬA
          await updateProductAPI(editingId, { name, unit, rfid_code: rfid });
          setEditingId(null);
        } else {
          // 👉 THÊM
          await createProductAPI({ name, unit, rfid_code: rfid });
        }

        setName("");
        setUnit("");
        fetchProducts();
    } catch (err) {
        console.error(err);
        alert("Lỗi khi thêm/sửa");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    await deleteProductAPI(id);
    fetchProducts();
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-root">
      {/* Sidebar đồng bộ hệ thống */}
      <aside className="sidebar">
        <div className="sidebar-brand" onClick={() => navigate("/admin")} style={{ cursor: 'pointer' }}>
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="url(#sideGrad)" />
            <path d="M10 18L24 10L38 18V30L24 38L10 30V18Z" stroke="white" strokeWidth="2.5" fill="none" />
            <defs>
              <linearGradient id="sideGrad" x1="0" y1="0" x2="48" y2="48">
                <stop stopColor="#6366F1" />
                <stop offset="1" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
          <span>WareFlow</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Quản lý</div>
          <a className="nav-item" href="/admin">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Dashboard
          </a>
          <a className="nav-item active" href="/admin/products">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Sản phẩm
          </a>
          <a className="nav-item" href="/admin/users">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Nhân viên
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
            <div>
              <p className="user-name">{user?.username}</p>
              <p className="user-role-badge">ADMIN</p>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout} id="logout-btn">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Phần nội dung chính (Main Content) */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Quản lý sản phẩm</h1>
            <p>Xem, thêm mới hoặc xóa sản phẩm trong hệ thống kho.</p>
          </div>
        </header>

        {/* Form thêm sản phẩm được làm đẹp */}
        <div className="stat-card" style={{ display: 'block', marginBottom: '24px', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#fff' }}>
            {editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
          </h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '200px' }}>
              <label style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 500 }}>Tên sản phẩm *</label>
              <input
                type="text"
                placeholder="Ví dụ: Thùng Carton A1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  background: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '180px' }}>
              <label style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 500 }}>Đơn vị tính</label>
              <input
                type="text"
                placeholder="Ví dụ: Cái, Thùng"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                style={{
                  background: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '200px' }}>
            <label style={{ fontSize: '13px', color: '#9CA3AF' }}>RFID</label>
            <input
                type="text"
                placeholder="Nhập RFID (nếu có)"
                value={rfid}
                onChange={(e) => setRfid(e.target.value)}
                style={{
                background: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '6px',
                padding: '10px 14px',
                color: '#fff'
                }}
            />
            </div>
            <button 
              type="submit"
              className="action-card" 
              style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                color: 'white',
                border: 'none',
                padding: '11px 24px',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer',
                margin: 0,
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
              }}
            >
              <span>{editingId ? "Lưu thay đổi" : "+ Thêm sản phẩm"}</span>
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setName("");
                  setUnit("");
                }}
                style={{
                  background: '#374151',
                  color: '#fff',
                  border: 'none',
                  padding: '11px 16px',
                  borderRadius: '6px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  height: '42px'
                }}
              >
                Hủy
              </button>
            )}
          </form>
        </div>

        {/* Bảng danh sách sản phẩm kiểu Modern Dark CSS */}
        <div className="stat-card" style={{ display: 'block', padding: '0px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#111827', borderBottom: '1px solid #1F2937' }}>
                  <th style={{ padding: '16px', color: '#9CA3AF', fontWeight: 600, width: '80px' }}>ID</th>
                  <th style={{ padding: '16px', color: '#9CA3AF', fontWeight: 600 }}>Tên sản phẩm</th>
                  <th style={{ padding: '16px', color: '#9CA3AF', fontWeight: 600 }}>SKU</th>
                  <th style={{ padding: '16px', color: '#9CA3AF', fontWeight: 600 }}>Barcode</th>
                  <th style={{ padding: '16px', color: '#9CA3AF', fontWeight: 600 }}>QR</th>
                  <th style={{ padding: '16px', color: '#9CA3AF', fontWeight: 600 }}>RFID</th>
                  <th style={{ padding: '16px', color: '#9CA3AF', fontWeight: 600, width: '120px' }}>Đơn vị</th>
                  <th style={{ padding: '16px', color: '#9CA3AF', fontWeight: 600, width: '100px', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>

              <tbody style={{ color: '#E5E7EB' }}>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#6B7280' }}>
                      Chưa có sản phẩm nào trong hệ thống kho.
                    </td>
                  </tr>
                ) : (
                  products.map((p, index) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #1F2937', background: index % 2 === 0 ? 'transparent' : '#1F2937/30' }}>
                      <td style={{ padding: '16px', color: '#9CA3AF' }}>#{p.id}</td>
                      <td style={{ padding: '16px', fontWeight: 500, color: '#FFF' }}>{p.name}</td>
                      <td style={{ padding: '16px' }}><code style={{ background: '#1F2937', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{p.sku || "—"}</code></td>
                      <td style={{ padding: '16px', color: '#9CA3AF' }}>{p.barcode || "—"}</td>
                      <td style={{ padding: '16px' }}>
                        {/* 🛠️ SỬA TẠI ĐÂY: Thay <QRCode> thành <QRCodeSVG> */}
                        {p.barcode || p.sku ? (
                          <QRCodeSVG value={p.barcode || p.sku} size={50} />
                        ) : (
                          "—"
                        )}
                      </td>
                      <td style={{ padding: '16px' }}>
                        {p.rfid_code || "Chưa gán"}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#A5B4FC', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 500 }}>
                          {p.unit || "Chưa rõ"}
                        </span>
                      </td>

                      <td style={{ padding: '16px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        {/* Nút sửa */}
                        <button
                          onClick={() => {
                            setEditingId(p.id);
                            setName(p.name);
                            setUnit(p.unit || "");
                            setRfid(p.rfid_code || "");
                          }}
                          style={{
                            background: '#3B82F6',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          Sửa
                        </button>

                        {/* Nút xóa */}
                        <button 
                          onClick={() => handleDelete(p.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#EF4444',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}