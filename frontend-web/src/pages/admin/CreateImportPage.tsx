import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

export default function CreateImportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [items, setItems] = useState<any[]>([]);

  const addItem = () => {
    setItems([
      ...items,
      { product_id: "", location_id: "", quantity: 0 }
    ]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleCreate = async () => {
    try {
      await api.post("/api/orders/import", {
        code,
        user_id: user?.id,
        status: "PENDING",
        items, // 🔥 FIX CHÍNH
      });

      alert("Tạo đơn thành công!");
      navigate("/admin/orders");
    } catch (err) {
      console.error(err);
      alert("Lỗi tạo đơn");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📥 Tạo đơn nhập</h2>

      <input
        placeholder="Mã đơn"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <h3>Danh sách sản phẩm</h3>

      {items.map((item, index) => (
        <div key={index}>
          <input
            placeholder="Product ID"
            onChange={(e) =>
              updateItem(index, "product_id", Number(e.target.value))
            }
          />

          <input
            placeholder="Location ID"
            onChange={(e) =>
              updateItem(index, "location_id", Number(e.target.value))
            }
          />

          <input
            type="number"
            placeholder="Quantity"
            onChange={(e) =>
              updateItem(index, "quantity", Number(e.target.value))
            }
          />
        </div>
      ))}

      <button onClick={addItem}>+ Thêm sản phẩm</button>

      <br /><br />

      <button onClick={handleCreate}>Tạo đơn</button>
    </div>
  );
}