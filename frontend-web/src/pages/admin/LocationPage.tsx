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

  // auto expand root
  useEffect(() => {
    if (tree.length > 0) {
      setExpanded(tree.map((n) => n.id));
    }
  }, [tree]);

  // ================= CREATE =================
  const handleCreate = async () => {
    if (!form.name.trim()) {
      alert("Tên không được để trống");
      return;
    }

    if (form.type !== "WAREHOUSE" && !form.parent_id) {
      alert("Phải chọn parent");
      return;
    }

    console.log("FORM:", form);

    try {
      await api.post("/api/locations", form);
      alert("Tạo thành công");

      setForm({
        name: "",
        type: "WAREHOUSE",
        parent_id: null,
        capacity: 0,
      });

      fetchTree();
    } catch (err: any) {
      alert(err.response?.data?.error || "Lỗi tạo");
    }
  };

  // ================= TREE =================
  const toggle = (id: number) => {
    setExpanded((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const renderTree = (nodes: Location[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.id} style={{ marginLeft: level * 20, marginTop: 8 }}>
        <div
          onClick={() => toggle(node.id)}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            padding: "6px 10px",
            background: "#1f2937",
            borderRadius: 6,
            color:
              node.type === "WAREHOUSE"
                ? "#60a5fa"
                : node.type === "SHELF"
                ? "#34d399"
                : "#fbbf24",
          }}
        >
          <span style={{ marginRight: 8 }}>
            {expanded.includes(node.id) ? "📂" : "📁"}
          </span>

          <strong>{node.name}</strong>

          <span style={{ marginLeft: 10, fontSize: 12, opacity: 0.6 }}>
            ({node.type})
          </span>
        </div>

        {expanded.includes(node.id) &&
          node.children &&
          node.children.length > 0 && (
            <div>{renderTree(node.children, level + 1)}</div>
          )}
      </div>
    ));
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // ================= RENDER =================
  return (
    <div className="dashboard-root">
      {/* SIDEBAR */}
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

      {/* MAIN */}
      <main className="dashboard-main">
        <h1>📍 Quản lý vị trí kho</h1>

        {/* ================= FORM CREATE ================= */}
        <div className="stat-card" style={{ padding: 20, marginBottom: 20 }}>
          <h3>➕ Tạo vị trí</h3>

          <input
            placeholder="Tên"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            style={{ marginRight: 10 }}
          />

          <input
            type="number"
            placeholder="Sức chứa"
            value={form.capacity}
            onChange={(e) =>
              setForm({ ...form, capacity: Number(e.target.value) })
            }
            style={{ marginRight: 10 }}
          />

          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value as any,
                parent_id: null,
              })
            }
            style={{ marginRight: 10 }}
          >
            <option value="WAREHOUSE">Warehouse</option>
            <option value="SHELF">Shelf</option>
            <option value="BIN">Bin</option>
          </select>

          {/* SELECT PARENT */}
          {(form.type === "SHELF" || form.type === "BIN") && (
            <select
              value={form.parent_id ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  parent_id: e.target.value ? Number(e.target.value) : null,
                })
              }
              style={{ marginRight: 10 }}
            >
              <option value="">-- Chọn parent --</option>

              {/* SHELF → chọn WAREHOUSE */}
              {form.type === "SHELF" &&
                tree.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}

              {/* BIN → chọn SHELF */}
              {form.type === "BIN" &&
                tree.flatMap((w) =>
                  w.children?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {w.name} → {s.name}
                    </option>
                  )) || []
                )}
            </select>
          )}

          <button onClick={handleCreate}>Tạo</button>
        </div>

        {/* ================= TREE ================= */}
        <div className="stat-card" style={{ padding: 20 }}>
          {tree.length === 0 ? (
            <p>Chưa có dữ liệu kho</p>
          ) : (
            renderTree(tree)
          )}
        </div>
      </main>
    </div>
  );
}