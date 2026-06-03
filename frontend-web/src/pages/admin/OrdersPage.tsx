// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../api/auth";
// import { Link } from "react-router-dom";

// export default function OrdersPage() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [imports, setImports] = useState<any[]>([]);
//   const [exports, setExports] = useState<any[]>([]);

//   const fetchData = async () => {
//     try {
//       const [importRes, exportRes] = await Promise.all([
//         api.get("/api/orders/import"),
//         api.get("/api/orders/export"),
//       ]);

//       setImports(importRes.data || []);
//       setExports(exportRes.data || []);
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

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "DONE":
//         return "lime";
//       case "PROCESSING":
//         return "orange";
//       default:
//         return "gray";
//     }
//   };

//   return (
//     <div className="dashboard-root">

//       {/* SIDEBAR */}
//       <aside className="sidebar">
//         <div className="sidebar-brand" onClick={() => navigate("/admin")}>
//           WareFlow
//         </div>

//         <nav className="sidebar-nav">
//             <Link to="/admin">Dashboard</Link>
//             <Link to="/admin/products">Sản phẩm</Link>
//             <Link to="/admin/inventory">Tồn kho</Link>
//             <Link className="active" to="/admin/orders">Đơn hàng</Link>
//         </nav>

//         <div className="sidebar-footer">
//           <div>{user?.username}</div>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       </aside>

//       {/* MAIN */}
//       <main className="dashboard-main">

//         <h1>📑 Quản lý đơn hàng</h1>

//         <div style={{ marginBottom: 20 }}>
//         <button onClick={() => navigate("/admin/orders/create-import")}>
//             + Tạo đơn nhập
//         </button>

//         <button
//             style={{ marginLeft: 10 }}
//             onClick={() => navigate("/admin/orders/create-export")}
//         >
//             + Tạo đơn xuất
//         </button>
//         </div>

//         {/* IMPORT */}
//         <div className="stat-card">
//           <h2>📥 Đơn nhập (Import)</h2>

//           <table style={{ width: "100%" }}>
//             <thead>
//               <tr>
//                 <th>Mã</th>
//                 <th>Người tạo</th>
//                 <th>Trạng thái</th>
//               </tr>
//             </thead>

//             <tbody>
//                 {imports.map((item) => (
//                     <tr
//                     key={item.ID || item.id}
//                     onClick={() => navigate(`/admin/orders/import/${item.ID}`)}
//                     style={{ cursor: "pointer" }}
//                     >
//                     <td>{item.Code}</td>
//                     <td>{item.UserID}</td>
//                     <td style={{ color: getStatusColor(item.Status) }}>
//                         {item.Status}
//                     </td>
//                     </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>

//         {/* EXPORT */}
//         <div className="stat-card" style={{ marginTop: 20 }}>
//           <h2>📤 Đơn xuất (Export)</h2>

//           <table style={{ width: "100%" }}>
//             <thead>
//               <tr>
//                 <th>Mã</th>
//                 <th>Người tạo</th>
//                 <th>Trạng thái</th>
//               </tr>
//             </thead>

//             <tbody>
//                 {exports.map((item) => (
//                     <tr
//                     key={item.ID || item.id}
//                     onClick={() => navigate(`/admin/orders/export/${item.ID}`)}
//                     style={{ cursor: "pointer" }}
//                     >
//                     <td>{item.Code}</td>
//                     <td>{item.UserID}</td>
//                     <td style={{ color: getStatusColor(item.Status) }}>
//                         {item.Status}
//                     </td>
//                     </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>

//       </main>
//     </div>
//   );
// }



// import { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../api/auth";

// export default function OrdersPage() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [imports, setImports] = useState<any[]>([]);
//   const [exports, setExports] = useState<any[]>([]);

//   // 🔥 FIX: chuẩn hóa dữ liệu (ID / id)
//   const getId = (item: any) => item.ID || item.id;

//   const fetchData = async () => {
//     try {
//       const [importRes, exportRes] = await Promise.all([
//         api.get("/api/orders/import"),
//         api.get("/api/orders/export"),
//       ]);

//       setImports(importRes.data || []);
//       setExports(exportRes.data || []);
//     } catch (err) {
//       console.error("Fetch orders error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate("/login", { replace: true });
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "DONE":
//         return "lime";
//       case "PROCESSING":
//         return "orange";
//       case "PENDING":
//         return "gray";
//       default:
//         return "black";
//     }
//   };

//   return (
//     <div className="dashboard-root">

//       {/* SIDEBAR */}
//       <aside className="sidebar">
//         <div className="sidebar-brand" onClick={() => navigate("/admin")}>
//           WareFlow
//         </div>

//         <nav className="sidebar-nav">
//           <Link to="/admin">Dashboard</Link>
//           <Link to="/admin/products">Sản phẩm</Link>
//           <Link to="/admin/inventory">Tồn kho</Link>
//           <Link className="active" to="/admin/orders">Đơn hàng</Link>
//         </nav>

//         <div className="sidebar-footer">
//           <div>{user?.username}</div>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       </aside>

//       {/* MAIN */}
//       <main className="dashboard-main">

//         <h1>📑 Quản lý đơn hàng</h1>

//         {/* 🔥 BUTTONS */}
//         <div style={{ marginBottom: 20 }}>
//           <button onClick={() => navigate("/admin/orders/create-import")}>
//             + Tạo đơn nhập
//           </button>

//           <button
//             style={{ marginLeft: 10 }}
//             onClick={() => navigate("/admin/orders/create-export")}
//           >
//             + Tạo đơn xuất
//           </button>
//         </div>

