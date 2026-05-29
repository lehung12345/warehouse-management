// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../api/auth";

// type Location = {
//   id: number;
//   name: string;
//   type: "WAREHOUSE" | "SHELF" | "BIN";
//   parent_id?: number | null;
//   children?: Location[];
// };

// export default function LocationPage() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [tree, setTree] = useState<Location[]>([]);
//   const [expanded, setExpanded] = useState<number[]>([]);

//   const fetchTree = async () => {
//     try {
//       const res = await api.get("/api/locations/tree");
//       setTree(res.data || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchTree();
//   }, []);

//   const toggle = (id: number) => {
//     setExpanded((prev) =>
//       prev.includes(id)
//         ? prev.filter((x) => x !== id)
//         : [...prev, id]
//     );
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login", { replace: true });
//   };

//   const renderTree = (nodes: Location[], level = 0) => {
//     return nodes.map((node) => (
//       <div key={node.id} style={{ marginLeft: level * 20, marginTop: 8 }}>

//         <div
//           onClick={() => toggle(node.id)}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             cursor: "pointer",
//             padding: "6px 10px",
//             background: "#1f2937",
//             borderRadius: 6,
//             color:
//               node.type === "WAREHOUSE"
//                 ? "#60a5fa"
//                 : node.type === "SHELF"
//                 ? "#34d399"
//                 : "#fbbf24",
//           }}
//         >
//           <span style={{ marginRight: 8 }}>
//             {expanded.includes(node.id) ? "📂" : "📁"}
//           </span>

//           <strong>{node.name}</strong>

//           <span style={{ marginLeft: 10, fontSize: 12, opacity: 0.6 }}>
//             ({node.type})
//           </span>
//         </div>

//         {/* CHILDREN */}
//         {expanded.includes(node.id) &&
//           node.children &&
//           node.children.length > 0 && (
//             <div>{renderTree(node.children, level + 1)}</div>
//           )}
//       </div>
//     ));
//   };

//   return (
//     <div className="dashboard-root">

//       {/* SIDEBAR */}
//       <aside className="sidebar">
//         <div className="sidebar-brand" onClick={() => navigate("/admin")}>
//           WareFlow
//         </div>

//         <nav className="sidebar-nav">
//           <a href="/admin">Dashboard</a>
//           <a href="/admin/products">Sản phẩm</a>
//           <a href="/admin/inventory">Tồn kho</a>
//           <a href="/admin/orders">Đơn hàng</a>
//           <a className="active" href="/admin/locations">Kho</a>
//         </nav>

//         <div className="sidebar-footer">
//           <div>{user?.username}</div>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       </aside>

//       {/* MAIN */}
//       <main className="dashboard-main">

//         <h1>📍 Quản lý vị trí kho</h1>

//         <div className="stat-card" style={{ padding: 20 }}>
//           {tree.length === 0 ? (
//             <p>Chưa có dữ liệu kho</p>
//           ) : (
//             renderTree(tree)
//           )}
//         </div>

//       </main>
//     </div>
//   );
// }




//bản xịn
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../api/auth";

// type Location = {
//   id: number;
//   name: string;
//   type: "WAREHOUSE" | "SHELF" | "BIN";
//   parent_id?: number | null;
//   children?: Location[];
// };

// export default function LocationPage() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [tree, setTree] = useState<Location[]>([]);
//   const [expanded, setExpanded] = useState<number[]>([]);

//   const [form, setForm] = useState({
//     name: "",
//     type: "WAREHOUSE" as "WAREHOUSE" | "SHELF" | "BIN",
//     parent_id: null as number | null,
//     capacity: 0,
//   });

//   // ================= FETCH TREE =================
//   const fetchTree = async () => {
//     try {
//       const res = await api.get("/api/locations/tree");
//       setTree(res.data || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchTree();
//   }, []);

//   // auto expand root
//   useEffect(() => {
//     if (tree.length > 0) {
//       setExpanded(tree.map((n) => n.id));
//     }
//   }, [tree]);

