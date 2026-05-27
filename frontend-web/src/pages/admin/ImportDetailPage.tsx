import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/auth";

export default function ImportDetailPage() {
  const { id } = useParams();
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

  const handleComplete = async () => {
    try {
      await api.post(`/api/orders/import/${id}/done`);
      alert("✅ Đã hoàn thành đơn nhập");
      fetchDetail();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi complete");
    }
  };

  if (!order) return <div>Loading...</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE":
        return "lime";
      case "PROCESSING":
        return "orange";
      default:
        return "gray";
    }
  };

  return (
  <div style={{ padding: 20 }}>
    <h2>📥 Chi tiết đơn nhập</h2>

    {/* Sửa thành chữ thường .code */}
    <p><b>Mã:</b> {order.code}</p> 
    <p>
      <b>Trạng thái:</b>{" "}
      {/* Sửa thành chữ thường .status */}
      <span style={{ color: getStatusColor(order.status) }}>
        {order.status}
      </span>
    </p>

    {order.status !== "DONE" && (
      <button onClick={handleComplete}>
        ✅ Hoàn thành đơn
      </button>
    )}

    <h3 style={{ marginTop: 20 }}>Danh sách sản phẩm</h3>

    <table border={1} width="100%">
      <thead>
        <tr>
          <th>Product ID</th>
          <th>Số lượng</th>
          <th>Đã scan</th>
          <th>Tiến độ</th>
        </tr>
      </thead>

      <tbody>
        {/* Sửa thành .items */}
        {order.items?.map((i: any) => {
          // Sửa các trường bên trong item thành chữ thường tương ứng tag json ở backend
          const percent = Math.round(
            (i.scanned_quantity / i.quantity) * 100
          );

          return (
            <tr key={i.id}>
              <td>{i.product_id}</td>
              <td>{i.quantity}</td>
              <td>{i.scanned_quantity}</td>
              <td>{percent}%</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
}