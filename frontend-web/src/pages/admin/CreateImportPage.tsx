// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../api/auth";
// import { useAuth } from "../../context/AuthContext";

// export default function CreateImportPage() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [code, setCode] = useState("");
//   const [items, setItems] = useState<any[]>([]);

//   const addItem = () => {
//     setItems([
//       ...items,
//       { product_id: "", location_id: "", quantity: 0 }
//     ]);
//   };

//   const updateItem = (index: number, field: string, value: any) => {
//     const newItems = [...items];
//     newItems[index][field] = value;
//     setItems(newItems);
//   };

//   const handleCreate = async () => {
//     try {
//       await api.post("/api/orders/import", {
//         code,
//         user_id: user?.id,
//         status: "PENDING",
//         items, // 🔥 FIX CHÍNH
//       });

//       alert("Tạo đơn thành công!");
//       navigate("/admin/orders");
//     } catch (err) {
//       console.error(err);
//       alert("Lỗi tạo đơn");
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>📥 Tạo đơn nhập</h2>

//       <input
//         placeholder="Mã đơn"
//         value={code}
//         onChange={(e) => setCode(e.target.value)}
//       />

//       <h3>Danh sách sản phẩm</h3>

//       {items.map((item, index) => (
//         <div key={index}>
//           <input
//             placeholder="Product ID"
//             onChange={(e) =>
//               updateItem(index, "product_id", Number(e.target.value))
//             }
//           />

//           <input
//             placeholder="Location ID"
//             onChange={(e) =>
//               updateItem(index, "location_id", Number(e.target.value))
//             }
//           />

//           <input
//             type="number"
//             placeholder="Quantity"
//             onChange={(e) =>
//               updateItem(index, "quantity", Number(e.target.value))
//             }
//           />
//         </div>
//       ))}

//       <button onClick={addItem}>+ Thêm sản phẩm</button>

//       <br /><br />

//       <button onClick={handleCreate}>Tạo đơn</button>
//     </div>
//   );
// }


//bản giao diện
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

export default function CreateImportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});

  /* ================= ADD / UPDATE ================= */
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

    if (!code.trim()) {
      newErrors.code = "Không được để trống mã đơn";
    }

    if (items.length === 0) {
      newErrors.items = "Phải có ít nhất 1 sản phẩm";
    }

    const itemErrors: any[] = [];

    items.forEach((item, index) => {
      let err: any = {};

      if (!item.product_id || item.product_id <= 0) {
        err.product_id = "Product ID > 0";
      }

      if (!item.location_id || item.location_id <= 0) {
        err.location_id = "Location ID > 0";
      }

      if (!item.quantity || item.quantity <= 0) {
        err.quantity = "Số lượng > 0";
      }

      itemErrors[index] = err;
    });

    newErrors.itemErrors = itemErrors;

    setErrors(newErrors);

    const hasItemError = itemErrors.some(
      (e) => Object.keys(e).length > 0
    );

    return !newErrors.code && !newErrors.items && !hasItemError;
  };

  /* ================= SUBMIT ================= */
  const handleCreate = async () => {
    if (!validate()) return;

    try {
      await api.post("/api/orders/import", {
        code,
        user_id: user?.id,
        status: "PENDING",
        items,
      });

      alert("Tạo đơn thành công!");
      navigate("/admin/orders");
    } catch (err) {
      console.error(err);
      alert("Lỗi tạo đơn");
    }
  };

  return (
    <div className="dashboard-root">
      <main className="dashboard-main" style={{ padding: "24px" }}>

        {/* HEADER */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#fff" }}>
            📥 Tạo đơn nhập kho
          </h1>
          <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
            Tạo phiếu nhập hàng vào kho
          </p>
        </div>

        {/* CARD */}
        <div style={card}>

          {/* CODE */}
          <div style={{ marginBottom: "20px" }}>
            <label style={label}>Mã đơn</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="VD: IMP-001"
              style={input}
            />
            {errors.code && <p style={errorText}>{errors.code}</p>}
          </div>

          {/* ITEMS */}
          <div style={{ marginBottom: "20px" }}>
            <div style={rowBetween}>
              <h3 style={{ color: "#fff" }}>Danh sách sản phẩm</h3>
              <button onClick={addItem} style={btnAdd}>
                + Thêm
              </button>
            </div>

            {errors.items && <p style={errorText}>{errors.items}</p>}

            {items.length === 0 && (
              <p style={{ color: "#6B7280" }}>Chưa có sản phẩm</p>
            )}

            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {items.map((item, index) => (
                <div key={index} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  
                  <div style={itemRow}>
                    <input
                      placeholder="Product ID"
                      style={inputSmall}
                      onChange={(e) =>
                        updateItem(index, "product_id", Number(e.target.value))
                      }
                    />

                    <input
                      placeholder="Location ID"
                      style={inputSmall}
                      onChange={(e) =>
                        updateItem(index, "location_id", Number(e.target.value))
                      }
                    />

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
                </div>
              ))}
            </div>
          </div>

          {/* ACTION */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={handleCreate} style={btnPrimary}>
              ✅ Tạo đơn
            </button>

            <button onClick={() => navigate(-1)} style={btnSecondary}>
              ← Quay lại
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= STYLE ================= */

const card = {
  background: "#1F2937",
  borderRadius: "16px",
  padding: "24px",
  border: "1px solid rgba(255,255,255,0.06)",
};

const label = {
  display: "block",
  marginBottom: "6px",
  color: "#9CA3AF",
  fontSize: "13px",
};

const input = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "#111827",
  color: "#fff",
};

const inputSmall = {
  flex: 1,
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "#111827",
  color: "#fff",
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
  background: "#4F46E5",
  color: "#fff",
  padding: "10px 18px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};

const btnSecondary = {
  background: "transparent",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.2)",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
};

const btnAdd = {
  background: "rgba(79,70,229,0.1)",
  color: "#4F46E5",
  border: "1px solid rgba(79,70,229,0.3)",
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