//         {/* IMPORT TABLE */}
//         <div className="stat-card">
//           <h2>📥 Đơn nhập (Import)</h2>

//           <table style={{ width: "100%" }}>
//             <thead>
//               <tr>
//                 <th>Mã</th>
//                 <th>Người tạo</th>
//                 <th>Trạng thái</th>
//               </tr>
//             </thead>

//             <tbody>
//               {imports.length === 0 ? (
//                 <tr>
//                   <td colSpan={3} style={{ textAlign: "center" }}>
//                     Không có dữ liệu
//                   </td>
//                 </tr>
//               ) : (
//                 imports.map((item) => {
//                   const id = getId(item);
//                   const status = item.Status || item.status;

//                   return (
//                     <tr
//                       key={id}
//                       onClick={() => navigate(`/admin/orders/import/${id}`)}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <td>{item.Code || item.code}</td>
//                       <td>{item.UserID || item.user_id}</td>
//                       <td style={{ color: getStatusColor(status) }}>
//                         {status}
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* EXPORT TABLE */}
//         <div className="stat-card" style={{ marginTop: 20 }}>
//           <h2>📤 Đơn xuất (Export)</h2>

//           <table style={{ width: "100%" }}>
//             <thead>
//               <tr>
//                 <th>Mã</th>
//                 <th>Người tạo</th>
//                 <th>Trạng thái</th>
//               </tr>
//             </thead>

//             <tbody>
//               {exports.length === 0 ? (
//                 <tr>
//                   <td colSpan={3} style={{ textAlign: "center" }}>
//                     Không có dữ liệu
//                   </td>
//                 </tr>
//               ) : (
//                 exports.map((item) => {
//                   const id = getId(item);
//                   const status = item.Status || item.status;

//                   return (
//                     <tr
//                       key={id}
//                       onClick={() => navigate(`/admin/orders/export/${id}`)}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <td>{item.Code || item.code}</td>
//                       <td>{item.UserID || item.user_id}</td>
//                       <td style={{ color: getStatusColor(status) }}>
//                         {status}
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//       </main>
//     </div>
//   );
// }



//bản xịn

// import { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../api/auth";

// export default function OrdersPage() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [imports, setImports] = useState<any[]>([]);
//   const [exports, setExports] = useState<any[]>([]);

//   // 🚀 Chuẩn hóa lấy ID dạng chữ thường theo JSON mới từ Go
//   const getId = (item: any) => item.id;

//   const fetchData = async () => {
//     try {
//       const [importRes, exportRes] = await Promise.all([
//         api.get("/api/orders/import"),
//         api.get("/api/orders/export"),
//       ]);

//       setImports(importRes.data || []);
//       setExports(exportRes.data || []);
//     } catch (err) {
//       console.error("Fetch orders error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate("/login", { replace: true });
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "DONE":
//         return "lime";
//       case "PROCESSING":
//         return "orange";
//       case "PENDING":
//         return "gray";
//       default:
//         return "black";
//     }
//   };

//   return (
//     <div className="dashboard-root">
//       {/* SIDEBAR */}
//       <aside className="sidebar">
//         <div className="sidebar-brand" onClick={() => navigate("/admin")}>
//           WareFlow
//         </div>

//         <nav className="sidebar-nav">
//           <Link to="/admin">Dashboard</Link>
//           <Link to="/admin/products">Sản phẩm</Link>
//           <Link to="/admin/inventory">Tồn kho</Link>
//           <Link className="active" to="/admin/orders">
//             Đơn hàng
//           </Link>
//         </nav>

//         <div className="sidebar-footer">
//           <div>{user?.username}</div>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       </aside>

//       {/* MAIN */}
//       <main className="dashboard-main">
//         <h1>📑 Quản lý đơn hàng</h1>

//         {/* BUTTONS */}
//         <div style={{ marginBottom: 20 }}>
//           <button onClick={() => navigate("/admin/orders/create-import")}>
//             + Tạo đơn nhập
//           </button>

//           <button
//             style={{ marginLeft: 10 }}
//             onClick={() => navigate("/admin/orders/create-export")}
//           >
//             + Tạo đơn xuất
//           </button>
//         </div>

//         {/* IMPORT TABLE */}
//         <div className="stat-card">
//           <h2>📥 Đơn nhập (Import)</h2>

//           <table style={{ width: "100%" }}>
//             <thead>
//               <tr>
//                 <th>Mã</th>
//                 <th>Người tạo</th>
//                 <th>Trạng thái</th>
//               </tr>
//             </thead>

//             <tbody>
//               {imports.length === 0 ? (
//                 <tr>
//                   <td colSpan={3} style={{ textAlign: "center" }}>
//                     Không có dữ liệu
//                   </td>
//                 </tr>
//               ) : (
//                 imports.map((item) => {
//                   const id = getId(item);
//                   const status = item.status; // 🚀 Chỉ cần .status chữ thường

//                   return (
//                     <tr
//                       key={id}
//                       onClick={() => navigate(`/admin/orders/import/${id}`)}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <td>{item.code}</td> {/* 🚀 Chỉ cần .code */}
//                       <td>{item.user_id}</td> {/* 🚀 Chỉ cần .user_id */}
//                       <td style={{ color: getStatusColor(status) }}>
//                         {status}
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* EXPORT TABLE */}
//         <div className="stat-card" style={{ marginTop: 20 }}>
//           <h2>📤 Đơn xuất (Export)</h2>

//           <table style={{ width: "100%" }}>
//             <thead>
//               <tr>
//                 <th>Mã</th>
//                 <th>Người tạo</th>
//                 <th>Trạng thái</th>
//               </tr>
//             </thead>