//   // ================= CREATE =================
//   const handleCreate = async () => {
//     if (!form.name.trim()) {
//       alert("Tên không được để trống");
//       return;
//     }

//     if (form.type !== "WAREHOUSE" && !form.parent_id) {
//       alert("Phải chọn parent");
//       return;
//     }

//     console.log("FORM:", form);

//     try {
//       await api.post("/api/locations", form);
//       alert("Tạo thành công");

//       setForm({
//         name: "",
//         type: "WAREHOUSE",
//         parent_id: null,
//         capacity: 0,
//       });

//       fetchTree();
//     } catch (err: any) {
//       alert(err.response?.data?.error || "Lỗi tạo");
//     }
//   };

//   // ================= TREE =================
//   const toggle = (id: number) => {
//     setExpanded((prev) =>
//       prev.includes(id)
//         ? prev.filter((x) => x !== id)
//         : [...prev, id]
//     );
//   };

//   const renderTree = (nodes: Location[], level = 0) => {
//     return nodes.map((node) => (
//       <div key={node.id} style={{ marginLeft: level * 20, marginTop: 8 }}>
//         <div
//           onClick={() => toggle(node.id)}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             cursor: "pointer",
//             padding: "6px 10px",
//             background: "#1f2937",
//             borderRadius: 6,
//             color:
//               node.type === "WAREHOUSE"
//                 ? "#60a5fa"
//                 : node.type === "SHELF"
//                 ? "#34d399"
//                 : "#fbbf24",
//           }}
//         >
//           <span style={{ marginRight: 8 }}>
//             {expanded.includes(node.id) ? "📂" : "📁"}
//           </span>

//           <strong>{node.name}</strong>

//           <span style={{ marginLeft: 10, fontSize: 12, opacity: 0.6 }}>
//             ({node.type})
//           </span>
//         </div>

//         {expanded.includes(node.id) &&
//           node.children &&
//           node.children.length > 0 && (
//             <div>{renderTree(node.children, level + 1)}</div>
//           )}
//       </div>
//     ));
//   };

//   // ================= LOGOUT =================
//   const handleLogout = () => {
//     logout();
//     navigate("/login", { replace: true });
//   };

//   // ================= RENDER =================
//   return (
//     <div className="dashboard-root">
//       {/* SIDEBAR */}
//       <aside className="sidebar">
//         <div className="sidebar-brand" onClick={() => navigate("/admin")}>
//           WareFlow
//         </div>

//         <nav className="sidebar-nav">
//           <a href="/admin">Dashboard</a>
//           <a href="/admin/products">Sản phẩm</a>
//           <a href="/admin/inventory">Tồn kho</a>
//           <a href="/admin/orders">Đơn hàng</a>
//           <a className="active" href="/admin/locations">Kho</a>
//         </nav>

//         <div className="sidebar-footer">
//           <div>{user?.username}</div>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       </aside>

//       {/* MAIN */}
//       <main className="dashboard-main">
//         <h1>📍 Quản lý vị trí kho</h1>

//         {/* ================= FORM CREATE ================= */}
//         <div className="stat-card" style={{ padding: 20, marginBottom: 20 }}>
//           <h3>➕ Tạo vị trí</h3>

//           <input
//             placeholder="Tên"
//             value={form.name}
//             onChange={(e) =>
//               setForm({ ...form, name: e.target.value })
//             }
//             style={{ marginRight: 10 }}
//           />

//           <input
//             type="number"
//             placeholder="Sức chứa"
//             value={form.capacity}
//             onChange={(e) =>
//               setForm({ ...form, capacity: Number(e.target.value) })
//             }
//             style={{ marginRight: 10 }}
//           />

//           <select
//             value={form.type}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 type: e.target.value as any,
//                 parent_id: null,
//               })
//             }
//             style={{ marginRight: 10 }}
//           >
//             <option value="WAREHOUSE">Warehouse</option>
//             <option value="SHELF">Shelf</option>
//             <option value="BIN">Bin</option>
//           </select>

