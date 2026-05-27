import { useEffect, useState } from "react";
import {
  Bar,
  Pie,
  Line
} from "react-chartjs-2";

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

import axios from "axios";

export default function ReportPage() {
  const [importExport, setImportExport] = useState<any>(null);
  const [stock, setStock] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res1 = await axios.get("http://localhost:8080/api/reports/import-export");
      const res2 = await axios.get("http://localhost:8080/api/reports/stock");
      const res3 = await axios.get("http://localhost:8080/api/reports/top-products");

      setImportExport(res1.data);
      setStock(res2.data);
      setTopProducts(res3.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="dashboard-main">

      <h1>📈 Reports Dashboard</h1>

      {/* 1. IMPORT vs EXPORT */}
      <div className="stat-card">
        <h2>Nhập vs Xuất theo ngày</h2>

        {importExport && (
          <Line
            data={{
              labels: importExport.labels,
              datasets: [
                {
                  label: "Import",
                  data: importExport.imports,
                  borderColor: "blue"
                },
                {
                  label: "Export",
                  data: importExport.exports,
                  borderColor: "red"
                }
              ]
            }}
          />
        )}
      </div>

      {/* 2. STOCK PIE */}
      <div className="stat-card">
        <h2>Tồn kho theo sản phẩm</h2>

        {stock && (
          <Pie
            data={{
              labels: stock.map((s) => s.name),
              datasets: [
                {
                  data: stock.map((s) => s.quantity),
                  backgroundColor: [
                    "#6366F1",
                    "#22C55E",
                    "#F59E0B",
                    "#EF4444",
                    "#06B6D4"
                  ]
                }
              ]
            }}
          />
        )}
      </div>

      {/* 3. TOP PRODUCTS */}
      <div className="stat-card">
        <h2>Top sản phẩm bán chạy</h2>

        {topProducts && (
          <Bar
            data={{
              labels: topProducts.map((p) => p.name),
              datasets: [
                {
                  label: "Số lượng",
                  data: topProducts.map((p) => p.total),
                  backgroundColor: "#8B5CF6"
                }
              ]
            }}
          />
        )}
      </div>
    </div>
  );
}