//             <tbody>
//               {exports.length === 0 ? (
//                 <tr>
//                   <td colSpan={3} style={{ textAlign: "center" }}>
//                     Không có dữ liệu
//                   </td>
//                 </tr>
//               ) : (
//                 exports.map((item) => {
//                   const id = getId(item);
//                   const status = item.status; // 🚀 Chỉ cần .status chữ thường

//                   return (
//                     <tr
//                       key={id}
//                       onClick={() => navigate(`/admin/orders/export/${id}`)}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <td>{item.code}</td> {/* 🚀 Chỉ cần .code */}
//                       <td>{item.user_id}</td> {/* 🚀 Chỉ cần .user_id */}
//                       <td style={{ color: getStatusColor(status) }}>
//                         {status}
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </main>
//     </div>
//   );
// }



//bản đổi giao diện 
// import { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../api/auth";

// export default function OrdersPage() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [imports, setImports] = useState<any[]>([]);
//   const [exports, setExports] = useState<any[]>([]);

//   const getId = (item: any) => item.id;

//   const fetchData = async () => {
//     try {
//       const [importRes, exportRes] = await Promise.all([
//         api.get("/api/orders/import"),
//         api.get("/api/orders/export"),
//       ]);
//       setImports(importRes.data || []);
//       setExports(exportRes.data || []);
//     } catch (err) {
//       console.error("Fetch orders error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate("/login", { replace: true });
//   };

//   // Helper render Badge trạng thái phát sáng (Glow Effect) cực chất
//   const renderStatusBadge = (status: string) => {
//     let bg = "rgba(107, 114, 128, 0.1)";
//     let color = "var(--text-secondary)";

//     if (status === "DONE") {
//       bg = "rgba(16, 185, 129, 0.1)";
//       color = "#10B981";
//     } else if (status === "PROCESSING") {
//       bg = "rgba(245, 158, 11, 0.1)";
//       color = "#F59E0B";
//     } else if (status === "CANCELLED") {
//       bg = "rgba(239, 68, 68, 0.1)";
//       color = "#EF4444";
//     }

//     return (
//       <span style={{
//         display: "inline-flex",
//         alignItems: "center",
//         gap: "6px",
//         background: bg,
//         color: color,
//         padding: "4px 10px",
//         borderRadius: "12px",
//         fontSize: "12px",
//         fontWeight: 600,
//         letterSpacing: "0.5px"
//       }}>
//         <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: color }}></span>
//         {status}
//       </span>
//     );
//   };

//   return (
//     <div className="dashboard-root">
      
//       {/* ── SIDEBAR ĐÃ ĐỒNG BỘ MẦU SẮC CAO CẤP ────────────────── */}
//       <aside className="sidebar">
//         <div className="sidebar-brand" onClick={() => navigate("/admin")}>
//           WareFlow
//         </div>

//         <nav className="sidebar-nav">
//           <Link to="/admin">Dashboard</Link>
//           <Link to="/admin/products">Sản phẩm</Link>
//           <Link to="/admin/inventory">Tồn kho</Link>
//           <Link className="active" to="/admin/orders">Đơn hàng</Link>
//         </nav>

//         <div className="sidebar-footer">
//           <div style={{ fontWeight: 500 }}>{user?.username || "Nguyễn Huy An"}</div>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       </aside>

//       {/* ── PHẦN KHÔNG GIAN CHÍNH (MAIN DASHBOARD) ────────────────── */}
//       <main className="dashboard-main" style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        
//         {/* Tiêu đề trang & Nút bấm tác vụ */}
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexShrink: 0 }}>
//           <div>
//             <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
//               📑 Quản lý đơn hàng
//             </h1>
//             <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
//               Theo dõi, điều phối luồng sản phẩm nhập kho và xuất kho quy chuẩn
//             </p>
//           </div>

//           {/* Cụm nút bấm hành động chuẩn UI */}
//           <div style={{ display: "flex", gap: "12px" }}>
//             <button 
//               onClick={() => navigate("/admin/orders/create-import")}
//               style={{
//                 background: "#4F46E5", color: "var(--text-primary)", border: "none", padding: "10px 18px",
//                 borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
//               }}
//             >
//               📥 Tạo đơn nhập
//             </button>
//             <button
//               onClick={() => navigate("/admin/orders/create-export")}
//               style={{
//                 background: "var(--border)", color: "var(--text-primary)", border: "1px solid var(--border)",
//                 padding: "10px 18px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
//               }}
//             >
//               📤 Tạo đơn xuất
//             </button>
//           </div>
//         </div>

//         {/* ── LAYOUT 2 CỘT SONG SONG ĐẸP MẮT ────────────────── */}
//         <div style={{ display: "flex", gap: "20px", flex: 1, minHeight: 0, marginBottom: "20px" }}>
          
//           {/* CỘT TRÁI: ĐƠN NHẬP KHO */}
//           <div className="stat-card" style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px", minWidth: 0 }}>
//             <h2 style={{ fontSize: "18px", color: "var(--text-primary)", fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
//               <span>📥</span> Đơn nhập (Import)
//             </h2>
            
