import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "./AdminLayout";

export default function CreateExportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [warnings, setWarnings] = useState<any>({});
  const [products, setProducts] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [inventories, setInventories] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchLocations();
    fetchInventories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await api.get("/api/locations/tree");
      setLocations(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInventories = async () => {
    try {
      const res = await api.get("/api/inventories");
      // Handle different response structures
      const data = res.data?.data || res.data || [];
      setInventories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setInventories([]);
    }
  };

  // Flatten tree to array with indentation for display
  const flattenLocations = (nodes: any[], level = 0): any[] => {
    let result: any[] = [];
    nodes.forEach((node) => {
      result.push({ ...node, level });
      if (node.children && node.children.length > 0) {
        result = result.concat(flattenLocations(node.children, level + 1));
      }
    });
    return result;
  };

  const flatLocations = flattenLocations(locations);

  /* ================= CRUD ITEM ================= */
  const addItem = () => {
    setItems([...items, { product_id: "", location_id: "", quantity: 0 }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  /* ================= VALIDATE ================= */
  const validate = () => {
    let newErrors: any = {};
    let newWarnings: any = {};

    if (items.length === 0) {
      newErrors.items = "Phải có ít nhất 1 sản phẩm";
    }

    const itemErrors: any[] = [];
    const itemWarnings: any[] = [];

    items.forEach((item, index) => {
      let err: any = {};
      let warn: any = {};

      if (!item.product_id || item.product_id <= 0) {
        err.product_id = "Chọn sản phẩm";
      }

      if (!item.location_id || item.location_id <= 0) {
        err.location_id = "Chọn vị trí";
      } else {
        // Validate location must be BIN
        const selectedLocation = flatLocations.find((loc) => loc.id === item.location_id);
        if (selectedLocation && selectedLocation.type !== "BIN") {
          err.location_id = "Chỉ chọn vị trí BIN";
        }

        // Validate quantity <= BIN capacity
        if (selectedLocation && item.quantity > selectedLocation.capacity) {
          err.quantity = `Số lượng không vượt quá ${selectedLocation.capacity}`;
        }

        // Check stock availability (warning only, not error)
        if (item.product_id && item.location_id && item.quantity > 0) {
          const inventoryList = Array.isArray(inventories) ? inventories : [];
          const inventoryRecord = inventoryList.find(
            (inv) => inv.product_id === item.product_id && inv.location_id === item.location_id
          );
          const availableStock = inventoryRecord ? inventoryRecord.quantity : 0;
          
          if (item.quantity > availableStock) {
            warn.quantity = `Cảnh báo: Kho chỉ còn ${availableStock} sản phẩm này`;
          }
        }
      }

      if (!item.quantity || item.quantity <= 0) {
        err.quantity = "Số lượng > 0";
      }

      itemErrors[index] = err;
      itemWarnings[index] = warn;
    });

    newErrors.itemErrors = itemErrors;
    newWarnings.itemWarnings = itemWarnings;

    setErrors(newErrors);
    setWarnings(newWarnings);

    const hasItemError = itemErrors.some(
      (e) => Object.keys(e).length > 0
    );

    return !newErrors.items && !hasItemError;
  };

  /* ================= SUBMIT ================= */
  const handleCreate = async () => {
    if (!validate()) return;

    // Check if there are any stock warnings
    const hasStockWarnings = Object.values(warnings.itemWarnings || {}).some(
      (warn: any) => warn.quantity
    );

    if (hasStockWarnings) {
      const confirmed = confirm(
        "Cảnh báo: Một số sản phẩm có số lượng xuất vượt quá tồn kho hiện tại. Bạn có chắc muốn tiếp tục tạo đơn?"
      );
      if (!confirmed) return;
    }

    try {
      await api.post("/api/orders/export", {
        user_id: user?.id,
        status: "PENDING",
        items,
      });

      alert("Tạo đơn xuất thành công!");
      navigate("/admin/orders");
    } catch (err) {
      console.error(err);
      alert("Lỗi tạo đơn");
    }
  };

  return (
    <AdminLayout>
      <style>{`
        select:focus { border-color: #10B981 !important; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important; }
        select:hover { border-color: rgba(255,255,255,0.2) !important; }
        select::-webkit-scrollbar { width: 8px; }
        select::-webkit-scrollbar-track { background: #1f2937; border-radius: 4px; }
        select::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 4px; }
        select::-webkit-scrollbar-thumb:hover { background: #6b7280; }
      `}</style>

        {/* HEADER */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--text-primary)" }}>
            📤 Tạo đơn xuất kho
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Xuất hàng ra khỏi kho theo danh sách sản phẩm
          </p>
        </div>

        {/* CARD */}
        <div style={card}>

          {/* ITEMS */}
          <div style={{ marginBottom: "20px" }}>
            <div style={rowBetween}>
              <h3 style={{ color: "var(--text-primary)" }}>Danh sách sản phẩm</h3>
              <button onClick={addItem} style={btnAdd}>
                + Thêm
              </button>
            </div>

            {errors.items && <p style={errorText}>{errors.items}</p>}

            {items.length === 0 && (
              <p style={{ color: "var(--text-secondary)" }}>Chưa có sản phẩm</p>
            )}

            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {items.map((item, index) => (
                <div key={index} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>

                  <div style={itemRow}>
                    <select
                      value={item.product_id || ""}
                      onChange={(e) =>
                        updateItem(index, "product_id", Number(e.target.value))
                      }
                      style={inputSmall}
                    >
                      <option value="">Chọn sản phẩm</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={item.location_id || ""}
                      onChange={(e) =>
                        updateItem(index, "location_id", Number(e.target.value))
                      }
                      style={inputSmall}
                    >
                      <option value="">Chọn vị trí</option>
                      {flatLocations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {"  ".repeat(loc.level)}{loc.name} ({loc.type})
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder="Quantity"
                      style={inputSmall}
                      onChange={(e) =>
                        updateItem(index, "quantity", Number(e.target.value))
                      }
                    />

                    <button onClick={() => removeItem(index)} style={btnDelete}>
                      ✕
                    </button>
                  </div>

                  {/* ERRORS */}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <span style={errorText}>
                      {errors.itemErrors?.[index]?.product_id}
                    </span>
                    <span style={errorText}>
                      {errors.itemErrors?.[index]?.location_id}
                    </span>
                    <span style={errorText}>
                      {errors.itemErrors?.[index]?.quantity}
                    </span>
                  </div>

                  {/* WARNINGS */}
                  {warnings.itemWarnings?.[index]?.quantity && (
                    <div style={{ marginTop: "4px" }}>
                      <span style={warningText}>
                        ⚠️ {warnings.itemWarnings?.[index]?.quantity}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ACTION */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={handleCreate} style={btnPrimary}>
              🚀 Tạo đơn xuất
            </button>

            <button onClick={() => navigate(-1)} style={btnSecondary}>
              ← Quay lại
            </button>
          </div>
        </div>
    </AdminLayout>
  );
}

/* ================= STYLE ================= */

const card = {
  background: "var(--bg-elevated)",
  borderRadius: "16px",
  padding: "24px",
  border: "1px solid var(--border)",
};

const label = {
  display: "block",
  marginBottom: "6px",
  color: "var(--text-secondary)",
  fontSize: "13px",
};

const input = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid var(--border)",
  background: "var(--bg-overlay)",
  color: "var(--text-primary)",
};

const inputSmall = {
  flex: 1,
  padding: "10px 36px 10px 12px",
  borderRadius: "8px",
  border: "1px solid var(--border)",
  background: "var(--bg-overlay)",
  color: "var(--text-primary)",
  appearance: "none" as "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  backgroundSize: "16px",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const itemRow = {
  display: "flex",
  gap: "10px",
};

const rowBetween = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const btnPrimary = {
  background: "#10B981",
  color: "var(--text-primary)",
  padding: "10px 18px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};

const btnSecondary = {
  background: "transparent",
  color: "var(--text-primary)",
  border: "1px solid rgba(255,255,255,0.2)",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
};

const btnAdd = {
  background: "rgba(16,185,129,0.1)",
  color: "#10B981",
  border: "1px solid rgba(16,185,129,0.3)",
  padding: "6px 12px",
  borderRadius: "8px",
  cursor: "pointer",
};

const btnDelete = {
  background: "rgba(239,68,68,0.1)",
  color: "#EF4444",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};

const errorText = {
  color: "#EF4444",
  fontSize: "12px",
};

const warningText = {
  color: "#F59E0B",
  fontSize: "12px",
};