// package services

// import (
// 	"warehouse-backend/entity"
// 	"gorm.io/gorm"
// 	"errors"
// )

// type ScanService struct {
// 	DB *gorm.DB
// }

// func NewScanService(db *gorm.DB) *ScanService {
// 	return &ScanService{DB: db}
// }

// func (s *ScanService) ScanImport(importID uint, productID uint, qty int) error {

// 	tx := s.DB.Begin()

// 	var order entity.Import
// 	if err := tx.First(&order, importID).Error; err != nil {
// 		tx.Rollback()
// 		return errors.New("import order không tồn tại")
// 	}

// 	if order.Status == "DONE" {
// 		tx.Rollback()
// 		return errors.New("import order đã hoàn thành")
// 	}

// 	var item entity.ImportItem

// 	err := tx.
// 		Where("import_id = ? AND product_id = ?", importID, productID).
// 		First(&item).Error

// 	if err != nil {
// 		tx.Rollback()
// 		return errors.New("import item không tồn tại")
// 	}

// 	// ➕ tăng scanned
// 	if item.ScannedQuantity+qty > item.Quantity {
// 		tx.Rollback()
// 		return errors.New("scan vượt số lượng yêu cầu")
// 	}

// 	item.ScannedQuantity += qty
// 	tx.Save(&item)

// 	// 🔥 check DONE từng item
// 	var total int64
// 	tx.Model(&entity.ImportItem{}).
// 		Where("import_id = ?", importID).
// 		Where("scanned_quantity < quantity").
// 		Count(&total)

// 	// nếu tất cả xong → DONE
// 	if total == 0 {

// 		var order entity.Import
// 		tx.First(&order, importID)

// 		order.Status = "DONE"
// 		tx.Save(&order)

// 		// 🔥 update inventory
// 		var items []entity.ImportItem
// 		tx.Where("import_id = ?", importID).Find(&items)

// 		for _, i := range items {

// 			var inv entity.Inventory
// 			if err := tx.Where("product_id = ? AND location_id = ?", i.ProductID, i.LocationID).
// 				First(&inv).Error; err != nil {
// 				tx.Rollback()
// 				return errors.New("inventory không tồn tại")
// 			}

// 			inv.Quantity += i.Quantity
// 			tx.Save(&inv)
// 		}
// 	}

// 	tx.Commit()
// 	return nil
// }

// func (s *ScanService) ScanExport(exportID uint, productID uint, qty int) error {

// 	tx := s.DB.Begin()

// 	var order entity.Export
// 	if err := tx.First(&order, exportID).Error; err != nil {
// 		tx.Rollback()
// 		return errors.New("export order không tồn tại")
// 	}


// 	if order.Status == "DONE" {
// 		tx.Rollback()
// 		return errors.New("export order đã hoàn thành")
// 	}

// 	var item entity.ExportItem

// 	err := tx.
// 		Where("export_id = ? AND product_id = ?", exportID, productID).
// 		First(&item).Error

// 	if err != nil {
// 		tx.Rollback()
// 		return errors.New("export item không tồn tại")
// 	}

// 	if item.ScannedQuantity+qty > item.Quantity {
// 		tx.Rollback()
// 		return errors.New("scan vượt số lượng xuất")
// 	}

// 	item.ScannedQuantity += qty
// 	tx.Save(&item)

// 	var total int64
// 	tx.Model(&entity.ExportItem{}).
// 		Where("export_id = ?", exportID).
// 		Where("scanned_quantity < quantity").
// 		Count(&total)

// 	if total == 0 {

// 		var order entity.Export
// 		tx.First(&order, exportID)

// 		order.Status = "DONE"
// 		tx.Save(&order)

// 		var items []entity.ExportItem
// 		tx.Where("export_id = ?", exportID).Find(&items)

// 		for _, i := range items {

// 			var inv entity.Inventory
// 			if err := tx.Where("product_id = ? AND location_id = ?", i.ProductID, i.LocationID).
// 				First(&inv).Error; err != nil {
// 				tx.Rollback()
// 				return errors.New("inventory không tồn tại")
// 			}

// 			inv.Quantity -= i.Quantity
// 			tx.Save(&inv)
// 		}
// 	}

// 	tx.Commit()
// 	return nil
// }

//bản sửa 


package services

import (
	"warehouse-backend/entity"
	"gorm.io/gorm"
	"errors"
)

type ScanService struct {
	DB *gorm.DB
}

func NewScanService(db *gorm.DB) *ScanService {
	return &ScanService{DB: db}
}

func (s *ScanService) ScanImport(importID uint, productID uint, qty int) error {

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

	var item entity.ImportItem

	err := tx.
		Where("import_id = ? AND product_id = ?", importID, productID).
		First(&item).Error

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
	}

	// 🔥 Kiểm tra xem còn item nào chưa scan đủ không
	var total int64
	tx.Model(&entity.ImportItem{}).
		Where("import_id = ?", importID).
		Where("scanned_quantity < quantity").
		Count(&total)

	// Nếu tất cả đã scan đủ → DONE
	if total == 0 {
		// Lấy lại order (có thể đã được cập nhật status)
		tx.First(&order, importID)
		order.Status = "DONE"
		tx.Save(&order)

		// Cập nhật inventory cho tất cả các item trong đơn
		var items []entity.ImportItem
		tx.Where("import_id = ?", importID).Find(&items)

		for _, i := range items {
			var inv entity.Inventory
			if err := tx.Where("product_id = ? AND location_id = ?", i.ProductID, i.LocationID).
				First(&inv).Error; err != nil {
				tx.Rollback()
				return errors.New("inventory không tồn tại")
			}
			inv.Quantity += i.Quantity
			tx.Save(&inv)
		}
	}

	tx.Commit()
	return nil
}

func (s *ScanService) ScanExport(exportID uint, productID uint, qty int) error {

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

	var item entity.ExportItem

	err := tx.
		Where("export_id = ? AND product_id = ?", exportID, productID).
		First(&item).Error

	if err != nil {
		tx.Rollback()
		return errors.New("export item không tồn tại")
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
	}

	// 🔥 Kiểm tra xem còn item nào chưa scan đủ không
	var total int64
	tx.Model(&entity.ExportItem{}).
		Where("export_id = ?", exportID).
		Where("scanned_quantity < quantity").
		Count(&total)

	// Nếu tất cả đã scan đủ → DONE
	if total == 0 {
		// Lấy lại order (có thể đã được cập nhật status)
		tx.First(&order, exportID)
		order.Status = "DONE"
		tx.Save(&order)

		// Cập nhật inventory cho tất cả các item trong đơn
		var items []entity.ExportItem
		tx.Where("export_id = ?", exportID).Find(&items)

		for _, i := range items {
			var inv entity.Inventory
			if err := tx.Where("product_id = ? AND location_id = ?", i.ProductID, i.LocationID).
				First(&inv).Error; err != nil {
				tx.Rollback()
				return errors.New("inventory không tồn tại")
			}
			inv.Quantity -= i.Quantity
			tx.Save(&inv)
		}
	}

	tx.Commit()
	return nil
}