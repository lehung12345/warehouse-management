package services

import (
	"errors"
	"fmt"
	"time"
	"warehouse-backend/entity"
	"gorm.io/gorm"
)

type OrderService struct {
	DB *gorm.DB
}

func NewOrderService(db *gorm.DB) *OrderService {
	return &OrderService{DB: db}
}

// generateImportCode sinh mã đơn nhập: IMP-YYYYMMDD-XXX (XXX là số thứ tự trong ngày)
func (s *OrderService) generateImportCode() (string, error) {
	dateStr := time.Now().Format("20060102")
	var count int64
	if err := s.DB.Model(&entity.Import{}).
		Where("code LIKE ?", fmt.Sprintf("IMP-%s%%", dateStr)).
		Count(&count).Error; err != nil {
		return "", err
	}
	nextNumber := count + 1
	code := fmt.Sprintf("IMP-%s-%03d", dateStr, nextNumber)
	return code, nil
}

// generateExportCode sinh mã đơn xuất: EXP-YYYYMMDD-XXX
func (s *OrderService) generateExportCode() (string, error) {
	dateStr := time.Now().Format("20060102")
	var count int64
	if err := s.DB.Model(&entity.Export{}).
		Where("code LIKE ?", fmt.Sprintf("EXP-%s%%", dateStr)).
		Count(&count).Error; err != nil {
		return "", err
	}
	nextNumber := count + 1
	code := fmt.Sprintf("EXP-%s-%03d", dateStr, nextNumber)
	return code, nil
}

func (s *OrderService) CreateImport(order entity.Import) error {
	// Nếu code không được cung cấp hoặc rỗng thì tự sinh
	if order.Code == "" {
		code, err := s.generateImportCode()
		if err != nil {
			return err
		}
		order.Code = code
	}
	return s.DB.Create(&order).Error
}

func (s *OrderService) CreateExport(order entity.Export) error {
	if order.Code == "" {
		code, err := s.generateExportCode()
		if err != nil {
			return err
		}
		order.Code = code
	}
	return s.DB.Create(&order).Error
}

func (s *OrderService) GetImports() ([]entity.Import, error) {
	var data []entity.Import
	err := s.DB.Preload("Items.Product").Preload("User").Find(&data).Error
	return data, err
}

func (s *OrderService) GetExports() ([]entity.Export, error) {
	var data []entity.Export
	err := s.DB.Preload("Items.Product").Preload("User").Find(&data).Error
	return data, err
}

func (s *OrderService) UpdateImportStatus(id uint, status string) error {
	err := s.DB.Model(&entity.Import{}).Where("id = ?", id).Update("status", status).Error
	if err != nil {
		return err
	}
	// Xóa OrderSeenStatus để admin nhận thông báo mới khi status thay đổi
	s.DB.Where("order_id = ? AND order_type = 'import'", id).Delete(&entity.OrderSeenStatus{})
	return nil
}

func (s *OrderService) UpdateExportStatus(id uint, status string) error {
	err := s.DB.Model(&entity.Export{}).Where("id = ?", id).Update("status", status).Error
	if err != nil {
		return err
	}
	// Xóa OrderSeenStatus để admin nhận thông báo mới khi status thay đổi
	s.DB.Where("order_id = ? AND order_type = 'export'", id).Delete(&entity.OrderSeenStatus{})
	return nil
}

func (s *OrderService) CancelImport(id uint) error {
	var order entity.Import
	if err := s.DB.First(&order, id).Error; err != nil {
		return err
	}
	if order.Status == "DONE" {
		return errors.New("đơn đã hoàn thành, không thể hủy")
	}
	if order.Status == "CANCELLED" {
		return errors.New("đơn đã bị hủy trước đó")
	}
	err := s.DB.Model(&order).Update("status", "CANCELLED").Error
	if err != nil {
		return err
	}
	// Xóa OrderSeenStatus để admin nhận thông báo mới khi status thay đổi
	s.DB.Where("order_id = ? AND order_type = 'import'", id).Delete(&entity.OrderSeenStatus{})
	return nil
}

