// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import api from "../../api/auth";

// export default function ImportDetailPage() {
//   const { id } = useParams();
//   const [order, setOrder] = useState<any>(null);

//   const fetchDetail = async () => {
//     try {
//       const res = await api.get(`/api/orders/import/${id}`);
//       setOrder(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchDetail();
//   }, []);

//   const handleComplete = async () => {
//     try {
//       await api.post(`/api/orders/import/${id}/done`);
//       alert("✅ Đã hoàn thành đơn nhập");
//       fetchDetail();
//     } catch (err) {
//       console.error(err);
//       alert("❌ Lỗi khi complete");
//     }
//   };

//   if (!order) return <div>Loading...</div>;

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
//   <div style={{ padding: 20 }}>
//     <h2>📥 Chi tiết đơn nhập</h2>

//     {/* Sửa thành chữ thường .code */}
//     <p><b>Mã:</b> {order.code}</p> 
//     <p>
//       <b>Trạng thái:</b>{" "}
//       {/* Sửa thành chữ thường .status */}
//       <span style={{ color: getStatusColor(order.status) }}>
//         {order.status}
//       </span>
//     </p>

//     {order.status !== "DONE" && (
//       <button onClick={handleComplete}>
//         ✅ Hoàn thành đơn
//       </button>
//     )}

//     <h3 style={{ marginTop: 20 }}>Danh sách sản phẩm</h3>

//     <table border={1} width="100%">
//       <thead>
//         <tr>
//           <th>Product ID</th>
//           <th>Số lượng</th>
//           <th>Đã scan</th>
//           <th>Tiến độ</th>
//         </tr>
//       </thead>

//       <tbody>
//         {/* Sửa thành .items */}
//         {order.items?.map((i: any) => {
//           // Sửa các trường bên trong item thành chữ thường tương ứng tag json ở backend
//           const percent = Math.round(
//             (i.scanned_quantity / i.quantity) * 100
//           );

//           return (
//             <tr key={i.id}>
//               <td>{i.product_id}</td>
//               <td>{i.quantity}</td>
//               <td>{i.scanned_quantity}</td>
//               <td>{percent}%</td>
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   </div>
// );
// }


//bản giao diện
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../../api/auth";

// export default function ImportDetailPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [order, setOrder] = useState<any>(null);

//   const fetchDetail = async () => {
//     try {
//       const res = await api.get(`/api/orders/import/${id}`);
//       setOrder(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchDetail();
//   }, []);

//   const handleComplete = async () => {
//     try {
//       await api.post(`/api/orders/import/${id}/done`);
//       fetchDetail();
//     } catch (err) {
//       console.error(err);
//       alert("Lỗi khi complete");
//     }
//   };

//   const renderStatus = (status: string) => {
//     let bg = "rgba(107,114,128,0.1)";
//     let color = "#9CA3AF";

//     if (status === "DONE") {
//       bg = "rgba(16,185,129,0.1)";
//       color = "#10B981";
//     } else if (status === "PROCESSING") {
//       bg = "rgba(245,158,11,0.1)";
//       color = "#F59E0B";
//     }

//     return (
//       <span style={{
//         padding: "6px 12px",
//         borderRadius: "12px",
//         background: bg,
//         color: color,
//         fontSize: "12px",
//         fontWeight: 600
//       }}>
//         {status}
//       </span>
//     );
//   };

//   if (!order) {
//     return <div style={{ color: "#fff", padding: 20 }}>Loading...</div>;
//   }

//   return (
//     <div className="dashboard-root">
//       <main className="dashboard-main" style={{ padding: "24px" }}>

//         {/* HEADER */}
//         <div style={{ marginBottom: "24px" }}>
//           <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#fff" }}>
//             📥 Chi tiết đơn nhập
//           </h1>
//           <p style={{ color: "#9CA3AF" }}>
//             Theo dõi tiến độ nhập kho theo từng sản phẩm
//           </p>
//         </div>

//         {/* CARD INFO */}
//         <div style={card}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <div>
//               <p style={label}>Mã đơn</p>
//               <h2 style={{ color: "#38BDF8", fontFamily: "monospace" }}>
//                 {order.code}
//               </h2>
//             </div>

//             <div>
//               <p style={label}>Trạng thái</p>
//               {renderStatus(order.status)}
//             </div>
//           </div>

//           {order.status !== "DONE" && (
//             <button onClick={handleComplete} style={btnPrimary}>
//               ✅ Hoàn thành đơn
//             </button>
//           )}
//         </div>

//         {/* TABLE */}
//         <div style={card}>
//           <h3 style={{ color: "#fff", marginBottom: "16px" }}>
//             Danh sách sản phẩm
//           </h3>