//             <div style={{ flex: 1, overflowY: "auto", width: "100%", paddingRight: "4px" }} className="custom-scroll">
//               <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
//                 <thead>
//                   <tr style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.01)" }}>
//                     <th style={{ padding: "12px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Mã đơn</th>
//                     <th style={{ padding: "12px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Người tạo</th>
//                     <th style={{ padding: "12px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", textAlign: "center" }}>Trạng thái</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {imports.length === 0 ? (
//                     <tr>
//                       <td colSpan={3} style={{ textAlign: "center", padding: "30px", color: "var(--text-secondary)", fontSize: "14px" }}>Không có dữ liệu đơn nhập</td>
//                     </tr>
//                   ) : (
//                     imports.map((item) => {
//                       const id = getId(item);
//                       return (
//                         <tr
//                           key={id}
//                           onClick={() => navigate(`/admin/orders/import/${id}`)}
//                           style={{ cursor: "pointer", borderBottom: "1px solid rgba(255, 255, 255, 0.04)", transition: "all 0.2s" }}
//                           className="table-row-hover"
//                         >
//                           <td style={{ padding: "14px 12px" }}>
//                             <span style={{ fontFamily: "monospace", color: "#38BDF8", background: "rgba(56, 189, 248, 0.08)", padding: "4px 8px", borderRadius: "4px", fontSize: "13px" }}>
//                               {item.code}
//                             </span>
//                           </td>
//                           <td style={{ padding: "14px 12px", color: "#E5E7EB", fontSize: "14px" }}>ID: {item.user_id}</td>
//                           <td style={{ padding: "14px 12px", textAlign: "center" }}>{renderStatusBadge(item.status)}</td>
//                         </tr>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* CỘT PHẢI: ĐƠN XUẤT KHO */}
//           <div className="stat-card" style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px", minWidth: 0 }}>
//             <h2 style={{ fontSize: "18px", color: "var(--text-primary)", fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
//               <span>📤</span> Đơn xuất (Export)
//             </h2>

//             <div style={{ flex: 1, overflowY: "auto", width: "100%", paddingRight: "4px" }} className="custom-scroll">
//               <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
//                 <thead>
//                   <tr style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.01)" }}>
//                     <th style={{ padding: "12px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Mã đơn</th>
//                     <th style={{ padding: "12px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Người tạo</th>
//                     <th style={{ padding: "12px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", textAlign: "center" }}>Trạng thái</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {exports.length === 0 ? (
//                     <tr>
//                       <td colSpan={3} style={{ textAlign: "center", padding: "30px", color: "var(--text-secondary)", fontSize: "14px" }}>Không có dữ liệu đơn xuất</td>
//                     </tr>
//                   ) : (
//                     exports.map((item) => {
//                       const id = getId(item);
//                       return (
//                         <tr
//                           key={id}
//                           onClick={() => navigate(`/admin/orders/export/${id}`)}
//                           style={{ cursor: "pointer", borderBottom: "1px solid rgba(255, 255, 255, 0.04)", transition: "all 0.2s" }}
//                           className="table-row-hover"
//                         >
//                           <td style={{ padding: "14px 12px" }}>
//                             <span style={{ fontFamily: "monospace", color: "#A78BFA", background: "rgba(167, 139, 250, 0.08)", padding: "4px 8px", borderRadius: "4px", fontSize: "13px" }}>
//                               {item.code}
//                             </span>
//                           </td>
//                           <td style={{ padding: "14px 12px", color: "#E5E7EB", fontSize: "14px" }}>ID: {item.user_id}</td>
//                           <td style={{ padding: "14px 12px", textAlign: "center" }}>{renderStatusBadge(item.status)}</td>
//                         </tr>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//         </div>
//       </main>

//       {/* Inject CSS Inline nâng cao trải nghiệm chuột */}
//       <style>{`
//         .table-row-hover:hover {
//           background: rgba(255, 255, 255, 0.03) !important;
//         }
//         .custom-scroll::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scroll::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scroll::-webkit-scrollbar-thumb {
//           background: var(--border);
//           border-radius: 10px;
//         }
//         .custom-scroll::-webkit-scrollbar-thumb:hover {
//           background: rgba(255, 255, 255, 0.2);
//         }
//       `}</style>
//     </div>
//   );
// }


//thêm cột created_at vào bảng OrdersPage
// import { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../api/auth";
// import AdminLayout from "./AdminLayout";

// export default function OrdersPage() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [imports, setImports] = useState<any[]>([]);
//   const [exports, setExports] = useState<any[]>([]);

//   const getId = (item: any) => item.id;

//   const fetchData = async () => {
//     try {
//       const [importRes, exportRes] = await Promise.all([
//         api.get("/api/orders/import"),
//         api.get("/api/orders/export"),
//       ]);
//       setImports(importRes.data || []);
//       setExports(exportRes.data || []);
//     } catch (err) {
//       console.error("Fetch orders error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const formatDate = (dateStr: string) => {
//     if (!dateStr) return "—";
//     const date = new Date(dateStr);
//     return date.toLocaleDateString("vi-VN", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     });
//   };

//   const renderStatusBadge = (status: string) => {
//     let bg = "rgba(107, 114, 128, 0.1)";
//     let color = "var(--text-secondary)";
//     if (status === "DONE") {
//       bg = "rgba(16, 185, 129, 0.1)";
//       color = "#10B981";
//     } else if (status === "PROCESSING") {
//       bg = "rgba(245, 158, 11, 0.1)";
//       color = "#F59E0B";
//     } else if (status === "CANCELLED") {
//       bg = "rgba(239, 68, 68, 0.1)";
//       color = "#EF4444";
//     }
//     return (
//       <span
//         style={{
//           display: "inline-flex",
//           alignItems: "center",
//           gap: "6px",
//           background: bg,
//           color: color,
//           padding: "4px 10px",
//           borderRadius: "12px",
//           fontSize: "12px",
//           fontWeight: 600,
//           letterSpacing: "0.5px",
//         }}
//       >
//         <span
//           style={{
//             width: "6px",
//             height: "6px",
//             borderRadius: "50%",
//             background: color,
//           }}
//         />
//         {status}
//       </span>
//     );
//   };