func (s *OrderService) CancelExport(id uint) error {
	var order entity.Export
	if err := s.DB.First(&order, id).Error; err != nil {
		return err
	}
	if order.Status == "DONE" {
		return errors.New("đơn đã hoàn thành, không thể hủy")
	}
	if order.Status == "CANCELLED" {
		return errors.New("đơn đã bị hủy trước đó")
	}
	err := s.DB.Model(&order).Update("status", "CANCELLED").Error
	if err != nil {
		return err
	}
	// Xóa OrderSeenStatus để admin nhận thông báo mới khi status thay đổi
	s.DB.Where("order_id = ? AND order_type = 'export'", id).Delete(&entity.OrderSeenStatus{})
	return nil
}

func (s *OrderService) ApproveImport(id uint) error {
	tx := s.DB.Begin()

	var order entity.Import
	if err := tx.First(&order, id).Error; err != nil {
		tx.Rollback()
		return err
	}

	if order.Status != "DONE" {
		tx.Rollback()
		return errors.New("chỉ có thể duyệt đơn hàng đã hoàn thành")
	}

	// Cập nhật status thành APPROVED
	order.Status = "APPROVED"
	if err := tx.Save(&order).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Xóa OrderSeenStatus để admin nhận thông báo mới khi status thay đổi
	tx.Where("order_id = ? AND order_type = 'import'", id).Delete(&entity.OrderSeenStatus{})

	// Cập nhật inventory cho tất cả các item trong đơn
	var items []entity.ImportItem
	if err := tx.Where("import_id = ?", id).Find(&items).Error; err != nil {
		tx.Rollback()
		return err
	}

	for _, i := range items {
		var inv entity.Inventory
		if err := tx.Where("product_id = ? AND location_id = ?", i.ProductID, i.LocationID).
			First(&inv).Error; err != nil {
			// If inventory doesn't exist, create it
			if errors.Is(err, gorm.ErrRecordNotFound) {
				inv = entity.Inventory{
					ProductID:  i.ProductID,
					LocationID: i.LocationID,
					Quantity:   i.Quantity,
				}
				if err := tx.Create(&inv).Error; err != nil {
					tx.Rollback()
					return errors.New("không thể tạo inventory mới")
				}
			} else {
				tx.Rollback()
				return errors.New("lỗi khi tìm inventory")
			}
		} else {
			// Inventory exists, update quantity
			inv.Quantity += i.Quantity
			tx.Save(&inv)
		}
	}

	tx.Commit()
	return nil
}

func (s *OrderService) ApproveExport(id uint) error {
	tx := s.DB.Begin()

	var order entity.Export
	if err := tx.First(&order, id).Error; err != nil {
		tx.Rollback()
		return err
	}

	if order.Status != "DONE" {
		tx.Rollback()
		return errors.New("chỉ có thể duyệt đơn hàng đã hoàn thành")
	}

	// Cập nhật status thành APPROVED
	order.Status = "APPROVED"
	if err := tx.Save(&order).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Xóa OrderSeenStatus để admin nhận thông báo mới khi status thay đổi
	tx.Where("order_id = ? AND order_type = 'export'", id).Delete(&entity.OrderSeenStatus{})

	// Cập nhật inventory cho tất cả các item trong đơn
	var items []entity.ExportItem
	if err := tx.Where("export_id = ?", id).Find(&items).Error; err != nil {
		tx.Rollback()
		return err
	}

	for _, i := range items {
		var inv entity.Inventory
		if err := tx.Where("product_id = ? AND location_id = ?", i.ProductID, i.LocationID).
			First(&inv).Error; err != nil {
			// If inventory doesn't exist, create it with 0 quantity
			if errors.Is(err, gorm.ErrRecordNotFound) {
				inv = entity.Inventory{
					ProductID:  i.ProductID,
					LocationID: i.LocationID,
					Quantity:   0,
				}
				if err := tx.Create(&inv).Error; err != nil {
					tx.Rollback()
					return errors.New("không thể tạo inventory mới")
				}
			} else {
				tx.Rollback()
				return errors.New("lỗi khi tìm inventory")
			}
		}
		// Check if there's enough quantity to export
		if inv.Quantity < i.Quantity {
			tx.Rollback()
			return errors.New("không đủ hàng trong kho để xuất")
		}
		inv.Quantity -= i.Quantity
		tx.Save(&inv)
	}

	tx.Commit()
	return nil
}

