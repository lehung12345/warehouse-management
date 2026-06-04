import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/auth";

type Location = {
  id: number;
  name: string;
  type: "WAREHOUSE" | "SHELF" | "BIN";
  parent_id?: number | null;
  capacity?: number;
  children?: Location[];
};

import AdminLayout from "./AdminLayout";

export default function LocationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tree, setTree] = useState<Location[]>([]);
  const [expanded, setExpanded] = useState<number[]>([]);

  const [form, setForm] = useState({
    name: "",
    type: "WAREHOUSE" as "WAREHOUSE" | "SHELF" | "BIN",
    parent_id: null as number | null,
    capacity: 0,
  });

  const fetchTree = async () => {
    try {
      const res = await api.get("/api/locations/tree");
      setTree(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchTree(); }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) { alert("Tên không được để trống"); return; }
    if (form.type !== "WAREHOUSE" && !form.parent_id) { alert("Phải chọn vị trí cha (Parent)"); return; }
    try {
      await api.post("/api/locations", form);
      alert("Tạo vị trí thành công");
      setForm({ name: "", type: "WAREHOUSE", parent_id: null, capacity: 0 });
      fetchTree();
    } catch (err: any) {
      alert(err.response?.data?.error || "Lỗi tạo vị trí");
    }
  };

  const toggleNode = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const renderSubTree = (nodes: Location[], level = 1) => {
    return nodes.map((node) => {
      const isExpanded = expanded.includes(node.id);
      const hasChildren = node.children && node.children.length > 0;
      return (
        <div key={node.id} style={{ marginTop: "6px", width: "100%" }}>
          <div
            onClick={(e) => toggleNode(node.id, e)}
            className="sub-tree-node"
            style={{
              display: "flex", alignItems: "center", cursor: "pointer",
              padding: "6px 10px", background: "rgba(255,255,255,0.03)",
              borderRadius: "6px", border: "1px solid rgba(255,255,255,0.04)",
              fontSize: "13px", transition: "all 0.15s ease",
            }}
          >
            <span style={{
              marginRight: "6px", fontSize: "10px",
              transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.15s", display: "inline-block",
              opacity: hasChildren ? 0.7 : 0.2,
            }}>▶</span>
            <span style={{ marginRight: "6px" }}>{node.type === "SHELF" ? "🗄️" : "🗑️"}</span>
            <span style={{ fontWeight: 500, color: node.type === "SHELF" ? "#34d399" : "#fbbf24" }}>
              {node.name}
            </span>
            <span style={{
              marginLeft: "8px", fontSize: "11px", color: "#9ca3af",
              background: "var(--border)", padding: "2px 6px", borderRadius: "4px",
            }}>
              {node.capacity || 0}
            </span>
          </div>
          {isExpanded && hasChildren && (
            <div style={{ paddingLeft: "16px", borderLeft: "1px dashed var(--border)", marginLeft: "14px", marginTop: "4px" }}>
              {renderSubTree(node.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <AdminLayout>
      <style>{`
        .modern-inline-input:focus, .modern-inline-select:focus { border-color: #4f46e5 !important; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important; }
        .parent-highlight:focus { border-color: #fbbf24 !important; box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.1) !important; }
        .modern-inline-btn:hover { background: #4338ca !important; }
        .warehouse-card { transition: border-color 0.2s ease; }
        .warehouse-card:hover { border-color: rgba(96,165,250,0.3) !important; }
        .sub-tree-node:hover { background: rgba(255,255,255,0.07) !important; border-color: var(--border) !important; }
        .modern-inline-select:hover { border-color: rgba(255,255,255,0.2) !important; }
        .modern-inline-select::-webkit-scrollbar { width: 8px; }
        .modern-inline-select::-webkit-scrollbar-track { background: #1f2937; border-radius: 4px; }
        .modern-inline-select::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 4px; }
        .modern-inline-select::-webkit-scrollbar-thumb:hover { background: #6b7280; }
        .warehouse-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 1100px) {
          .warehouse-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 700px) {
          .warehouse-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "20px" }}>
        📍 Quản lý vị trí kho
      </h1>

      {/* Form tạo */}
      <div
        className="stat-card"
        style={{
          padding: "16px 20px", marginBottom: "24px",
          display: "flex", alignItems: "center", gap: "12px",
          background: "#1f2937", border: "1px solid var(--border)",
          borderRadius: "12px", flexWrap: "wrap",
        }}
      >
        <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", margin: "0 8px 0 0", display: "flex", alignItems: "center", gap: "6px" }}>
          <span>➕</span> Tạo vị trí
        </h3>
        <input
          className="modern-inline-input"
          placeholder="Tên vị trí..."
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ flex: "2", minWidth: "160px", padding: "10px 14px", background: "var(--bg-overlay)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-primary)", fontSize: "14px", outline: "none" }}
        />
        <input
          className="modern-inline-input"
          type="number"
          placeholder="Sức chứa"
          value={form.capacity === 0 ? "" : form.capacity}
          onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
          style={{ flex: "1", minWidth: "90px", padding: "10px 14px", background: "var(--bg-overlay)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-primary)", fontSize: "14px", outline: "none" }}
        />
        <select
          className="modern-inline-select"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value as any, parent_id: null })}
          style={{ padding: "10px 36px 10px 12px", background: "var(--bg-overlay)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-primary)", fontSize: "14px", outline: "none", cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "16px", transition: "all 0.2s ease" }}
        >
          <option value="WAREHOUSE">Warehouse</option>
          <option value="SHELF">Shelf</option>
          <option value="BIN">Bin</option>
        </select>
        {(form.type === "SHELF" || form.type === "BIN") && (
          <select
            className="modern-inline-select parent-highlight"
            value={form.parent_id ?? ""}
            onChange={(e) => setForm({ ...form, parent_id: e.target.value ? Number(e.target.value) : null })}
            style={{ padding: "10px 36px 10px 12px", background: "var(--bg-overlay)", border: "1px solid rgba(251,191,36,0.4)", borderRadius: "8px", color: "#fbbf24", fontSize: "14px", outline: "none", cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23fbbf24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "16px", transition: "all 0.2s ease" }}
          >
            <option value="" style={{ color: "#9ca3af" }}>-- Chọn parent --</option>
            {form.type === "SHELF" && tree.map((w) => (
              <option key={w.id} value={w.id} style={{ color: "var(--text-primary)" }}>{w.name}</option>
            ))}
            {form.type === "BIN" && tree.flatMap((w) =>
              w.children?.map((s) => (
                <option key={s.id} value={s.id} style={{ color: "var(--text-primary)" }}>{w.name} → {s.name}</option>
              )) || []
            )}
          </select>
        )}
        <button
          onClick={handleCreate}
          className="modern-inline-btn"
          style={{ padding: "10px 20px", background: "#4f46e5", color: "var(--text-primary)", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
        >
          Tạo vị trí
        </button>
      </div>

      {/* Tree */}
      {tree.length === 0 ? (
        <div className="stat-card" style={{ padding: 20, background: "#1f2937", borderRadius: "12px", color: "#9ca3af" }}>
          Chưa có dữ liệu kho. Vui lòng tạo kho mới ở trên!
        </div>
      ) : (
        /* GRID 3 CỘT — mỗi card luôn bằng nhau dù hàng có 1, 2 hay 3 */
        <div className="warehouse-grid">
          {tree.map((warehouse) => {
            const isWarehouseExpanded = expanded.includes(warehouse.id);
            const hasShelves = warehouse.children && warehouse.children.length > 0;
            return (
              <div
                key={warehouse.id}
                className="warehouse-card"
                style={{
                  background: "#1f2937", borderRadius: "12px",
                  border: "1px solid var(--border)",
                  padding: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  display: "flex", flexDirection: "column",
                }}
              >
                {/* Header kho */}
                <div
                  onClick={(e) => toggleNode(warehouse.id, e)}
                  style={{
                    display: "flex", alignItems: "center", cursor: "pointer",
                    paddingBottom: isWarehouseExpanded && hasShelves ? "12px" : "0px",
                    borderBottom: isWarehouseExpanded && hasShelves ? "1px solid var(--border)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                    <span style={{ fontSize: "18px" }}>{isWarehouseExpanded ? "📂" : "📁"}</span>
                    <span style={{ fontSize: "15px", fontWeight: 600, color: "#60a5fa" }}>{warehouse.name}</span>
                    <span style={{ fontSize: "12px", color: "#9ca3af", background: "rgba(96,165,250,0.1)", padding: "3px 8px", borderRadius: "6px", fontWeight: 500 }}>
                      {warehouse.capacity || 0}
                    </span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#9ca3af", transform: isWarehouseExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>▶</span>
                </div>

                {/* Shelf/Bin bên trong */}
                {isWarehouseExpanded && (
                  <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "2px" }}>
                    {!hasShelves ? (
                      <p style={{ color: "#6b7280", fontSize: "12px", margin: "4px 0 0 4px" }}>(Kho trống - chưa có kệ)</p>
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
    </AdminLayout>
  );
}