//           {/* SELECT PARENT */}
//           {(form.type === "SHELF" || form.type === "BIN") && (
//             <select
//               value={form.parent_id ?? ""}
//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   parent_id: e.target.value ? Number(e.target.value) : null,
//                 })
//               }
//               style={{ marginRight: 10 }}
//             >
//               <option value="">-- Chọn parent --</option>

//               {/* SHELF → chọn WAREHOUSE */}
//               {form.type === "SHELF" &&
//                 tree.map((w) => (
//                   <option key={w.id} value={w.id}>
//                     {w.name}
//                   </option>
//                 ))}

//               {/* BIN → chọn SHELF */}
//               {form.type === "BIN" &&
//                 tree.flatMap((w) =>
//                   w.children?.map((s) => (
//                     <option key={s.id} value={s.id}>
//                       {w.name} → {s.name}
//                     </option>
//                   )) || []
//                 )}
//             </select>
//           )}

//           <button onClick={handleCreate}>Tạo</button>
//         </div>

//         {/* ================= TREE ================= */}
//         <div className="stat-card" style={{ padding: 20 }}>
//           {tree.length === 0 ? (
//             <p>Chưa có dữ liệu kho</p>
//           ) : (
//             renderTree(tree)
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }


//bản giao diện 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/auth";

type Location = {
  id: number;
  name: string;
  type: "WAREHOUSE" | "SHELF" | "BIN";
  parent_id?: number | null;
  children?: Location[];
};

