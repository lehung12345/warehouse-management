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

  const toggle = (id: number) => {
    setExpanded((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
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

        {/* CHILDREN */}
        {expanded.includes(node.id) &&
          node.children &&
          node.children.length > 0 && (
            <div>{renderTree(node.children, level + 1)}</div>
          )}
      </div>
    ));
  };

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