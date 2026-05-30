// package services

// import (
// 	"warehouse-backend/entity"
// 	"gorm.io/gorm"
// 	"errors"
// )

// type OrderService struct {
// 	DB *gorm.DB
// }

// func NewOrderService(db *gorm.DB) *OrderService {
// 	return &OrderService{DB: db}
// }

// func (s *OrderService) CreateImport(order entity.Import) error {
// 	return s.DB.Create(&order).Error
// }

// func (s *OrderService) CreateExport(order entity.Export) error {
// 	return s.DB.Create(&order).Error
// }

// func (s *OrderService) GetImports() ([]entity.Import, error) {
// 	var data []entity.Import
// 	err := s.DB.Preload("Items.Product").Find(&data).Error
// 	return data, err
// }

// func (s *OrderService) GetExports() ([]entity.Export, error) {
// 	var data []entity.Export
// 	err := s.DB.Preload("Items.Product").Find(&data).Error
// 	return data, err
// }

// func (s *OrderService) UpdateImportStatus(id uint, status string) error {
// 	return s.DB.Model(&entity.Import{}).
// 		Where("id = ?", id).
// 		Update("status", status).Error
// }

// func (s *OrderService) UpdateExportStatus(id uint, status string) error {
// 	return s.DB.Model(&entity.Export{}).
// 		Where("id = ?", id).
// 		Update("status", status).Error
// }

// // func (s *OrderService) CompleteImport(id uint) error {

// // 	var order entity.Import
// // 	s.DB.Preload("Items").First(&order, id)

// // 	tx := s.DB.Begin()

// // 	for _, i := range order.Items {

// // 		var inv entity.Inventory
// // 		tx.Where("product_id = ? AND location_id = ?", i.ProductID, i.LocationID).
// // 			First(&inv)

// // 		inv.Quantity += i.Quantity
// // 		tx.Save(&inv)
// // 	}

// // 	tx.Model(&entity.Import{}).
// // 		Where("id = ?", id).
// // 		Update("status", "DONE")

// // 	tx.Commit()
// // 	return nil
// // }

// // func (s *OrderService) CompleteExport(id uint) error {

// // 	var order entity.Export
// // 	s.DB.Preload("Items").First(&order, id)

// // 	tx := s.DB.Begin()

// // 	for _, i := range order.Items {

// // 		var inv entity.Inventory
// // 		tx.Where("product_id = ? AND location_id = ?", i.ProductID, i.LocationID).
// // 			First(&inv)

// // 		inv.Quantity -= i.Quantity
// // 		tx.Save(&inv)
// // 	}

// // 	tx.Model(&entity.Export{}).
// // 		Where("id = ?", id).
// // 		Update("status", "DONE")

// // 	tx.Commit()
// // 	return nil
// // }

// func (s *OrderService) CancelImport(id uint) error {
// 	var order entity.Import
// 	if err := s.DB.First(&order, id).Error; err != nil {
// 		return err
// 	}
// 	if order.Status == "DONE" {
// 		return errors.New("đơn đã hoàn thành, không thể hủy")
// 	}
// 	if order.Status == "CANCELLED" {
// 		return errors.New("đơn đã bị hủy trước đó")
// 	}
// 	return s.DB.Model(&order).Update("status", "CANCELLED").Error
// }


// func (s *OrderService) CancelExport(id uint) error {
// 	var order entity.Export
// 	if err := s.DB.First(&order, id).Error; err != nil {
// 		return err
// 	}
// 	if order.Status == "DONE" {
// 		return errors.New("đơn đã hoàn thành, không thể hủy")
// 	}
// 	if order.Status == "CANCELLED" {
// 		return errors.New("đơn đã bị hủy trước đó")
// 	}
// 	return s.DB.Model(&order).Update("status", "CANCELLED").Error
// }


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
	return s.DB.Model(&entity.Import{}).Where("id = ?", id).Update("status", status).Error
}

func (s *OrderService) UpdateExportStatus(id uint, status string) error {
	return s.DB.Model(&entity.Export{}).Where("id = ?", id).Update("status", status).Error
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
	return s.DB.Model(&order).Update("status", "CANCELLED").Error
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
	return s.DB.Model(&order).Update("status", "CANCELLED").Error
}