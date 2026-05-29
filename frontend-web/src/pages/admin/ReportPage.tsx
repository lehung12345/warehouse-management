// import { useEffect, useState } from "react";
// import {
//   Bar,
//   Pie,
//   Line
// } from "react-chartjs-2";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Tooltip,
//   Legend
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Tooltip,
//   Legend
// );

// import axios from "axios";

// export default function ReportPage() {
//   const [importExport, setImportExport] = useState<any>(null);
//   const [stock, setStock] = useState<any[]>([]);
//   const [topProducts, setTopProducts] = useState<any[]>([]);

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   const fetchReports = async () => {
//     try {
//       const res1 = await axios.get("http://localhost:8080/api/reports/import-export");
//       const res2 = await axios.get("http://localhost:8080/api/reports/stock");
//       const res3 = await axios.get("http://localhost:8080/api/reports/top-products");

//       setImportExport(res1.data);
//       setStock(res2.data);
//       setTopProducts(res3.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="dashboard-main">

//       <h1>📈 Reports Dashboard</h1>

//       {/* 1. IMPORT vs EXPORT */}
//       <div className="stat-card">
//         <h2>Nhập vs Xuất theo ngày</h2>

//         {importExport && (
//           <Line
//             data={{
//               labels: importExport.labels,
//               datasets: [
//                 {
//                   label: "Import",
//                   data: importExport.imports,
//                   borderColor: "blue"
//                 },
//                 {
//                   label: "Export",
//                   data: importExport.exports,
//                   borderColor: "red"
//                 }
//               ]
//             }}
//           />
//         )}
//       </div>

//       {/* 2. STOCK PIE */}
//       <div className="stat-card">
//         <h2>Tồn kho theo sản phẩm</h2>

//         {stock && (
//           <Pie
//             data={{
//               labels: stock.map((s) => s.name),
//               datasets: [
//                 {
//                   data: stock.map((s) => s.quantity),
//                   backgroundColor: [
//                     "#6366F1",
//                     "#22C55E",
//                     "#F59E0B",
//                     "#EF4444",
//                     "#06B6D4"
//                   ]
//                 }
//               ]
//             }}
//           />
//         )}
//       </div>

//       {/* 3. TOP PRODUCTS */}
//       <div className="stat-card">
//         <h2>Top sản phẩm bán chạy</h2>

//         {topProducts && (
//           <Bar
//             data={{
//               labels: topProducts.map((p) => p.name),
//               datasets: [
//                 {
//                   label: "Số lượng",
//                   data: topProducts.map((p) => p.total),
//                   backgroundColor: "#8B5CF6"
//                 }
//               ]
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

//bản xịn

// import { useEffect, useState } from "react";
// import {
//   Bar,
//   Pie,
//   Line
// } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Tooltip,
//   Legend
// } from "chart.js";
// import axios from "axios";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Tooltip,
//   Legend
// );

// interface ImportExportData {
//   labels: string[];
//   imports: number[];
//   exports: number[];
// }

// interface StockItem {
//   name: string;
//   quantity: number;
// }

// interface TopProduct {
//   name: string;
//   total: number;
// }

// export default function ReportPage() {
//   const [importExport, setImportExport] = useState<ImportExportData | null>(null);
//   const [stock, setStock] = useState<StockItem[]>([]);
//   const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const getAuthHeader = () => {
//     const token = localStorage.getItem("token");
//     return {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };
//   };

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   const fetchReports = async () => {
//     try {
//       setLoading(true);
//       const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";
//       const [res1, res2, res3] = await Promise.all([
//         axios.get(`${baseURL}/api/reports/import-export`, getAuthHeader()),
//         axios.get(`${baseURL}/api/reports/stock`, getAuthHeader()),
//         axios.get(`${baseURL}/api/reports/top-products`, getAuthHeader())
//       ]);
//       setImportExport(res1.data);
//       setStock(res2.data);
//       setTopProducts(res3.data);
//       setError(null);
//     } catch (err: any) {
//       console.error(err);
//       setError(err.message || "Không thể tải dữ liệu báo cáo");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="dashboard-main">
//         <div className="loading-spinner">Đang tải dữ liệu...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="dashboard-main">
//         <div className="error-message">Lỗi: {error}</div>
//         <button onClick={fetchReports}>Thử lại</button>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-main">
//       <h1>📈 Reports Dashboard</h1>

//       {/* 1. IMPORT vs EXPORT theo ngày */}
//       <div className="stat-card">
//         <h2>Nhập vs Xuất theo ngày</h2>
//         {importExport && importExport.labels && importExport.labels.length > 0 ? (
//           <Line
//             data={{
//               labels: importExport.labels,
//               datasets: [
//                 {
//                   label: "Nhập kho (Import)",
//                   data: importExport.imports,
//                   borderColor: "#3B82F6",
//                   backgroundColor: "rgba(59,130,246,0.1)",
//                   tension: 0.3,
//                   fill: true
//                 },
//                 {
//                   label: "Xuất kho (Export)",
//                   data: importExport.exports,
//                   borderColor: "#EF4444",
//                   backgroundColor: "rgba(239,68,68,0.1)",
//                   tension: 0.3,
//                   fill: true
//                 }
//               ]
//             }}
//             options={{
//               responsive: true,
//               plugins: {
//                 legend: { position: "top" },
//                 tooltip: { mode: "index", intersect: false }
//               }
//             }}
//           />
//         ) : (
//           <p>Không có dữ liệu nhập/xuất</p>
//         )}
//       </div>

//       {/* 2. Tồn kho theo sản phẩm (Pie) */}
//       <div className="stat-card">
//         <h2>Tồn kho theo sản phẩm</h2>
//         {stock && stock.length > 0 ? (
//           <Pie
//             data={{
//               labels: stock.map((s) => s.name),
//               datasets: [
//                 {
//                   data: stock.map((s) => s.quantity),
//                   backgroundColor: [
//                     "#6366F1",
//                     "#22C55E",
//                     "#F59E0B",
//                     "#EF4444",
//                     "#06B6D4",
//                     "#8B5CF6",
//                     "#EC4899",
//                     "#14B8A6",
//                     "#F97316",
//                     "#64748B"
//                   ],
//                   borderWidth: 1
//                 }
//               ]
//             }}
//             options={{
//               responsive: true,
//               plugins: {
//                 legend: { position: "right" },
//                 tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw} sản phẩm` } }
//               }
//             }}
//           />
//         ) : (
//           <p>Không có dữ liệu tồn kho</p>
//         )}
//       </div>

//       {/* 3. Top sản phẩm bán chạy (Bar) */}
//       <div className="stat-card">
//         <h2>Top 10 sản phẩm xuất nhiều nhất</h2>
//         {topProducts && topProducts.length > 0 ? (
//           <Bar
//             data={{
//               labels: topProducts.map((p) => p.name),
//               datasets: [
//                 {
//                   label: "Số lượng đã xuất",
//                   data: topProducts.map((p) => p.total),
//                   backgroundColor: "#8B5CF6",
//                   borderRadius: 8
//                 }
//               ]
//             }}
//             options={{
//               responsive: true,
//               indexAxis: "y",
//               plugins: {
//                 legend: { position: "top" },
//                 tooltip: { callbacks: { label: (ctx) => `${ctx.raw} sản phẩm` } }
//               }
//             }}
//           />
//         ) : (
//           <p>Chưa có dữ liệu xuất kho</p>
//         )}
//       </div>
//     </div>
//   );
// }


//bản sửa giao diện 
import { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

type TabType = "importExport" | "stock" | "top";

export default function ReportPage() {
  const [activeTab, setActiveTab] = useState<TabType>("importExport");

  const [importExport, setImportExport] = useState<any>(null);
  const [stock, setStock] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";

      const [res1, res2, res3] = await Promise.all([
        axios.get(`${baseURL}/api/reports/import-export`, getAuthHeader()),
        axios.get(`${baseURL}/api/reports/stock`, getAuthHeader()),
        axios.get(`${baseURL}/api/reports/top-products`, getAuthHeader())
      ]);

      // 1. XỬ LÝ SẮP XẾP NGÀY TĂNG DẦN
      if (res1.data && res1.data.labels) {
        const combined = res1.data.labels.map((label: string, index: number) => ({
          label,
          importVal: res1.data.imports[index] || 0,
          exportVal: res1.data.exports[index] || 0,
        }));

        // Sắp xếp theo chuỗi thời gian tăng dần
        combined.sort((a: any, b: any) => new Date(a.label).getTime() - new Date(b.label).getTime());

        // Định dạng lại ngày hiển thị cho gọn, dễ nhìn hơn (DD/MM/YYYY) nếu cần
        setImportExport({
          labels: combined.map((c: any) => {
            const d = new Date(c.label);
            return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
          }),
          imports: combined.map((c: any) => c.importVal),
          exports: combined.map((c: any) => c.exportVal),
        });
      } else {
        setImportExport(res1.data);
      }

      setStock(res2.data);
      setTopProducts(res3.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu báo cáo:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalImport = importExport?.imports?.reduce((a: number, b: number) => a + b, 0) || 0;
  const totalExport = importExport?.exports?.reduce((a: number, b: number) => a + b, 0) || 0;
  const totalStock = stock.reduce((a, b) => a + b.quantity, 0);

  // Mảng màu sắc cố định đa dạng cho biểu đồ tròn để không bị lặp màu
  const chartColors = [
    "#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4",
    "#EC4899", "#8B5CF6", "#14B8A6", "#F43F5E", "#10B981"
  ];

  if (loading) return <div className="dashboard-main" style={{ color: "#fff", padding: 24 }}>Đang tải dữ liệu...</div>;

  return (
    <div className="dashboard-main" style={{ padding: 24, minHeight: "100vh", background: "#111827" }}>

      {/* HEADER */}
      <h1 style={{ color: "#fff", marginBottom: 24 }}>📈 Reports Dashboard</h1>

      {/* KPI */}
      <div style={grid3}>
        <div style={kpiCard}>
          <p style={{ color: "#9CA3AF", margin: "0 0 8px 0" }}>Tổng nhập</p>
          <h2 style={{ color: "#3B82F6", margin: 0 }}>{totalImport}</h2>
        </div>

        <div style={kpiCard}>
          <p style={{ color: "#9CA3AF", margin: "0 0 8px 0" }}>Tổng xuất</p>
          <h2 style={{ color: "#EF4444", margin: 0 }}>{totalExport}</h2>
        </div>

        <div style={kpiCard}>
          <p style={{ color: "#9CA3AF", margin: "0 0 8px 0" }}>Tồn kho</p>
          <h2 style={{ color: "#10B981", margin: 0 }}>{totalStock}</h2>
        </div>
      </div>

      {/* TAB BAR */}
      <div style={tabBar}>
        <button
          style={activeTab === "importExport" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("importExport")}
        >
          📈 Nhập / Xuất theo ngày
        </button>

        <button
          style={activeTab === "stock" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("stock")}
        >
          📦 Tồn kho theo sản phẩm
        </button>

        <button
          style={activeTab === "top" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("top")}
        >
          🔥 Top sản phẩm xuất
        </button>
      </div>

      {/* CHART DISPLAY */}
      <div style={card}>

        {/* 1. BIỂU ĐỒ NHẬP XUẤT */}
        {activeTab === "importExport" && importExport && (
          <>
            <h3 style={title}>Nhập vs Xuất theo ngày (Sắp xếp tăng dần)</h3>
            <div style={{ position: "relative", height: "450px", width: "100%" }}>
              <Line
                data={{
                  labels: importExport.labels,
                  datasets: [
                    {
                      label: "Nhập",
                      data: importExport.imports,
                      borderColor: "#3B82F6",
                      backgroundColor: "rgba(59,130,246,0.1)",
                      fill: true,
                      tension: 0.2
                    },
                    {
                      label: "Xuất",
                      data: importExport.exports,
                      borderColor: "#EF4444",
                      backgroundColor: "rgba(239,68,68,0.1)",
                      fill: true,
                      tension: 0.2
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { labels: { color: "#fff" } }
                  },
                  scales: {
                    x: { ticks: { color: "#9CA3AF" }, grid: { color: "rgba(255,255,255,0.05)" } },
                    y: { 
                      beginAtZero: true, 
                      ticks: { color: "#9CA3AF" }, 
                      grid: { color: "rgba(255,255,255,0.05)" } 
                    }
                  }
                }}
              />
            </div>
          </>
        )}

        {/* 2. BIỂU ĐỒ TRÒN (TỒN KHO) - ĐÃ CÂN ĐỐI KÍCH THƯỚC & ĐỀU DÒNG */}
        {activeTab === "stock" && (
          <>
            <h3 style={title}>Tồn kho theo sản phẩm</h3>
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              maxHeight: "400px", 
              padding: "10px 0" 
            }}>
              <div style={{ width: "100%", height: "380px" }}>
                <Pie
                  data={{
                    labels: stock.map((s) => s.name),
                    datasets: [
                      {
                        data: stock.map((s) => s.quantity),
                        backgroundColor: stock.map((_, i) => chartColors[i % chartColors.length]),
                        borderWidth: 1,
                        borderColor: "#1F2937"
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "right" as const, // Đẩy sang phải để cột chữ không đè lên hình tròn
                        labels: {
                          color: "#fff",
                          boxWidth: 16,
                          padding: 12,
                          font: { size: 12 }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* 3. BIỂU ĐỒ CỘT TOP SẢN PHẨM (DỮ LIỆU THỰC DB) */}
        {activeTab === "top" && (
          <>
            <h3 style={title}>Top sản phẩm xuất (Dữ liệu thực tế từ DB)</h3>
            <div style={{ position: "relative", height: `${Math.max(400, topProducts.length * 40)}px`, width: "100%" }}>
              <Bar
                data={{
                  labels: topProducts.map((p) => p.name),
                  datasets: [
                    {
                      label: "Số lượng xuất",
                      data: topProducts.map((p) => p.total),
                      backgroundColor: "#8B5CF6",
                      borderRadius: 6,
                      barThickness: 24 // Cố định độ rộng của cột để không bị quá to khi ít phần tử
                    }
                  ]
                }}
                options={{
                  indexAxis: "y" as const,
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { labels: { color: "#fff" } }
                  },
                  scales: {
                    x: {
                      beginAtZero: true, // Tự động co dãn theo data thật (lên hàng nghìn), không fix cứng 100 nữa
                      ticks: { color: "#9CA3AF" },
                      grid: { color: "rgba(255,255,255,0.05)" }
                    },
                    y: {
                      ticks: { color: "#fff", font: { size: 12 } },
                      grid: { display: false }
                    }
                  }
                }}
              />
            </div>
          </>
        )}

      </div>
    </div>
  );
}

/* STYLE CHUẨN ĐẸP */
const grid3 = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
  marginBottom: "20px"
};

const kpiCard = {
  background: "#1F2937",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center" as const,
  border: "1px solid #374151"
};

const tabBar = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "12px",
  marginBottom: "20px"
};

const tabStyle = {
  padding: "10px 20px",
  borderRadius: "8px",
  background: "#374151",
  color: "#9CA3AF",
  border: "none",
  fontWeight: "500" as const,
  cursor: "pointer",
  transition: "all 0.2s ease"
};

const activeTabStyle = {
  ...tabStyle,
  background: "#4F46E5",
  color: "#fff"
};

const card = {
  background: "#1F2937",
  padding: "24px",
  borderRadius: "14px",
  border: "1px solid #374151"
};

const title = {
  color: "#fff",
  marginTop: 0,
  marginBottom: "20px",
  fontWeight: "600" as const
};