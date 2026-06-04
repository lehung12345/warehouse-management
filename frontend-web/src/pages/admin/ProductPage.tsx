import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import JsBarcode from "jsbarcode";
import { QRCodeSVG } from "qrcode.react";
import {
  getProductsAPI,
  createProductAPI,
  deleteProductAPI,
  updateProductAPI,
} from "../../api/product";
import AdminLayout from "./AdminLayout";

export default function ProductPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [rfid, setRfid] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalProduct, setModalProduct] = useState<any>(null);
  const [modalType, setModalType] = useState<"qr" | "barcode">("qr");

  const fetchProducts = async () => {
    try {
      const res = await getProductsAPI();
      setProducts(res.data || []);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Nhập tên sản phẩm");
    try {
      if (editingId) {
        await updateProductAPI(editingId, { name, unit, rfid_code: rfid });
        setEditingId(null);
      } else {
        await createProductAPI({ name, unit, rfid_code: rfid });
      }
      setName("");
      setUnit("");
      setRfid("");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi thêm/sửa");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    await deleteProductAPI(id);
    fetchProducts();
  };

  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(searchLower) ||
      product.barcode?.toLowerCase().includes(searchLower) ||
      product.sku?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <AdminLayout>
      {/* Custom scrollbar style */}
      <style>{`
        .product-table-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .product-table-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .product-table-scroll::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 4px;
        }
        .product-table-scroll::-webkit-scrollbar-thumb:hover {
          background: #4B5563;
        }
        .product-table-scroll {
          scrollbar-width: thin;
          scrollbar-color: #374151 transparent;
        }
      `}</style>

      <header className="dashboard-header">
        <div>
          <h1>Quản lý sản phẩm</h1>
          <p>Xem, thêm mới hoặc xóa sản phẩm trong hệ thống kho.</p>
        </div>
      </header>

      {/* Form thêm / sửa sản phẩm */}
      <div className="stat-card" style={{ display: 'block', marginBottom: '24px', padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
          {editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
        </h3>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '200px' }}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Tên sản phẩm *</label>
            <input
              type="text"
              placeholder="Ví dụ: Thùng Carton A1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid #374151',
                borderRadius: '6px',
                padding: '10px 14px',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '180px' }}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Đơn vị tính</label>
            <input
              type="text"
              placeholder="Ví dụ: Cái, Thùng"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid #374151',
                borderRadius: '6px',
                padding: '10px 14px',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '200px' }}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>RFID</label>
            <input
              type="text"
              placeholder="Nhập RFID (nếu có)"
              value={rfid}
              onChange={(e) => setRfid(e.target.value)}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid #374151',
                borderRadius: '6px',
                padding: '10px 14px',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              color: 'white',
              border: 'none',
              padding: '11px 24px',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
            }}
          >
            {editingId ? "Lưu thay đổi" : "+ Thêm sản phẩm"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setName(""); setUnit(""); setRfid(""); }}
              style={{
                background: '#374151',
                color: 'var(--text-primary)',
                border: 'none',
                padding: '11px 16px',
                borderRadius: '6px',
                fontWeight: 500,
                cursor: 'pointer',
                height: '42px'
              }}
            >
              Hủy
            </button>
          )}
        </form>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="stat-card" style={{ display: 'block', marginBottom: '24px', padding: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--text-secondary)" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sản phẩm, Barcode hoặc SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              background: 'var(--bg-elevated)',
              border: '1px solid #374151',
              borderRadius: '6px',
              padding: '10px 14px',
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: '14px'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              style={{
                background: '#374151',
                color: 'var(--text-secondary)',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Xóa
            </button>
          )}
        </div>
      </div>

      {/* Bảng danh sách sản phẩm */}
      <div className="stat-card" style={{ display: 'block', padding: '0px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {/* Scroll dọc có custom scrollbar */}
          <div
            className="product-table-scroll"
            style={{ maxHeight: '520px', overflowY: 'auto' }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              {/* Sticky header */}
              <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <tr style={{ background: 'var(--bg-overlay)', borderBottom: '1px solid var(--bg-elevated)' }}>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Tên sản phẩm</th>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 600 }}>SKU</th>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Barcode</th>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 600 }}>QR</th>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 600 }}>RFID</th>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 600, width: '120px' }}>Đơn vị</th>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 600, width: '140px', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>

              <tbody style={{ color: '#E5E7EB' }}>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      {searchTerm ? "Không tìm thấy sản phẩm nào phù hợp." : "Chưa có sản phẩm nào trong hệ thống kho."}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p, index) => (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: '1px solid var(--bg-elevated)',
                        background: index % 2 === 0 ? 'transparent' : 'rgba(31, 41, 55, 0.3)'
                      }}
                    >
                      <td style={{ padding: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>
                        <div className="truncate-cell" title={p.name}>{p.name}</div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <code className="truncate-cell" title={p.sku || ""} style={{ background: 'var(--bg-elevated)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                          {p.sku || "—"}
                        </code>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                        <div className="truncate-cell" title={p.barcode || ""}>{p.barcode || "—"}</div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        {p.barcode ? (
                          <button
                            onClick={() => { setModalProduct(p); setModalType("qr"); }}
                            style={{
                              background: 'rgba(99, 102, 241, 0.1)',
                              color: '#A5B4FC',
                              border: '1px solid rgba(99, 102, 241, 0.2)',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 500
                            }}
                          >
                            📱 QR
                          </button>
                        ) : "—"}
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                        <div className="truncate-cell" title={p.rfid_code || ""}>{p.rfid_code || "Chưa gán"}</div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          background: 'rgba(99, 102, 241, 0.1)',
                          color: '#A5B4FC',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 500
                        }}>
                          {p.unit || "Chưa rõ"}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => { setEditingId(p.id); setName(p.name); setUnit(p.unit || ""); setRfid(p.rfid_code || ""); }}
                            style={{
                              background: '#3B82F6',
                              color: 'var(--text-primary)',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: 500
                            }}
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              color: '#EF4444',
                              border: '1px solid rgba(239, 68, 68, 0.2)',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: 500
                            }}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal QR / Barcode */}
      {modalProduct && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setModalProduct(null)}
        >
          <div
            style={{
              background: 'var(--bg-elevated)', padding: '32px', borderRadius: '16px',
              maxWidth: '400px', width: '90%', textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>{modalProduct.name}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Barcode: {modalProduct.barcode}</p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
              <button
                onClick={() => setModalType('qr')}
                style={{
                  background: modalType === 'qr' ? '#6366F1' : 'rgba(99, 102, 241, 0.1)',
                  color: modalType === 'qr' ? 'var(--text-primary)' : '#A5B4FC',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500
                }}
              >
                QR Code
              </button>
              <button
                onClick={() => setModalType('barcode')}
                style={{
                  background: modalType === 'barcode' ? '#6366F1' : 'rgba(99, 102, 241, 0.1)',
                  color: modalType === 'barcode' ? 'var(--text-primary)' : '#A5B4FC',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500
                }}
              >
                Barcode
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              {modalType === 'qr' ? (
                <div style={{ background: 'var(--text-primary)', padding: '20px', borderRadius: '8px' }}>
                  <QRCodeSVG value={modalProduct.barcode} size={200} />
                  <p style={{ color: '#000', marginTop: '12px', fontSize: '14px', fontWeight: 500 }}>
                    {modalProduct.barcode}
                  </p>
                </div>
              ) : (
                <div style={{ background: 'var(--text-primary)', padding: '20px', borderRadius: '8px' }}>
                  <svg ref={(ref) => {
                    if (ref) {
                      JsBarcode(ref, modalProduct.barcode, {
                        format: "EAN13", width: 3, height: 100,
                        displayValue: true, background: "#ffffff", lineColor: "#000000"
                      });
                    }
                  }} />
                  <p style={{ color: '#000', marginTop: '12px', fontSize: '14px', fontWeight: 500 }}>
                    Format: EAN13
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setModalProduct(null)}
              style={{
                background: '#374151', color: 'var(--text-primary)', border: 'none',
                padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}