export default function LocationPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tree, setTree] = useState<Location[]>([]);
  // Lưu danh sách ID các nút đang được bấm mở ra (xổ xuống)
  const [expanded, setExpanded] = useState<number[]>([]);

  const [form, setForm] = useState({
    name: "",
    type: "WAREHOUSE" as "WAREHOUSE" | "SHELF" | "BIN",
    parent_id: null as number | null,
    capacity: 0,
  });

  // ================= FETCH TREE =================
  const fetchTree = async () => {
    try {
      const res = await api.get("/api/locations/tree");
      setTree(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTree();
  }, []);

  // Không auto-expand tất cả nữa để người dùng ấn mới xổ xuống đúng ý bạn
  useEffect(() => {
    if (tree.length > 0) {
      // Bạn có thể để trống hoặc chỉ mở mặc định tầng Warehouse đầu tiên nếu muốn
      // Ở đây mình để mặc định đóng hết, ấn mới xổ cho đúng tính chất
    }
  }, [tree]);

  // ================= CREATE =================
  const handleCreate = async () => {
    if (!form.name.trim()) {
      alert("Tên không được để trống");
      return;
    }

    if (form.type !== "WAREHOUSE" && !form.parent_id) {
      alert("Phải chọn vị trí cha (Parent)");
      return;
    }

    try {
      await api.post("/api/locations", form);
      alert("Tạo vị trí thành công");

      setForm({
        name: "",
        type: "WAREHOUSE",
        parent_id: null,
        capacity: 0,
      });

      fetchTree();
    } catch (err: any) {
      alert(err.response?.data?.error || "Lỗi tạo vị trí");
    }
  };

  // ================= TOGGLE XỔ XUỐNG =================
  const toggleNode = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Tránh lỗi nổi bọt sự kiện click
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ================= RENDER SHELF & BIN (DỌC BÊN TRONG CỦA KHO) =================
  const renderSubTree = (nodes: Location[], level = 1) => {
    return nodes.map((node) => {
      const isExpanded = expanded.includes(node.id);
      const hasChildren = node.children && node.children.length > 0;

      return (
        <div key={node.id} style={{ marginTop: "6px", width: "100%" }}>
          <div
            onClick={(e) => toggleNode(node.id, e)}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              padding: "6px 10px",
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: "6px",
              border: "1px solid rgba(255, 255, 255, 0.04)",
              fontSize: "13px",
              transition: "all 0.15s ease",
            }}
            className="sub-tree-node"
          >
            {/* Icon mũi tên xoay biểu thị đóng mở nếu có con */}
            <span style={{ 
              marginRight: "6px", 
              fontSize: "10px", 
              transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.15s",
              display: "inline-block",
              opacity: hasChildren ? 0.7 : 0.2
            }}>
              ▶
            </span>
            <span style={{ marginRight: "6px" }}>
              {node.type === "SHELF" ? "🗄️" : "🗑️"}
            </span>
            <span style={{ 
              fontWeight: 500,
              color: node.type === "SHELF" ? "#34d399" : "#fbbf24" 
            }}>
              {node.name}
            </span>
          </div>

          {/* Nếu được click mở ra và có con thì xổ xuống tiếp */}
          {isExpanded && hasChildren && (
            <div style={{ paddingLeft: "16px", borderLeft: "1px dashed rgba(255,255,255,0.1)", marginLeft: "14px", marginTop: "4px" }}>
              {renderSubTree(node.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-root">
      {/* SIDEBAR GỐC CHUẨN WAREFLOW */}
      <aside className="sidebar">
        <div className="sidebar-brand" onClick={() => navigate("/admin")}>
          WareFlow
        </div>

        <nav className="sidebar-nav">
          <a href="/admin">Dashboard</a>
          <a href="/admin/products">Sản phẩm</a>
          <a href="/admin/inventory">Tồn kho</a>
          <a href="/admin/orders">Đơn hàng</a>
          <a className="active" href="/admin/locations">Kho</a>
        </nav>

        <div className="sidebar-footer">
          <div>{user?.username}</div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* MAIN LAYOUT */}
      <main className="dashboard-main">
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#fff", marginBottom: "20px" }}>
          📍 Quản lý vị trí kho
        </h1>

        {/* ================= CỤM INPUT TẠO HÀNG NGANG TÂN TRANG ================= */}
        <div 
          className="stat-card" 
          style={{ 
            padding: "16px 20px", 
            marginBottom: "24px", 
            display: "flex", 
            alignItems: "center", 
            gap: "12px", 
            background: "#1f2937", 
            border: "1px solid rgba(255, 255, 255, 0.06)", 
            borderRadius: "12px",
            flexWrap: "wrap"
          }}
        >
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#fff", margin: "0 8px 0 0", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>➕</span> Tạo vị trí
          </h3>

          <input
            className="modern-inline-input"
            placeholder="Tên vị trí..."
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{
              flex: "2",
              minWidth: "160px",
              padding: "10px 14px",
              background: "#111827",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "14px",
              outline: "none"
            }}
          />

          <input
            className="modern-inline-input"
            type="number"
            placeholder="Sức chứa"
            value={form.capacity === 0 ? "" : form.capacity}
            onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
            style={{
              flex: "1",
              minWidth: "90px",
              padding: "10px 14px",
              background: "#111827",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "14px",
              outline: "none"
            }}
          />

          <select
            className="modern-inline-select"
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value as any,
                parent_id: null,
              })
            }
            style={{
              padding: "10px 14px",
              background: "#111827",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="WAREHOUSE">Warehouse</option>
            <option value="SHELF">Shelf</option>
            <option value="BIN">Bin</option>
          </select>

          {/* CHỌN PARENT DỰA TRÊN CẤP BẬC */}
          {(form.type === "SHELF" || form.type === "BIN") && (
            <select
              className="modern-inline-select parent-highlight"
              value={form.parent_id ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  parent_id: e.target.value ? Number(e.target.value) : null,
                })
              }
              style={{
                padding: "10px 14px",
                background: "#111827",
                border: "1px solid rgba(251, 191, 36, 0.4)",
                borderRadius: "8px",
                color: "#fbbf24",
                fontSize: "14px",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="" style={{ color: "#9ca3af" }}>-- Chọn parent --</option>
              {form.type === "SHELF" &&
                tree.map((w) => (
                  <option key={w.id} value={w.id} style={{ color: "#fff" }}>
                    {w.name}
                  </option>
                ))}
              {form.type === "BIN" &&
                tree.flatMap((w) =>
                  w.children?.map((s) => (
                    <option key={s.id} value={s.id} style={{ color: "#fff" }}>
                      {w.name} → {s.name}
                    </option>
                  )) || []
                )}
            </select>
          )}

          <button 
            onClick={handleCreate}
            style={{
              padding: "10px 20px",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer"
            }}
            className="modern-inline-btn"
          >
            Tạo vị trí
          </button>
        </div>

        {/* ================= SƠ ĐỒ CÂY THƯ MỤC HÀNG NGANG (KHO) VÀ XỔ XUỐNG DỌC (SHELF/BIN) ================= */}
        {tree.length === 0 ? (
          <div className="stat-card" style={{ padding: 20, background: "#1f2937", borderRadius: "12px", color: "#9ca3af" }}>
            Chưa có dữ liệu kho. Vui lòng tạo kho mới ở trên!
          </div>
        ) : (
          /* CONTAINER CHA NẰM NGANG CHO CÁC WAREHOUSE */
          <div 
            style={{ 
              display: "flex", 
              flexDirection: "row", 
              flexWrap: "wrap", 
              gap: "20px", 
              alignItems: "flex-start" 
            }}
          >
            {tree.map((warehouse) => {
              const isWarehouseExpanded = expanded.includes(warehouse.id);
              const hasShelves = warehouse.children && warehouse.children.length > 0;

              return (
                <div 
                  key={warehouse.id}
                  className="warehouse-card"
                  style={{
                    flex: "1 1 calc(33.333% - 14px)", // 3 cái trên 1 hàng, tự động co giãn và xuống hàng khi chật
                    minWidth: "280px",
                    background: "#1f2937",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    padding: "16px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  {/* TIÊU ĐỀ WAREHOUSE CARD - ẤN VÀO ĐỂ XỔ SHELF */}
                  <div
                    onClick={(e) => toggleNode(warehouse.id, e)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "between",
                      cursor: "pointer",
                      paddingBottom: isWarehouseExpanded && hasShelves ? "12px" : "0px",
                      borderBottom: isWarehouseExpanded && hasShelves ? "1px solid rgba(255,255,255,0.06)" : "none",
                      width: "100%"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                      <span style={{ fontSize: "18px" }}>
                        {isWarehouseExpanded ? "📂" : "📁"}
                      </span>
                      <span style={{ fontSize: "15px", fontWeight: 600, color: "#60a5fa" }}>
                        {warehouse.name}
                      </span>
                    </div>
                    {/* Mũi tên góc phải chỉ định trạng thái đóng/mở */}
                    <span style={{ 
                      fontSize: "11px", 
                      color: "#9ca3af",
                      transform: isWarehouseExpanded ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.15s"
                    }}>
                      ▶
                    </span>
                  </div>

                  {/* VÙNG XỔ XUỐNG DỌC CỦA SHELF VÀ BIN BÊN TRONG KHO */}
                  {isWarehouseExpanded && (
                    <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "2px" }}>
                      {!hasShelves ? (
                        <p style={{ color: "#6b7280", fontSize: "12px", margin: "4px 0 0 4px", italic: "true" }}>
                          (Kho trống - chưa có kệ)
                        </p>
                      ) : (
                        renderSubTree(warehouse.children!)
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Tối ưu hiệu ứng Hover & Focus */}
      <style>{`
        .modern-inline-input:focus, .modern-inline-select:focus {
          border-color: #4f46e5 !important;
        }
        .parent-highlight:focus {
          border-color: #fbbf24 !important;
        }
        .modern-inline-btn:hover {
          background: #4338ca !important;
        }
        .warehouse-card {
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .warehouse-card:hover {
          border-color: rgba(96, 165, 250, 0.3) !important;
        }
        .sub-tree-node:hover {
          background: rgba(255, 255, 255, 0.07) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
    </div>
  );
}