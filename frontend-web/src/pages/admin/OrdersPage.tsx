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





import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/auth";

export default function OrdersPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [imports, setImports] = useState<any[]>([]);
  const [exports, setExports] = useState<any[]>([]);

  // 🚀 Chuẩn hóa lấy ID dạng chữ thường theo JSON mới từ Go
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE":
        return "lime";
      case "PROCESSING":
        return "orange";
      case "PENDING":
        return "gray";
      default:
        return "black";
    }
  };

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
          <div>{user?.username}</div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="dashboard-main">
        <h1>📑 Quản lý đơn hàng</h1>

        {/* BUTTONS */}
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => navigate("/admin/orders/create-import")}>
            + Tạo đơn nhập
          </button>

          <button
            style={{ marginLeft: 10 }}
            onClick={() => navigate("/admin/orders/create-export")}
          >
            + Tạo đơn xuất
          </button>
        </div>

        {/* IMPORT TABLE */}
        <div className="stat-card">
          <h2>📥 Đơn nhập (Import)</h2>

          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Mã</th>
                <th>Người tạo</th>
                <th>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {imports.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                imports.map((item) => {
                  const id = getId(item);
                  const status = item.status; // 🚀 Chỉ cần .status chữ thường

                  return (
                    <tr
                      key={id}
                      onClick={() => navigate(`/admin/orders/import/${id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{item.code}</td> {/* 🚀 Chỉ cần .code */}
                      <td>{item.user_id}</td> {/* 🚀 Chỉ cần .user_id */}
                      <td style={{ color: getStatusColor(status) }}>
                        {status}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* EXPORT TABLE */}
        <div className="stat-card" style={{ marginTop: 20 }}>
          <h2>📤 Đơn xuất (Export)</h2>

          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Mã</th>
                <th>Người tạo</th>
                <th>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {exports.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                exports.map((item) => {
                  const id = getId(item);
                  const status = item.status; // 🚀 Chỉ cần .status chữ thường

                  return (
                    <tr
                      key={id}
                      onClick={() => navigate(`/admin/orders/export/${id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{item.code}</td> {/* 🚀 Chỉ cần .code */}
                      <td>{item.user_id}</td> {/* 🚀 Chỉ cần .user_id */}
                      <td style={{ color: getStatusColor(status) }}>
                        {status}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}