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
//     let color = "#9CA3AF";

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
//             <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>
//               📑 Quản lý đơn hàng
//             </h1>
//             <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
//               Theo dõi, điều phối luồng sản phẩm nhập kho và xuất kho quy chuẩn
//             </p>
//           </div>

//           {/* Cụm nút bấm hành động chuẩn UI */}
//           <div style={{ display: "flex", gap: "12px" }}>
//             <button 
//               onClick={() => navigate("/admin/orders/create-import")}
//               style={{
//                 background: "#4F46E5", color: "#fff", border: "none", padding: "10px 18px",
//                 borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
//               }}
//             >
//               📥 Tạo đơn nhập
//             </button>
//             <button
//               onClick={() => navigate("/admin/orders/create-export")}
//               style={{
//                 background: "rgba(255, 255, 255, 0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)",
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
//           <div className="stat-card" style={{ flex: 1, display: "flex", flexDirection: "column", background: "#1F2937", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "20px", minWidth: 0 }}>
//             <h2 style={{ fontSize: "18px", color: "#fff", fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
//               <span>📥</span> Đơn nhập (Import)
//             </h2>
            
//             <div style={{ flex: 1, overflowY: "auto", width: "100%", paddingRight: "4px" }} className="custom-scroll">
//               <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
//                 <thead>
//                   <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", background: "rgba(255,255,255,0.01)" }}>
//                     <th style={{ padding: "12px", color: "#9CA3AF", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Mã đơn</th>
//                     <th style={{ padding: "12px", color: "#9CA3AF", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Người tạo</th>
//                     <th style={{ padding: "12px", color: "#9CA3AF", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", textAlign: "center" }}>Trạng thái</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {imports.length === 0 ? (
//                     <tr>
//                       <td colSpan={3} style={{ textAlign: "center", padding: "30px", color: "#6B7280", fontSize: "14px" }}>Không có dữ liệu đơn nhập</td>
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
//           <div className="stat-card" style={{ flex: 1, display: "flex", flexDirection: "column", background: "#1F2937", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "20px", minWidth: 0 }}>
//             <h2 style={{ fontSize: "18px", color: "#fff", fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
//               <span>📤</span> Đơn xuất (Export)
//             </h2>

//             <div style={{ flex: 1, overflowY: "auto", width: "100%", paddingRight: "4px" }} className="custom-scroll">
//               <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
//                 <thead>
//                   <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", background: "rgba(255,255,255,0.01)" }}>
//                     <th style={{ padding: "12px", color: "#9CA3AF", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Mã đơn</th>
//                     <th style={{ padding: "12px", color: "#9CA3AF", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Người tạo</th>
//                     <th style={{ padding: "12px", color: "#9CA3AF", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", textAlign: "center" }}>Trạng thái</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {exports.length === 0 ? (
//                     <tr>
//                       <td colSpan={3} style={{ textAlign: "center", padding: "30px", color: "#6B7280", fontSize: "14px" }}>Không có dữ liệu đơn xuất</td>
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
//           background: rgba(255, 255, 255, 0.1);
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
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/auth";

