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

type TabType = "importExport" | "stock" | "top" | "topImport";

import AdminLayout from "./AdminLayout";

export default function ReportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("importExport");

  const [importExport, setImportExport] = useState<any>(null);
  const [stock, setStock] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [topImportedProducts, setTopImportedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const baseURL = window.location.origin;

      const [res1, res2, res3, res4] = await Promise.all([
        axios.get(`${baseURL}/api/reports/import-export`, getAuthHeader()),
        axios.get(`${baseURL}/api/reports/stock`, getAuthHeader()),
        axios.get(`${baseURL}/api/reports/top-products`, getAuthHeader()),
        axios.get(`${baseURL}/api/reports/top-imported-products`, getAuthHeader())
      ]);

      // Xử lý sắp xếp ngày tăng dần
      if (res1.data && res1.data.labels) {
        const combined = res1.data.labels.map((label: string, index: number) => ({
          label,
          importVal: res1.data.imports[index] || 0,
          exportVal: res1.data.exports[index] || 0,
        }));

        combined.sort((a: any, b: any) => new Date(a.label).getTime() - new Date(b.label).getTime());

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
      setTopImportedProducts(res4.data);
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

  const chartColors = [
    "#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4",
    "#EC4899", "#8B5CF6", "#14B8A6", "#F43F5E", "#10B981"
  ];

  if (loading) return <AdminLayout><div style={{ color: "#fff", padding: 24 }}>Đang tải dữ liệu...</div></AdminLayout>;

  if (error) return (
    <AdminLayout>
      <div style={{ color: "#fff", padding: 24 }}>
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
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ color: "#fff", margin: 0 }}>📈 Reports Dashboard</h1>
        <button
          onClick={fetchReports}
          disabled={loading}
          style={{
            background: loading ? "#374151" : "#4F46E5",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "500",
            transition: "all 0.2s ease"
          }}
        >
          {loading ? "Đang tải..." : "🔄 Refresh"}
        </button>
      </div>

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

        <button
          style={activeTab === "topImport" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("topImport")}
        >
          🔥 Top sản phẩm nhập
        </button>
      </div>

      {/* CHART DISPLAY */}
      <div style={card}>

        {/* 1. BIỂU ĐỒ NHẬP XUẤT - đã sửa trục chỉ số nguyên */}
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
                    legend: { labels: { color: "#fff" } },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.dataset.label || '';
                          const value = context.raw as number;
                          return `${label}: ${value}`;
                        }
                      }
                    }
                  },
                  scales: {
                    x: { ticks: { color: "#9CA3AF" }, grid: { color: "rgba(255,255,255,0.05)" } },
                    y: { 
                      beginAtZero: true, 
                      ticks: { 
                        color: "#9CA3AF",
                        stepSize: 1,
                        callback: (value) => Number.isInteger(value) ? value.toString() : ''
                      }, 
                      grid: { color: "rgba(255,255,255,0.05)" } 
                    }
                  }
                }}
              />
            </div>
          </>
        )}

        {/* 2. BIỂU ĐỒ TRÒN (TỒN KHO) - TO RA 50-50 */}
        {activeTab === "stock" && (
          <>
            <h3 style={title}>Tồn kho theo sản phẩm</h3>
            <div style={{ 
              display: "flex", 
              flexWrap: "wrap",
              gap: "24px",
              alignItems: "center",
            }}>
              {/* Pie Chart - chiếm 50% */}
              <div style={{ flex: "1 1 50%", minWidth: "300px", height: "450px" }}>
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
                    layout: { padding: 20 },
                    plugins: {
                      legend: { display: false },
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

              {/* Custom Legend - chiếm 50% còn lại */}
              <div style={{
                flex: "1 1 40%",
                maxHeight: "450px",
                overflowY: "auto",
                paddingRight: "6px",
                scrollbarWidth: "thin",
                scrollbarColor: "#4B5563 #1F2937"
              }}
              className="custom-scrollbar"
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
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
                          gap: "12px",
                          padding: "8px 0",
                          borderBottom: "1px solid #374151"
                        }}
                      >
                        <div style={{
                          color: "#9CA3AF",
                          fontSize: "12px",
                          fontWeight: "500",
                          minWidth: "20px",
                          textAlign: "center"
                        }}>
                          {index + 1}
                        </div>
                        <div
                          style={{
                            width: "14px",
                            height: "14px",
                            borderRadius: "3px",
                            backgroundColor: color,
                            flexShrink: 0,
                            border: "1px solid rgba(255,255,255,0.2)"
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            color: "#fff",
                            fontSize: "13px",
                            fontWeight: "500",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}>
                            {item.name}
                          </div>
                        </div>
                        <div style={{
                          color: "#9CA3AF",
                          fontSize: "12px",
                          fontWeight: "500",
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

        {/* 3. BIỂU ĐỒ CỘT TOP SẢN PHẨM XUẤT - trục số nguyên */}
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
                      barThickness: 24
                    }
                  ]
                }}
                options={{
                  indexAxis: "y" as const,
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { labels: { color: "#fff" } },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const value = context.raw as number;
                          return `Số lượng xuất: ${value}`;
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                      ticks: { 
                        color: "#9CA3AF",
                        stepSize: 1,
                        callback: (value) => Number.isInteger(value) ? value.toString() : ''
                      },
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

        {/* 4. BIỂU ĐỒ CỘT TOP SẢN PHẨM NHẬP - trục số nguyên */}
        {activeTab === "topImport" && (
          <>
            <h3 style={title}>Top sản phẩm nhập (Dữ liệu thực tế từ DB)</h3>
            <div style={{ position: "relative", height: `${Math.max(400, topImportedProducts.length * 40)}px`, width: "100%" }}>
              <Bar
                data={{
                  labels: topImportedProducts.map((p) => p.name),
                  datasets: [
                    {
                      label: "Số lượng nhập",
                      data: topImportedProducts.map((p) => p.total),
                      backgroundColor: "#22C55E",
                      borderRadius: 6,
                      barThickness: 24
                    }
                  ]
                }}
                options={{
                  indexAxis: "y" as const,
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { labels: { color: "#fff" } },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const value = context.raw as number;
                          return `Số lượng nhập: ${value}`;
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                      ticks: { 
                        color: "#9CA3AF",
                        stepSize: 1,
                        callback: (value) => Number.isInteger(value) ? value.toString() : ''
                      },
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
    </AdminLayout>
  );
}

/* STYLES */
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