//           <div style={{ overflowX: "auto" }}>
//             <table style={table}>
//               <thead>
//                 <tr style={thead}>
//                   <th>Product</th>
//                   <th>Số lượng</th>
//                   <th>Đã scan</th>
//                   <th>Tiến độ</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {order.items?.map((i: any) => {
//                   const percent = Math.round(
//                     (i.scanned_quantity / i.quantity) * 100
//                   );

//                   return (
//                     <tr key={i.id} style={row}>
//                       <td>{i.product_id}</td>
//                       <td>{i.quantity}</td>
//                       <td>{i.scanned_quantity}</td>

//                       <td>
//                         <div style={{ width: "100%" }}>
//                           <div style={progressBg}>
//                             <div
//                               style={{
//                                 ...progressBar,
//                                 width: `${percent}%`,
//                               }}
//                             />
//                           </div>
//                           <span style={{ fontSize: "12px", color: "#9CA3AF" }}>
//                             {percent}%
//                           </span>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* BACK */}
//         <button onClick={() => navigate(-1)} style={btnSecondary}>
//           ← Quay lại
//         </button>
//       </main>
//     </div>
//   );
// }

// /* ================= STYLE ================= */

// const card = {
//   background: "#1F2937",
//   borderRadius: "16px",
//   padding: "20px",
//   marginBottom: "20px",
//   border: "1px solid rgba(255,255,255,0.06)",
// };

// const label = {
//   color: "#9CA3AF",
//   fontSize: "12px",
// };

// const table = {
//   width: "100%",
//   borderCollapse: "collapse",
// };

// const thead = {
//   textAlign: "left" as const,
//   borderBottom: "1px solid rgba(255,255,255,0.1)",
//   color: "#9CA3AF",
// };

// const row = {
//   borderBottom: "1px solid rgba(255,255,255,0.05)",
// };

// const progressBg = {
//   width: "100%",
//   height: "8px",
//   background: "rgba(255,255,255,0.1)",
//   borderRadius: "8px",
//   overflow: "hidden",
// };

// const progressBar = {
//   height: "100%",
//   background: "#4F46E5",
// };

// const btnPrimary = {
//   marginTop: "16px",
//   background: "#10B981",
//   color: "#fff",
//   padding: "10px 16px",
//   borderRadius: "8px",
//   border: "none",
//   cursor: "pointer",
// };

// const btnSecondary = {
//   background: "transparent",
//   color: "#fff",
//   border: "1px solid rgba(255,255,255,0.2)",
//   padding: "10px 16px",
//   borderRadius: "8px",
//   cursor: "pointer",
// };


//bane sửa nút 
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/auth";

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

  const renderStatus = (status: string) => {
    let bg = "rgba(107,114,128,0.1)";
    let color = "#9CA3AF";

    if (status === "DONE") {
      bg = "rgba(16,185,129,0.1)";
      color = "#10B981";
    } else if (status === "PROCESSING") {
      bg = "rgba(245,158,11,0.1)";
      color = "#F59E0B";
    } else if (status === "CANCELLED") {
      bg = "rgba(239,68,68,0.1)";
      color = "#EF4444";
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
        {status}
      </span>
    );
  };

  if (!order) {
    return <div style={{ color: "#fff", padding: 20 }}>Loading...</div>;
  }

  return (
    <div className="dashboard-root">
      <main className="dashboard-main" style={{ padding: "24px" }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#fff" }}>
            📥 Chi tiết đơn nhập
          </h1>
          <p style={{ color: "#9CA3AF" }}>
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

          {order.status !== "DONE" && order.status !== "CANCELLED" && (
            <button onClick={handleCancel} style={{ ...btnPrimary, background: "#EF4444" }}>
              🗑️ Hủy đơn
            </button>
          )}
        </div>

        <div style={card}>
          <h3 style={{ color: "#fff", marginBottom: "16px" }}>
            Danh sách sản phẩm
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={table}>
              <thead>
                <tr style={thead}>
                  <th>Product</th>
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
                      <td>{i.product_id}</td>
                      <td>{i.quantity}</td>
                      <td>{i.scanned_quantity}</td>
                      <td>
                        <div style={{ width: "100%" }}>
                          <div style={progressBg}>
                            <div style={{ ...progressBar, width: `${percent}%` }} />
                          </div>
                          <span style={{ fontSize: "12px", color: "#9CA3AF" }}>
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
      </main>
    </div>
  );
}

const card = {
  background: "#1F2937",
  borderRadius: "16px",
  padding: "20px",
  marginBottom: "20px",
  border: "1px solid rgba(255,255,255,0.06)",
};

const label = {
  color: "#9CA3AF",
  fontSize: "12px",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const thead = {
  textAlign: "left" as const,
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  color: "#9CA3AF",
};

const row = {
  borderBottom: "1px solid rgba(255,255,255,0.05)",
};

const progressBg = {
  width: "100%",
  height: "8px",
  background: "rgba(255,255,255,0.1)",
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
  color: "#fff",
  padding: "10px 16px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};

const btnSecondary = {
  background: "transparent",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.2)",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
};