//   // 👇 Tên hiển thị cho cột "Người tạo" – lấy từ context auth
//   const displayName = user?.username ? `${user.username} (Admin)` : "Administrator";

//   return (
//     <AdminLayout>
//         {/* Header */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "24px",
//             flexShrink: 0,
//           }}
//         >
//           <div>
//             <h1
//               style={{
//                 fontSize: "28px",
//                 fontWeight: 700,
//                 color: "var(--text-primary)",
//                 marginBottom: "4px",
//               }}
//             >
//               📑 Quản lý đơn hàng
//             </h1>
//             <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
//               Theo dõi, điều phối luồng sản phẩm nhập kho và xuất kho quy chuẩn
//             </p>
//           </div>
//           <div style={{ display: "flex", gap: "12px" }}>
//             <button
//               onClick={() => navigate("/admin/orders/create-import")}
//               style={{
//                 background: "#4F46E5",
//                 color: "var(--text-primary)",
//                 border: "none",
//                 padding: "10px 18px",
//                 borderRadius: "8px",
//                 fontSize: "14px",
//                 fontWeight: 600,
//                 cursor: "pointer",
//               }}
//             >
//               📥 Tạo đơn nhập
//             </button>
//             <button
//               onClick={() => navigate("/admin/orders/create-export")}
//               style={{
//                 background: "var(--border)",
//                 color: "var(--text-primary)",
//                 border: "1px solid var(--border)",
//                 padding: "10px 18px",
//                 borderRadius: "8px",
//                 fontSize: "14px",
//                 fontWeight: 600,
//                 cursor: "pointer",
//               }}
//             >
//               📤 Tạo đơn xuất
//             </button>
//           </div>
//         </div>

