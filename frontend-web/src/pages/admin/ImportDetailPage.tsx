import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/auth";
import AdminLayout from "./AdminLayout";

export default function ImportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/api/orders/import/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  // Helper function to build location path
  const buildLocationPath = (location: any): string => {
    if (!location) return "";
    const parts: string[] = [];
    let current = location;

    // Traverse up the parent chain
    while (current) {
      parts.unshift(current.name);
      current = current.parent;
    }

    return parts.join(" → ");
  };

  const handleCancel = async () => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn nhập này?")) return;
    try {
      await api.post(`/api/orders/import/${id}/cancel`);
      fetchDetail();
    } catch (err) {
      console.error(err);
      alert("Hủy đơn thất bại");
    }
  };

  const handleApprove = async () => {
    if (!confirm("Bạn có chắc chắn muốn duyệt đơn nhập này? Hàng sẽ được cộng vào tồn kho.")) return;
    try {
      await api.post(`/api/orders/import/${id}/approve`);
      fetchDetail();
      alert("Đã duyệt đơn nhập thành công!");
    } catch (err) {
      console.error(err);
      alert("Duyệt đơn thất bại");
    }
  };

  const renderStatus = (status: string) => {
    let bg = "rgba(107,114,128,0.1)";
    let color = "var(--text-secondary)";

    if (status === "DONE") {
      bg = "rgba(16,185,129,0.1)";
      color = "#10B981";
    } else if (status === "PROCESSING") {
      bg = "rgba(245,158,11,0.1)";
      color = "#F59E0B";
    } else if (status === "CANCELLED") {
      bg = "rgba(239,68,68,0.1)";
      color = "#EF4444";
    } else if (status === "APPROVED") {
      bg = "rgba(59,130,246,0.1)";
      color = "#3B82F6";
    }

    return (
      <span
        style={{
          padding: "6px 12px",
          borderRadius: "12px",
          background: bg,
          color: color,
          fontSize: "12px",
          fontWeight: 600,
        }}
      >
        {status === "APPROVED" ? "ĐÃ DUYỆT" : status}
      </span>
    );
  };

  if (!order) {
    return <AdminLayout><div style={{ color: "var(--text-primary)", padding: 20 }}>Loading...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--text-primary)" }}>
            📥 Chi tiết đơn nhập
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Theo dõi tiến độ nhập kho theo từng sản phẩm
          </p>
        </div>

        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={label}>Mã đơn</p>
              <h2 style={{ color: "#38BDF8", fontFamily: "monospace" }}>
                {order.code}
              </h2>
            </div>
            <div>
              <p style={label}>Trạng thái</p>
              {renderStatus(order.status)}
            </div>
          </div>

          {order.status !== "DONE" && order.status !== "CANCELLED" && order.status !== "APPROVED" && (
            <button onClick={handleCancel} style={{ ...btnPrimary, background: "#EF4444" }}>
              🗑️ Hủy đơn
            </button>
          )}

          {order.status === "DONE" && (
            <button onClick={handleApprove} style={btnPrimary}>
              ✅ Duyệt đơn
            </button>
          )}

          {order.status === "APPROVED" && (
            <button disabled style={{ ...btnPrimary, background: "#3B82F6", opacity: 0.7 }}>
              ✅ Đã duyệt
            </button>
          )}
        </div>

        <div style={card}>
          <h3 style={{ color: "var(--text-primary)", marginBottom: "16px" }}>
            Danh sách sản phẩm
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={table}>
              <thead>
                <tr style={thead}>
                  <th>Product</th>
                  <th>Vị trí</th>
                  <th>Số lượng</th>
                  <th>Đã scan</th>
                  <th>Tiến độ</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((i: any) => {
                  const percent = Math.round((i.scanned_quantity / i.quantity) * 100);
                  return (
                    <tr key={i.id} style={row}>
                      <td>
                        <div>
                          <div style={{ fontWeight: 500, color: "#E5E7EB" }}>
                            {i.product?.name || i.product_id}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div style={{ fontWeight: 500, color: "#E5E7EB" }}>
                            {buildLocationPath(i.location) || i.location_id}
                          </div>
                        </div>
                      </td>
                      <td>{i.quantity}</td>
                      <td>{i.scanned_quantity}</td>
                      <td>
                        <div style={{ width: "100%" }}>
                          <div style={progressBg}>
                            <div style={{ ...progressBar, width: `${percent}%` }} />
                          </div>
                          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                            {percent}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <button onClick={() => navigate(-1)} style={btnSecondary}>
          ← Quay lại
        </button>
    </AdminLayout>
  );
}

const card = {
  background: "var(--bg-elevated)",
  borderRadius: "16px",
  padding: "20px",
  marginBottom: "20px",
  border: "1px solid var(--border)",
};

const label = {
  color: "var(--text-secondary)",
  fontSize: "12px",
};

const table = {
  width: "100%",
  borderCollapse: "collapse" as any,
};

const thead = {
  textAlign: "left" as const,
  borderBottom: "1px solid var(--border)",
  color: "var(--text-secondary)",
};

const row = {
  borderBottom: "1px solid var(--border)",
};

const progressBg = {
  width: "100%",
  height: "8px",
  background: "var(--border)",
  borderRadius: "8px",
  overflow: "hidden",
};

const progressBar = {
  height: "100%",
  background: "#4F46E5",
};

const btnPrimary = {
  marginTop: "16px",
  background: "#10B981",
  color: "var(--text-primary)",
  padding: "10px 16px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};

const btnSecondary = {
  background: "transparent",
  color: "var(--text-primary)",
  border: "1px solid rgba(255,255,255,0.2)",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
};