export default function OrdersPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [imports, setImports] = useState<any[]>([]);
  const [exports, setExports] = useState<any[]>([]);

  const getId = (item: any) => item.id;

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
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderStatusBadge = (status: string) => {
    let bg = "rgba(107, 114, 128, 0.1)";
    let color = "#9CA3AF";
    if (status === "DONE") {
      bg = "rgba(16, 185, 129, 0.1)";
      color = "#10B981";
    } else if (status === "PROCESSING") {
      bg = "rgba(245, 158, 11, 0.1)";
      color = "#F59E0B";
    } else if (status === "CANCELLED") {
      bg = "rgba(239, 68, 68, 0.1)";
      color = "#EF4444";
    }
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          background: bg,
          color: color,
          padding: "4px 10px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.5px",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: color,
          }}
        />
        {status}
      </span>
    );
  };

  // 👇 Tên hiển thị cho cột "Người tạo" – lấy từ context auth
  const displayName = user?.username ? `${user.username} (Admin)` : "Administrator";

  return (
    <div className="dashboard-root">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand" onClick={() => navigate("/admin")}>
          WareFlow
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/products">Sản phẩm</Link>
          <Link to="/admin/inventory">Tồn kho</Link>
          <Link className="active" to="/admin/orders">
            Đơn hàng
          </Link>
        </nav>
        <div className="sidebar-footer">
          <div style={{ fontWeight: 500 }}>{user?.username || "Nguyễn Huy An"}</div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main
        className="dashboard-main"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            flexShrink: 0,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#fff",
                marginBottom: "4px",
              }}
            >
              📑 Quản lý đơn hàng
            </h1>
            <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
              Theo dõi, điều phối luồng sản phẩm nhập kho và xuất kho quy chuẩn
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => navigate("/admin/orders/create-import")}
              style={{
                background: "#4F46E5",
                color: "#fff",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              📥 Tạo đơn nhập
            </button>
            <button
              onClick={() => navigate("/admin/orders/create-export")}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "10px 18px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              📤 Tạo đơn xuất
            </button>
          </div>
        </div>

        {/* 2 cột: Import + Export */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            flex: 1,
            minHeight: 0,
            marginBottom: "20px",
          }}
        >
          {/* IMPORT TABLE */}
          <div
            className="stat-card"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              background: "#1F2937",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px",
              padding: "20px",
              minWidth: 0,
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                color: "#fff",
                fontWeight: 600,
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>📥</span> Đơn nhập (Import)
            </h2>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                width: "100%",
                paddingRight: "4px",
              }}
              className="custom-scroll"
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                      background: "rgba(255,255,255,0.01)",
                    }}
                  >
                    <th
                      style={{
                        padding: "12px",
                        color: "#9CA3AF",
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      Mã đơn
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        color: "#9CA3AF",
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      Người tạo
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        color: "#9CA3AF",
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      Ngày tạo
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        color: "#9CA3AF",
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        textAlign: "center",
                      }}
                    >
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {imports.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          textAlign: "center",
                          padding: "30px",
                          color: "#6B7280",
                          fontSize: "14px",
                        }}
                      >
                        Không có dữ liệu đơn nhập
                      </td>
                    </tr>
                  ) : (
                    imports.map((item) => {
                      const id = getId(item);
                      return (
                        <tr
                          key={id}
                          onClick={() =>
                            navigate(`/admin/orders/import/${id}`)
                          }
                          style={{
                            cursor: "pointer",
                            borderBottom:
                              "1px solid rgba(255, 255, 255, 0.04)",
                          }}
                          className="table-row-hover"
                        >
                          <td style={{ padding: "14px 12px" }}>
                            <span
                              style={{
                                fontFamily: "monospace",
                                color: "#38BDF8",
                                background: "rgba(56, 189, 248, 0.08)",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "13px",
                              }}
                            >
                              {item.code}
                            </span>
                          </td>
                          {/* 👇 Hiển thị tên admin đang đăng nhập */}
                          <td
                            style={{
                              padding: "14px 12px",
                              color: "#E5E7EB",
                              fontSize: "14px",
                            }}
                          >
                            {displayName}
                          </td>
                          <td
                            style={{
                              padding: "14px 12px",
                              color: "#E5E7EB",
                              fontSize: "14px",
                            }}
                          >
                            {formatDate(item.created_at)}
                          </td>
                          <td
                            style={{
                              padding: "14px 12px",
                              textAlign: "center",
                            }}
                          >
                            {renderStatusBadge(item.status)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* EXPORT TABLE */}
          <div
            className="stat-card"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              background: "#1F2937",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px",
              padding: "20px",
              minWidth: 0,
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                color: "#fff",
                fontWeight: 600,
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>📤</span> Đơn xuất (Export)
            </h2>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                width: "100%",
                paddingRight: "4px",
              }}
              className="custom-scroll"
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                      background: "rgba(255,255,255,0.01)",
                    }}
                  >
                    <th
                      style={{
                        padding: "12px",
                        color: "#9CA3AF",
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      Mã đơn
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        color: "#9CA3AF",
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      Người tạo
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        color: "#9CA3AF",
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      Ngày tạo
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        color: "#9CA3AF",
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        textAlign: "center",
                      }}
                    >
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {exports.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          textAlign: "center",
                          padding: "30px",
                          color: "#6B7280",
                          fontSize: "14px",
                        }}
                      >
                        Không có dữ liệu đơn xuất
                      </td>
                    </tr>
                  ) : (
                    exports.map((item) => {
                      const id = getId(item);
                      return (
                        <tr
                          key={id}
                          onClick={() =>
                            navigate(`/admin/orders/export/${id}`)
                          }
                          style={{
                            cursor: "pointer",
                            borderBottom:
                              "1px solid rgba(255, 255, 255, 0.04)",
                          }}
                          className="table-row-hover"
                        >
                          <td style={{ padding: "14px 12px" }}>
                            <span
                              style={{
                                fontFamily: "monospace",
                                color: "#A78BFA",
                                background: "rgba(167, 139, 250, 0.08)",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "13px",
                              }}
                            >
                              {item.code}
                            </span>
                          </td>
                          {/* 👇 Hiển thị tên admin đang đăng nhập */}
                          <td
                            style={{
                              padding: "14px 12px",
                              color: "#E5E7EB",
                              fontSize: "14px",
                            }}
                          >
                            {displayName}
                          </td>
                          <td
                            style={{
                              padding: "14px 12px",
                              color: "#E5E7EB",
                              fontSize: "14px",
                            }}
                          >
                            {formatDate(item.created_at)}
                          </td>
                          <td
                            style={{
                              padding: "14px 12px",
                              textAlign: "center",
                            }}
                          >
                            {renderStatusBadge(item.status)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .table-row-hover:hover {
          background: rgba(255, 255, 255, 0.03) !important;
        }
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}