// MarkOrderAsSeen marks an order as seen by a specific user
// If orderID is 0, mark all orders of that type as seen
func (s *OrderService) MarkOrderAsSeen(userID uint, orderID uint, orderType string) error {
	if orderID == 0 {
		// Mark all orders of this type as seen
		var orderIDs []uint
		var err error
		
		if orderType == "import" {
			err = s.DB.Model(&entity.Import{}).Pluck("id", &orderIDs).Error
		} else if orderType == "export" {
			err = s.DB.Model(&entity.Export{}).Pluck("id", &orderIDs).Error
		} else {
			return errors.New("invalid order type")
		}
		
		if err != nil {
			return err
		}
		
		// Create seen status for all orders
		for _, id := range orderIDs {
			seenStatus := entity.OrderSeenStatus{
				UserID:    userID,
				OrderID:   id,
				OrderType: orderType,
			}
			// Use OnConflict to ignore duplicates
			s.DB.Where("user_id = ? AND order_id = ? AND order_type = ?", userID, id, orderType).
				FirstOrCreate(&seenStatus)
		}
		
		return nil
	}
	
	// Mark specific order as seen
	var seenStatus entity.OrderSeenStatus
	err := s.DB.Where("user_id = ? AND order_id = ? AND order_type = ?", userID, orderID, orderType).
		First(&seenStatus).Error
	
	if err != nil {
		// Create new seen status if not exists
		seenStatus = entity.OrderSeenStatus{
			UserID:    userID,
			OrderID:   orderID,
			OrderType: orderType,
		}
		return s.DB.Create(&seenStatus).Error
	}
	
	// Update seen_at if already exists
	return s.DB.Model(&seenStatus).Update("seen_at", time.Now()).Error
}

// GetUnseenImportCount returns count of unseen import orders for a user
func (s *OrderService) GetUnseenImportCount(userID uint) (int64, error) {
	var count int64
	err := s.DB.Table("imports").
		Where("id NOT IN (SELECT order_id FROM order_seen_statuses WHERE user_id = ? AND order_type = 'import')", userID).
		Count(&count).Error
	return count, err
}

// GetUnseenExportCount returns count of unseen export orders for a user
func (s *OrderService) GetUnseenExportCount(userID uint) (int64, error) {
	var count int64
	err := s.DB.Table("exports").
		Where("id NOT IN (SELECT order_id FROM order_seen_statuses WHERE user_id = ? AND order_type = 'export')", userID).
		Count(&count).Error
	return count, err
}

// GetUnseenImportCountByStatus returns count of unseen import orders by status for a user
func (s *OrderService) GetUnseenImportCountByStatus(userID uint, status string) (int64, error) {
	var count int64
	err := s.DB.Table("imports").
		Where("status = ? AND id NOT IN (SELECT order_id FROM order_seen_statuses WHERE user_id = ? AND order_type = 'import')", status, userID).
		Count(&count).Error
	return count, err
}

// GetUnseenExportCountByStatus returns count of unseen export orders by status for a user
func (s *OrderService) GetUnseenExportCountByStatus(userID uint, status string) (int64, error) {
	var count int64
	err := s.DB.Table("exports").
		Where("status = ? AND id NOT IN (SELECT order_id FROM order_seen_statuses WHERE user_id = ? AND order_type = 'export')", status, userID).
		Count(&count).Error
	return count, err
}