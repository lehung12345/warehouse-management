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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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
  Legend,
  Filler
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
  Legend,
  Filler
);

type TabType = "importExport" | "stock" | "top";

export default function ReportPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("importExport");

  const [importExport, setImportExport] = useState<any>(null);
  const [stock, setStock] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

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
      setError(null);
    } catch (error: any) {
      console.error("Lỗi khi tải dữ liệu báo cáo:", error);
      setError(error.message || "Không thể tải dữ liệu báo cáo");
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

  if (error) return (
    <div className="dashboard-main" style={{ color: "#fff", padding: 24 }}>
      <div style={{ background: "#1F2937", padding: "20px", borderRadius: "12px", border: "1px solid #EF4444" }}>
        <h3 style={{ color: "#EF4444", marginBottom: "12px" }}>Lỗi tải dữ liệu</h3>
        <p style={{ color: "#9CA3AF", marginBottom: "16px" }}>{error}</p>
        <button
          onClick={fetchReports}
          style={{
            background: "#4F46E5",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer"
          }}
        >
          Thử lại
        </button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-root">
      {/* Sidebar đồng bộ hệ thống */}
      <aside className="sidebar">
        <div className="sidebar-brand" onClick={() => navigate("/admin")} style={{ cursor: 'pointer' }}>
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="url(#sideGrad)" />
            <path d="M10 18L24 10L38 18V30L24 38L10 30V18Z" stroke="white" strokeWidth="2.5" fill="none" />
            <defs>
              <linearGradient id="sideGrad" x1="0" y1="0" x2="48" y2="48">
                <stop stopColor="#6366F1" />
                <stop offset="1" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
          <span>WareFlow</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Quản lý</div>
          <a className="nav-item" href="/admin">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Dashboard
          </a>
          <a className="nav-item" href="/admin/products">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Sản phẩm
          </a>
          <a className="nav-item" href="/admin/locations">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Kho
          </a>
          <div className="nav-section-title">Đơn hàng</div>
          <a className="nav-item" href="/admin/orders">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Đơn hàng
          </a>
          <a className="nav-item active" href="/admin/reports">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Báo cáo
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
            <div>
              <p className="user-name">{user?.username}</p>
              <p className="user-role-badge">ADMIN</p>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout} id="logout-btn">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Phần nội dung chính (Main Content) */}
      <main className="dashboard-main" style={{ padding: 24, minHeight: "100vh", background: "#111827" }}>

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
            <h3 style={title}>Nhập vs Xuất theo ngày (Sắp xếp tăng dần theo ngày)</h3>
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

        {/* 2. BIỂU ĐỒ TRÒN (TỒN KHO) - CUSTOM LEGEND SCROLLABLE */}
        {activeTab === "stock" && (
          <>
            <h3 style={title}>Tồn kho theo sản phẩm</h3>
            <div style={{ 
              display: "flex", 
              gap: "16px",
              maxHeight: "300px", 
              padding: "10px 0" 
            }}>
              {/* Pie Chart */}
              <div style={{ flex: "0 0 auto", width: "280px", height: "280px" }}>
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
                    layout: {
                      padding: 20
                    },
                    plugins: {
                      legend: {
                        display: false // Ẩn legend mặc định để dùng custom legend
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.raw as number || 0;
                            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                            return `${label}: ${value} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>

              {/* Custom Scrollable Legend */}
              <div style={{
                flex: "1",
                maxHeight: "280px",
                overflowY: "auto",
                overflowX: "hidden",
                paddingRight: "6px",
                scrollbarWidth: "thin",
                scrollbarColor: "#4B5563 #1F2937"
              }}
              className="custom-scrollbar"
              >
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px"
                }}>
                  {stock.map((item: any, index: number) => {
                    const color = chartColors[index % chartColors.length];
                    const total = stock.reduce((sum, s) => sum + s.quantity, 0);
                    const percentage = total > 0 ? ((item.quantity / total) * 100).toFixed(1) : '0';
                    
                    return (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "4px 0",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(75, 85, 99, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "2px",
                            backgroundColor: color,
                            flexShrink: 0,
                            border: "1px solid rgba(255,255,255,0.2)"
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            color: "#fff",
                            fontSize: "11px",
                            fontWeight: "400",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}>
                            {item.name}
                          </div>
                        </div>
                        <div style={{
                          color: "#9CA3AF",
                          fontSize: "10px",
                          flexShrink: 0
                        }}>
                          {item.quantity} ({percentage}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CSS cho scrollbar */}
            <style>
              {`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: #1F2937;
                  border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: #4B5563;
                  border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: #6B7280;
                }
              `}
            </style>
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
      </main>
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