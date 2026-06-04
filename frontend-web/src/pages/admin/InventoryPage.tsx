import { useEffect, useState } from "react";
import api from "../../api/auth";
import AdminLayout from "./AdminLayout";

export default function InventoryPage() {
  const [inventories, setInventories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMinQuantity, setEditingMinQuantity] = useState<{ [key: number]: number }>({});
  const [totalLowStockCount, setTotalLowStockCount] = useState(0);
  const [showOnlyLow, setShowOnlyLow] = useState(false);
  const pageSize = 10; 

  const fetchData = async (page: number) => {
    try {
      const res = await api.get(`/api/inventories?page=${page}&limit=${pageSize}`);
      if (res.data) {
        setInventories(res.data.data || []);
        setTotal(res.data.total || 0);
      }
    } catch (err) {
      console.error("Lỗi khi fetch dữ liệu tồn kho:", err);
      setInventories([]);
      setTotal(0);
    }
  };

  const fetchTotalLowStockCount = async () => {
    try {
      const res = await api.get(`/api/inventories?low=true&page=1&limit=10000`);
      if (res.data) {
        setTotalLowStockCount(res.data.total || 0);
      }
    } catch (err) {
      console.error("Lỗi khi fetch tổng cảnh báo tồn kho:", err);
      setTotalLowStockCount(0);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchTotalLowStockCount();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getProductInitial = (name: string) => {
    if (!name) return "P";
    const parts = name.trim().split(" ");
    return parts[parts.length - 1].charAt(0).toUpperCase();
  };

  const filteredData = inventories.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = (
      (item.product && item.product.toLowerCase().includes(term)) ||
      (item.sku && item.sku.toLowerCase().includes(term)) ||
      (item.location && item.location.toLowerCase().includes(term))
    );
    const matchesLowFilter = showOnlyLow ? item.status === "LOW" : true;
    return matchesSearch && matchesLowFilter;
  });

  const totalPages = Math.ceil(total / pageSize) || 1;
  const lowStockCount = inventories.filter((item) => item.status === "LOW").length;

  const handleMinQuantityChange = (inventoryId: number, value: number) => {
    setEditingMinQuantity(prev => ({ ...prev, [inventoryId]: value }));
  };

  const saveMinQuantity = async (inventoryId: number, value: number) => {
    try {
      await api.put(`/api/inventories/${inventoryId}/min-quantity`, { min_quantity: value });
      // Update local state
      setInventories(prev => prev.map(item => 
        item.id === inventoryId ? { ...item, min_quantity: value } : item
      ));
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng tối thiểu:", err);
    }
  };

  return (
    <AdminLayout>

        {/* Tiêu đề trang */}
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
            Quản lý Tồn kho
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Hệ thống giám sát và phân vị trí hàng hóa lưu kho thời gian thực
          </p>
        </div>

        {/* Cụm Badges thống kê */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--border)",
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "13px",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <span>📦</span> Tổng sản phẩm hệ thống: <strong style={{ color: "var(--text-primary)" }}>{total}</strong>
          </div>
          <div 
            onClick={() => setShowOnlyLow(!showOnlyLow)}
            style={{
              background: showOnlyLow ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.05)",
              border: showOnlyLow ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(239, 68, 68, 0.15)",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "13px",
              color: "#EF4444",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#EF4444" }}></span>
            Tổng cảnh báo tồn kho: <strong>{totalLowStockCount}</strong>
          </div>
          {showOnlyLow && (
            <button
              onClick={() => setShowOnlyLow(false)}
              style={{
                padding: "6px 14px",
                background: "var(--border)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                fontSize: "13px",
                color: "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              ✕ Xóa lọc
            </button>
          )}
        </div>

        {/* Thanh tìm kiếm */}
        <div style={{ marginBottom: "20px", display: "flex", gap: "12px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}>🔍</span>
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm trên trang hiện tại..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 40px",
                background: "var(--bg-overlay)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                color: "var(--text-primary)",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>
        </div>

        {/* Khung chứa bảng dữ liệu */}
        <div className="stat-card" style={{ padding: "0", overflow: "hidden", border: "1px solid var(--border)", background: "var(--bg-elevated)", borderRadius: "12px", display: "flex", flexDirection: "column" }}>
          <div style={{ overflowX: "auto", width: "100%", minHeight: "200px" }}>
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse", 
              textAlign: "left",
              tableLayout: "fixed"
            }}>
              <thead>
                <tr style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "14px 12px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", width: "50px", textAlign: "center", whiteSpace: "nowrap" }}>#</th>
                  <th style={{ padding: "14px 12px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", width: "200px", whiteSpace: "nowrap" }}>Sản phẩm</th>
                  <th style={{ padding: "14px 12px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", width: "120px", whiteSpace: "nowrap" }}>SKU</th>
                  <th style={{ padding: "14px 12px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", width: "100px", textAlign: "center", whiteSpace: "nowrap" }}>Số lượng</th>
                  <th style={{ padding: "14px 12px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", width: "100px", textAlign: "center", whiteSpace: "nowrap" }}>SL Tối thiểu</th>
                  <th style={{ padding: "14px 12px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", width: "300px", whiteSpace: "nowrap" }}>Vị trí (Kho &gt; Kệ &gt; Ô tầng)</th>
                  <th style={{ padding: "14px 12px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", width: "80px", textAlign: "center", whiteSpace: "nowrap" }}>Trạng thái</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)", fontSize: "14px" }}>
                      Không tìm thấy dữ liệu tồn kho phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                      <td style={{ padding: "14px 12px", color: "var(--text-secondary)", fontSize: "14px", textAlign: "center", whiteSpace: "nowrap" }}>
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td style={{ padding: "14px 12px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            minWidth: "30px",
                            width: "30px", 
                            height: "30px", 
                            borderRadius: "50%", 
                            background: "#4F46E5",
                            color: "var(--text-primary)", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            fontWeight: 600, 
                            fontSize: "12px",
                            flexShrink: 0
                          }}>
                            {getProductInitial(item.product)}
                          </div>
                          <span 
                            title={item.product}
                            className="truncate-cell"
                            style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: "13px", cursor: "help" }}
                          >
                            {item.product}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 12px", whiteSpace: "nowrap" }}>
                        <span 
                          title={item.sku}
                          className="truncate-cell"
                          style={{
                            fontFamily: "monospace", 
                            color: "var(--text-secondary)", 
                            background: "var(--border)",
                            padding: "3px 6px", 
                            borderRadius: "4px", 
                            fontSize: "12px", 
                            border: "1px solid rgba(255, 255, 255, 0.03)",
                            cursor: "help"
                          }}>
                          {item.sku}
                        </span>
                      </td>
                      <td style={{ 
                        padding: "14px 12px", 
                        fontWeight: 600, 
                        color: (item.min_quantity && item.quantity < item.min_quantity) ? "#EF4444" : "var(--text-primary)", 
                        fontSize: "14px",
                        textAlign: "center",
                        whiteSpace: "nowrap"
                      }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: "14px 12px", textAlign: "center", whiteSpace: "nowrap" }}>
                        <input
                          type="number"
                          min="0"
                          value={editingMinQuantity[item.id] !== undefined ? editingMinQuantity[item.id] : (item.min_quantity || 0)}
                          onChange={(e) => handleMinQuantityChange(item.id, parseInt(e.target.value) || 0)}
                          onBlur={() => saveMinQuantity(item.id, editingMinQuantity[item.id] !== undefined ? editingMinQuantity[item.id] : (item.min_quantity || 0))}
                          style={{
                            width: "70px",
                            padding: "6px 8px",
                            background: "var(--border)",
                            border: "1px solid var(--border)",
                            borderRadius: "6px",
                            color: "var(--text-primary)",
                            fontSize: "13px",
                            outline: "none",
                            textAlign: "center"
                          }}
                        />
                      </td>
                      <td style={{ padding: "14px 12px", color: "var(--text-primary)", fontSize: "13px", cursor: "help" }}>
                        <div title={item.location} className="truncate-cell">{item.location}</div>
                      </td>
                      <td style={{ padding: "14px 12px", textAlign: "center", whiteSpace: "nowrap" }}>
                        <span style={{
                          display: "inline-flex", 
                          alignItems: "center", 
                          gap: "6px",
                          background: item.status === "LOW" ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
                          color: item.status === "LOW" ? "#EF4444" : "#10B981",
                          padding: "4px 10px", 
                          borderRadius: "12px", 
                          fontSize: "12px", 
                          fontWeight: 500
                        }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: item.status === "LOW" ? "#EF4444" : "#10B981", flexShrink: 0 }}></span>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── THANH PHÂN TRANG: ĐỘC LẬP - FULL WIDTH DƯỚI ĐÁY BẢNG ── */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            background: "var(--bg-surface)",
            borderTop: "1px solid var(--border)",
            width: "100%",
            boxSizing: "border-box",
            flexWrap: "wrap",
            gap: "16px"
          }}>
            {/* Thống kê số dòng nằm bên trái */}
            <div style={{ color: "var(--text-secondary)", fontSize: "13px", whiteSpace: "nowrap" }}>
              Hiển thị từ <strong>{total === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> đến <strong>{Math.min(currentPage * pageSize, total)}</strong> trên tổng số <strong>{total}</strong> dòng dữ liệu
            </div>
            
            {/* Cụm nút bấm chuyển trang nằm bên phải độc lập */}
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                style={{
                  padding: "6px 14px",
                  background: currentPage === 1 ? "rgba(255,255,255,0.02)" : "#374151",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  color: currentPage === 1 ? "#4B5563" : "var(--text-primary)",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontSize: "13px",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap"
                }}
              >
                ◀ Trước
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      minWidth: "32px",
                      height: "32px",
                      background: isActive ? "#4F46E5" : "transparent",
                      border: isActive ? "none" : "1px solid var(--border)",
                      borderRadius: "6px",
                      color: "var(--text-primary)",
                      fontWeight: isActive ? 600 : 400,
                      cursor: "pointer",
                      fontSize: "13px",
                      transition: "all 0.2s"
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                style={{
                  padding: "6px 14px",
                  background: currentPage === totalPages ? "rgba(255,255,255,0.02)" : "#374151",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  color: currentPage === totalPages ? "#4B5563" : "var(--text-primary)",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  fontSize: "13px",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap"
                }}
              >
                Sau ▶
              </button>
            </div>
          </div>

        </div>
    </AdminLayout>
  );
}