//         {/* 2 cột: Import + Export */}
//         <div
//           style={{
//             display: "flex",
//             gap: "20px",
//             flex: 1,
//             minHeight: 0,
//             marginBottom: "20px",
//           }}
//         >
//           {/* IMPORT TABLE */}
//           <div
//             className="stat-card"
//             style={{
//               flex: 1,
//               display: "flex",
//               flexDirection: "column",
//               background: "var(--bg-elevated)",
//               border: "1px solid var(--border)",
//               borderRadius: "14px",
//               padding: "20px",
//               minWidth: 0,
//             }}
//           >
//             <h2
//               style={{
//                 fontSize: "18px",
//                 color: "var(--text-primary)",
//                 fontWeight: 600,
//                 marginBottom: "16px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//               }}
//             >
//               <span>📥</span> Đơn nhập (Import)
//             </h2>
//             <div
//               style={{
//                 flex: 1,
//                 overflowY: "auto",
//                 width: "100%",
//                 paddingRight: "4px",
//               }}
//               className="custom-scroll"
//             >
//               <table
//                 style={{
//                   width: "100%",
//                   borderCollapse: "collapse",
//                   textAlign: "left",
//                 }}
//               >
//                 <thead>
//                   <tr
//                     style={{
//                       borderBottom: "1px solid var(--border)",
//                       background: "rgba(255,255,255,0.01)",
//                     }}
//                   >
//                     <th
//                       style={{
//                         padding: "12px",
//                         color: "var(--text-secondary)",
//                         fontSize: "12px",
//                         fontWeight: 600,
//                         textTransform: "uppercase",
//                       }}
//                     >
//                       Mã đơn
//                     </th>
//                     <th
//                       style={{
//                         padding: "12px",
//                         color: "var(--text-secondary)",
//                         fontSize: "12px",
//                         fontWeight: 600,
//                         textTransform: "uppercase",
//                       }}
//                     >
//                       Người tạo
//                     </th>
//                     <th
//                       style={{
//                         padding: "12px",
//                         color: "var(--text-secondary)",
//                         fontSize: "12px",
//                         fontWeight: 600,
//                         textTransform: "uppercase",
//                       }}
//                     >
//                       Ngày tạo
//                     </th>
//                     <th
//                       style={{
//                         padding: "12px",
//                         color: "var(--text-secondary)",
//                         fontSize: "12px",
//                         fontWeight: 600,
//                         textTransform: "uppercase",
//                         textAlign: "center",
//                       }}
//                     >
//                       Trạng thái
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {imports.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan={4}
//                         style={{
//                           textAlign: "center",
//                           padding: "30px",
//                           color: "var(--text-secondary)",
//                           fontSize: "14px",
//                         }}
//                       >
//                         Không có dữ liệu đơn nhập
//                       </td>
//                     </tr>
//                   ) : (
//                     imports.map((item) => {
//                       const id = getId(item);
//                       return (
//                         <tr
//                           key={id}
//                           onClick={() =>
//                             navigate(`/admin/orders/import/${id}`)
//                           }
//                           style={{
//                             cursor: "pointer",
//                             borderBottom:
//                               "1px solid rgba(255, 255, 255, 0.04)",
//                           }}
//                           className="table-row-hover"
//                         >
//                           <td style={{ padding: "14px 12px" }}>
//                             <span
//                               style={{
//                                 fontFamily: "monospace",
//                                 color: "#38BDF8",
//                                 background: "rgba(56, 189, 248, 0.08)",
//                                 padding: "4px 8px",
//                                 borderRadius: "4px",
//                                 fontSize: "13px",
//                               }}
//                             >
//                               {item.code}
//                             </span>
//                           </td>
//                           {/* 👇 Hiển thị tên admin đang đăng nhập */}
//                           <td
//                             style={{
//                               padding: "14px 12px",
//                               color: "#E5E7EB",
//                               fontSize: "14px",
//                             }}
//                           >
//                             {displayName}
//                           </td>
//                           <td
//                             style={{
//                               padding: "14px 12px",
//                               color: "#E5E7EB",
//                               fontSize: "14px",
//                             }}
//                           >
//                             {formatDate(item.created_at)}
//                           </td>
//                           <td
//                             style={{
//                               padding: "14px 12px",
//                               textAlign: "center",
//                             }}
//                           >
//                             {renderStatusBadge(item.status)}
//                           </td>
//                         </tr>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* EXPORT TABLE */}
//           <div
//             className="stat-card"
//             style={{
//               flex: 1,
//               display: "flex",
//               flexDirection: "column",
//               background: "var(--bg-elevated)",
//               border: "1px solid var(--border)",
//               borderRadius: "14px",
//               padding: "20px",
//               minWidth: 0,
//             }}
//           >
//             <h2
//               style={{
//                 fontSize: "18px",
//                 color: "var(--text-primary)",
//                 fontWeight: 600,
//                 marginBottom: "16px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//               }}
//             >
//               <span>📤</span> Đơn xuất (Export)
//             </h2>
//             <div
//               style={{
//                 flex: 1,
//                 overflowY: "auto",
//                 width: "100%",
//                 paddingRight: "4px",
//               }}
//               className="custom-scroll"
//             >
//               <table
//                 style={{
//                   width: "100%",
//                   borderCollapse: "collapse",
//                   textAlign: "left",
//                 }}
//               >
//                 <thead>
//                   <tr
//                     style={{
//                       borderBottom: "1px solid var(--border)",
//                       background: "rgba(255,255,255,0.01)",
//                     }}
//                   >
//                     <th
//                       style={{
//                         padding: "12px",
//                         color: "var(--text-secondary)",
//                         fontSize: "12px",
//                         fontWeight: 600,
//                         textTransform: "uppercase",
//                       }}
//                     >
//                       Mã đơn
//                     </th>
//                     <th
//                       style={{
//                         padding: "12px",
//                         color: "var(--text-secondary)",
//                         fontSize: "12px",
//                         fontWeight: 600,
//                         textTransform: "uppercase",
//                       }}
//                     >
//                       Người tạo
//                     </th>
//                     <th
//                       style={{
//                         padding: "12px",
//                         color: "var(--text-secondary)",
//                         fontSize: "12px",
//                         fontWeight: 600,
//                         textTransform: "uppercase",
//                       }}
//                     >
//                       Ngày tạo
//                     </th>
//                     <th
//                       style={{
//                         padding: "12px",
//                         color: "var(--text-secondary)",
//                         fontSize: "12px",
//                         fontWeight: 600,
//                         textTransform: "uppercase",
//                         textAlign: "center",
//                       }}
//                     >
//                       Trạng thái
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {exports.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan={4}
//                         style={{
//                           textAlign: "center",
//                           padding: "30px",
//                           color: "var(--text-secondary)",
//                           fontSize: "14px",
//                         }}
//                       >
//                         Không có dữ liệu đơn xuất
//                       </td>
//                     </tr>
//                   ) : (
//                     exports.map((item) => {
//                       const id = getId(item);
//                       return (
//                         <tr
//                           key={id}
//                           onClick={() =>
//                             navigate(`/admin/orders/export/${id}`)
//                           }
//                           style={{
//                             cursor: "pointer",
//                             borderBottom:
//                               "1px solid rgba(255, 255, 255, 0.04)",
//                           }}
//                           className="table-row-hover"
//                         >
//                           <td style={{ padding: "14px 12px" }}>
//                             <span
//                               style={{
//                                 fontFamily: "monospace",
//                                 color: "#A78BFA",
//                                 background: "rgba(167, 139, 250, 0.08)",
//                                 padding: "4px 8px",
//                                 borderRadius: "4px",
//                                 fontSize: "13px",
//                               }}
//                             >
//                               {item.code}
//                             </span>
//                           </td>
//                           {/* 👇 Hiển thị tên admin đang đăng nhập */}
//                           <td
//                             style={{
//                               padding: "14px 12px",
//                               color: "#E5E7EB",
//                               fontSize: "14px",
//                             }}
//                           >
//                             {displayName}
//                           </td>
//                           <td
//                             style={{
//                               padding: "14px 12px",
//                               color: "#E5E7EB",
//                               fontSize: "14px",
//                             }}
//                           >
//                             {formatDate(item.created_at)}
//                           </td>
//                           <td
//                             style={{
//                               padding: "14px 12px",
//                               textAlign: "center",
//                             }}
//                           >
//                             {renderStatusBadge(item.status)}
//                           </td>
//                         </tr>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//       <style>{`
//         .table-row-hover:hover {
//           background: rgba(255, 255, 255, 0.03) !important;
//         }
//         .custom-scroll::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scroll::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scroll::-webkit-scrollbar-thumb {
//           background: var(--border);
//           border-radius: 10px;
//         }
//         .custom-scroll::-webkit-scrollbar-thumb:hover {
//           background: rgba(255, 255, 255, 0.2);
//         }
//       `}</style>
//     </AdminLayout>
//   );
// }

//bản sửa giao diện
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/auth";
import AdminLayout from "./AdminLayout";

type StatusFilter = "ALL" | "DONE" | "PROCESSING" | "PENDING" | "CANCELLED" | "APPROVED";

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [imports, setImports] = useState<any[]>([]);
  const [exports, setExports] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"import" | "export">("import");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      const [importRes, exportRes] = await Promise.all([
        api.get("/api/orders/import"),
        api.get("/api/orders/export"),
      ]);
      setImports(importRes.data || []);
      setExports(exportRes.data || []);
    } catch (err) {
      console.error("Fetch orders error:", err);
    }
  };

  useEffect(() => {
    // Read tab, status filter, and search term from URL query parameter on mount
    const tabParam = searchParams.get("tab");
    const statusParam = searchParams.get("status") as StatusFilter;
    const searchParam = searchParams.get("search");

    if (tabParam === "import" || tabParam === "export") {
      setActiveTab(tabParam);
    }
    if (statusParam && ["ALL", "DONE", "PROCESSING", "PENDING", "CANCELLED", "APPROVED"].includes(statusParam)) {
      setStatusFilter(statusParam);
    }
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    fetchData();
  }, [searchParams]);

  const handleTabChange = (tab: "import" | "export") => {
    setActiveTab(tab);
    setStatusFilter("ALL");
    // Update URL query parameter to persist tab state
    setSearchParams({ tab, status: "ALL", search: searchTerm });
  };

  const handleStatusFilterChange = (status: StatusFilter) => {
    setStatusFilter(status);
    // Update URL query parameter to persist status filter state
    setSearchParams({ tab: activeTab, status, search: searchTerm });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  };

  const statusConfig: Record<string, { bg: string; color: string }> = {
    DONE:       { bg: "rgba(16,185,129,0.1)",  color: "#10B981" },
    PROCESSING: { bg: "rgba(245,158,11,0.1)",  color: "#F59E0B" },
    PENDING:    { bg: "rgba(99,102,241,0.1)",  color: "#818CF8" },
    CANCELLED:  { bg: "rgba(239,68,68,0.1)",   color: "#EF4444" },
    APPROVED:   { bg: "rgba(59,130,246,0.1)",  color: "#3B82F6" },
  };

  const renderStatusBadge = (status: string) => {
    const cfg = statusConfig[status] || { bg: "rgba(107,114,128,0.1)", color: "var(--text-secondary)" };
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        background: cfg.bg, color: cfg.color,
        padding: "4px 10px", borderRadius: "12px",
        fontSize: "12px", fontWeight: 600, letterSpacing: "0.5px",
      }}>
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: cfg.color }} />
        {status}
      </span>
    );
  };

  const displayName = user?.username ? `${user.username} (Admin)` : "Administrator";
  const rawData = activeTab === "import" ? imports : exports;

  // Sắp xếp mới nhất lên đầu
  const sortedData = [...rawData].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Filter theo status
  let filteredData = statusFilter === "ALL"
    ? sortedData
    : sortedData.filter(item => item.status === statusFilter);

  // Filter theo tên sản phẩm
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filteredData = filteredData.filter(item => {
      // Check if order has items and filter by product name
      if (item.items && Array.isArray(item.items)) {
        return item.items.some((item: any) =>
          item.product && item.product.name && item.product.name.toLowerCase().includes(term)
        );
      }
      // Also check order code
      return item.code && item.code.toLowerCase().includes(term);
    });
  }

  const countByStatus = (status: string) => rawData.filter(i => i.status === status).length;

  const statusTabs: { key: StatusFilter; label: string; color: string }[] = [
    { key: "ALL",        label: "Tất cả",      color: "var(--text-primary)" },
    { key: "DONE",       label: "Hoàn thành scan",  color: "#10B981" },
    { key: "PROCESSING", label: "Đang scan",  color: "#F59E0B" },
    { key: "PENDING",    label: "Chờ scan",   color: "#818CF8" },
    { key: "CANCELLED",  label: "Đã hủy",      color: "#EF4444" },
    { key: "APPROVED",   label: "Đã duyệt",    color: "#3B82F6" },
  ];

  const statusCount: Record<StatusFilter, number> = {
    ALL:        rawData.length,
    DONE:       countByStatus("DONE"),
    PROCESSING: countByStatus("PROCESSING"),
    PENDING:    countByStatus("PENDING"),
    CANCELLED:  countByStatus("CANCELLED"),
    APPROVED:   countByStatus("APPROVED"),
  };

  return (
    <AdminLayout>
      <style>{`
        .orders-scroll::-webkit-scrollbar { width: 5px; }
        .orders-scroll::-webkit-scrollbar-track { background: transparent; }
        .orders-scroll::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
        .orders-scroll::-webkit-scrollbar-thumb:hover { background: #4B5563; }
        .orders-scroll { scrollbar-width: thin; scrollbar-color: #374151 transparent; }
        .order-row:hover { background: rgba(255,255,255,0.04) !important; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
            📑 Quản lý đơn hàng
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Theo dõi, điều phối luồng sản phẩm nhập kho và xuất kho quy chuẩn
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => navigate("/admin/orders/create-import")}
            style={{
              background: "#4F46E5", color: "var(--text-primary)", border: "none",
              padding: "10px 18px", borderRadius: "8px", fontSize: "14px",
              fontWeight: 600, cursor: "pointer",
            }}
          >
            📥 Tạo đơn nhập
          </button>
          <button
            onClick={() => navigate("/admin/orders/create-export")}
            style={{
              background: "var(--border)", color: "var(--text-primary)",
              border: "1px solid var(--border)",
              padding: "10px 18px", borderRadius: "8px", fontSize: "14px",
              fontWeight: 600, cursor: "pointer",
            }}
          >
            📤 Tạo đơn xuất
          </button>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}>🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sản phẩm hoặc mã đơn..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSearchParams({ tab: activeTab, status: statusFilter, search: e.target.value });
            }}
            style={{
              width: "100%",
              padding: "12px 16px 12px 40px",
              background: "var(--bg-overlay)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              color: "var(--text-primary)",
              fontSize: "14px",
              outline: "none",
            }}
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSearchParams({ tab: activeTab, status: statusFilter, search: "" });
              }}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "var(--border)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontSize: "12px",
                padding: "4px 8px",
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Tab nhập / xuất + Sub status bar (liền nhau) ── */}
      <div style={{ background: "var(--bg-elevated)", borderRadius: "12px", marginBottom: "20px", overflow: "hidden", border: "1px solid var(--border)" }}>

        {/* Row 1: Tab nhập / xuất */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
          {(["import", "export"] as const).map((tab) => {
            const isActive = activeTab === tab;
            const label = tab === "import" ? "📥 Đơn nhập" : "📤 Đơn xuất";
            const count = tab === "import" ? imports.length : exports.length;
            const activeColor = tab === "import" ? "#6366F1" : "#8B5CF6";
            return (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                style={{
                  flex: 1,
                  padding: "14px 20px",
                  border: "none",
                  borderBottom: isActive ? `2px solid ${activeColor}` : "2px solid transparent",
                  background: isActive ? `${activeColor}11` : "transparent",
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  fontSize: "14px", fontWeight: 600, cursor: "pointer",
                  transition: "all 0.15s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                }}
              >
                {label}
                <span style={{
                  background: isActive ? `${activeColor}33` : "rgba(107,114,128,0.15)",
                  color: isActive ? activeColor === "#6366F1" ? "#818CF8" : "#A78BFA" : "var(--text-secondary)",
                  padding: "2px 8px", borderRadius: "10px", fontSize: "12px", fontWeight: 600,
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Status filter bar */}
        <div style={{ display: "flex", overflowX: "auto", padding: "0 4px", justifyContent: "space-around" }}>
          {statusTabs.map((s) => {
            const isActive = statusFilter === s.key;
            return (
              <button
                key={s.key}
                onClick={() => handleStatusFilterChange(s.key)}
                style={{
                  padding: "12px 20px",
                  border: "none",
                  borderBottom: isActive ? `2px solid ${s.color}` : "2px solid transparent",
                  background: "transparent",
                  color: isActive ? s.color : "var(--text-secondary)",
                  fontSize: "13px", fontWeight: isActive ? 600 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: "7px",
                  whiteSpace: "nowrap",
                }}
              >
                {s.label}
                <span style={{
                  background: isActive ? `${s.color}22` : "rgba(107,114,128,0.1)",
                  color: isActive ? s.color : "var(--text-secondary)",
                  padding: "1px 7px", borderRadius: "10px", fontSize: "11px", fontWeight: 600,
                }}>
                  {statusCount[s.key]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="stat-card" style={{ display: "block", padding: "0", overflow: "hidden" }}>
        {/* Card header */}
        <div style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: "10px",
        }}>
          <span style={{ fontSize: "15px" }}>{activeTab === "import" ? "📥" : "📤"}</span>
          <span style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "14px" }}>
            {activeTab === "import" ? "Danh sách đơn nhập" : "Danh sách đơn xuất"}
            {statusFilter !== "ALL" && (
              <span style={{ color: "var(--text-secondary)", fontWeight: 400, fontSize: "13px", marginLeft: "8px" }}>
                — {statusTabs.find(s => s.key === statusFilter)?.label}
              </span>
            )}
          </span>
          <span style={{
            marginLeft: "auto",
            background: activeTab === "import" ? "rgba(79,70,229,0.15)" : "rgba(124,58,237,0.15)",
            color: activeTab === "import" ? "#818CF8" : "#A78BFA",
            padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: 600,
          }}>
            {filteredData.length} đơn
          </span>
        </div>

        <div className="orders-scroll" style={{ maxHeight: "480px", overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
              <tr style={{ background: "var(--bg-overlay)", borderBottom: "1px solid var(--bg-elevated)" }}>
                <th style={{ padding: "13px 20px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", width: "25%" }}>Mã đơn</th>
                <th style={{ padding: "13px 20px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", width: "25%" }}>Người tạo</th>
                <th style={{ padding: "13px 20px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", width: "25%" }}>Ngày tạo</th>
                <th style={{ padding: "13px 20px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", textAlign: "center", width: "25%" }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "48px", color: "var(--text-secondary)", fontSize: "14px" }}>
                    Không có đơn nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="order-row"
                    onClick={() => navigate(`/admin/orders/${activeTab}/${item.id}`)}
                    style={{
                      cursor: "pointer",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      background: index % 2 === 0 ? "transparent" : "rgba(31,41,55,0.3)",
                    }}
                  >
                    <td style={{ padding: "15px 20px" }}>
                      <span style={{
                        fontFamily: "monospace",
                        color: activeTab === "import" ? "#38BDF8" : "#A78BFA",
                        background: activeTab === "import" ? "rgba(56,189,248,0.08)" : "rgba(167,139,250,0.08)",
                        padding: "4px 10px", borderRadius: "4px", fontSize: "13px",
                      }}>
                        {item.code}
                      </span>
                    </td>
                    <td style={{ padding: "15px 20px", color: "#E5E7EB" }}>{displayName}</td>
                    <td style={{ padding: "15px 20px", color: "#E5E7EB" }}>{formatDate(item.created_at)}</td>
                    <td style={{ padding: "15px 20px", textAlign: "center" }}>
                      {renderStatusBadge(item.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}