package services

import (
	"warehouse-backend/entity"
	"gorm.io/gorm"
	"errors"
	"strconv"
)

type ScanService struct {
	DB *gorm.DB
}

func NewScanService(db *gorm.DB) *ScanService {
	return &ScanService{DB: db}
}

func (s *ScanService) ScanImport(importID uint, productID uint, locationID uint, qty int) error {

	tx := s.DB.Begin()

	var order entity.Import
	if err := tx.First(&order, importID).Error; err != nil {
		tx.Rollback()
		return errors.New("import order không tồn tại")
	}

	if order.Status == "DONE" {
		tx.Rollback()
		return errors.New("import order đã hoàn thành")
	}

	if order.Status == "CANCELLED" {
		tx.Rollback()
		return errors.New("import order đã bị hủy, không thể quét")
	}

	var item entity.ImportItem

	// Try with location_id first (new behavior)
	err := tx.
		Where("import_id = ? AND product_id = ? AND location_id = ?", importID, productID, locationID).
		First(&item).Error

	// If not found, try without location_id (backward compatibility)
	if err != nil {
		err = tx.
			Where("import_id = ? AND product_id = ?", importID, productID).
			First(&item).Error
	}

	if err != nil {
		tx.Rollback()
		return errors.New("import item không tồn tại")
	}

	// ➕ tăng scanned
	if item.ScannedQuantity+qty > item.Quantity {
		tx.Rollback()
		return errors.New("scan vượt số lượng yêu cầu")
	}

	item.ScannedQuantity += qty
	tx.Save(&item)

	// 🔥 Chuyển trạng thái từ PENDING sang PROCESSING (nếu chưa được chuyển)
	if order.Status == "PENDING" {
		order.Status = "PROCESSING"
		if err := tx.Save(&order).Error; err != nil {
			tx.Rollback()
			return errors.New("không thể cập nhật trạng thái đơn hàng")
		}
		// Xóa OrderSeenStatus để admin nhận thông báo mới khi status thay đổi
		tx.Where("order_id = ? AND order_type = 'import'", importID).Delete(&entity.OrderSeenStatus{})
	}

	// 🔥 Kiểm tra xem còn item nào chưa scan đủ không
	var total int64
	tx.Model(&entity.ImportItem{}).
		Where("import_id = ?", importID).
		Where("scanned_quantity < quantity").
		Count(&total)

	// Nếu tất cả đã scan đủ → DONE (không cập nhật inventory, chờ admin duyệt)
	if total == 0 {
		// Lấy lại order (có thể đã được cập nhật status)
		tx.First(&order, importID)
		order.Status = "DONE"
		tx.Save(&order)
		// Xóa OrderSeenStatus để admin nhận thông báo mới khi status thay đổi
		tx.Where("order_id = ? AND order_type = 'import'", importID).Delete(&entity.OrderSeenStatus{})
	}

	tx.Commit()
	return nil
}

func (s *ScanService) ScanExport(exportID uint, productID uint, locationID uint, qty int) error {

	tx := s.DB.Begin()

	var order entity.Export
	if err := tx.First(&order, exportID).Error; err != nil {
		tx.Rollback()
		return errors.New("export order không tồn tại")
	}

	if order.Status == "DONE" {
		tx.Rollback()
		return errors.New("export order đã hoàn thành")
	}

	if order.Status == "CANCELLED" {
		tx.Rollback()
		return errors.New("export order đã bị hủy, không thể quét")
	}

	var item entity.ExportItem

	// Try with location_id first (new behavior)
	err := tx.
		Where("export_id = ? AND product_id = ? AND location_id = ?", exportID, productID, locationID).
		First(&item).Error

	// If not found, try without location_id (backward compatibility)
	if err != nil {
		err = tx.
			Where("export_id = ? AND product_id = ?", exportID, productID).
			First(&item).Error
	}

	if err != nil {
		tx.Rollback()
		return errors.New("export item không tồn tại")
	}

	// 🔥 Kiểm tra tồn kho thực tế trước khi cho scan
	var inv entity.Inventory
	if err := tx.Where("product_id = ? AND location_id = ?", productID, locationID).
		First(&inv).Error; err != nil {
		tx.Rollback()
		return errors.New("sản phẩm không tồn tại trong kho tại vị trí này")
	}

	// Kiểm tra xem còn đủ hàng trong kho không
	if inv.Quantity < qty {
		tx.Rollback()
		return errors.New("không đủ hàng trong kho để xuất (còn " + strconv.Itoa(inv.Quantity) + " sản phẩm)")
	}

	if item.ScannedQuantity+qty > item.Quantity {
		tx.Rollback()
		return errors.New("scan vượt số lượng xuất")
	}

	item.ScannedQuantity += qty
	tx.Save(&item)

	// 🔥 Chuyển trạng thái từ PENDING sang PROCESSING (nếu chưa được chuyển)
	if order.Status == "PENDING" {
		order.Status = "PROCESSING"
		if err := tx.Save(&order).Error; err != nil {
			tx.Rollback()
			return errors.New("không thể cập nhật trạng thái đơn hàng")
		}
		// Xóa OrderSeenStatus để admin nhận thông báo mới khi status thay đổi
		tx.Where("order_id = ? AND order_type = 'export'", exportID).Delete(&entity.OrderSeenStatus{})
	}

	// 🔥 Kiểm tra xem còn item nào chưa scan đủ không
	var total int64
	tx.Model(&entity.ExportItem{}).
		Where("export_id = ?", exportID).
		Where("scanned_quantity < quantity").
		Count(&total)

	// Nếu tất cả đã scan đủ → DONE (không cập nhật inventory, chờ admin duyệt)
	if total == 0 {
		// Lấy lại order (có thể đã được cập nhật status)
		tx.First(&order, exportID)
		order.Status = "DONE"
		tx.Save(&order)
		// Xóa OrderSeenStatus để admin nhận thông báo mới khi status thay đổi
		tx.Where("order_id = ? AND order_type = 'export'", exportID).Delete(&entity.OrderSeenStatus{})
	}

	tx.Commit()
	return nil
}