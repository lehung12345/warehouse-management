// package services

// import (
// 	"errors"
// 	"warehouse-backend/entity"

// 	"gorm.io/gorm"
// )

// type InventoryService struct {
// 	DB *gorm.DB
// }

// func NewInventoryService(db *gorm.DB) *InventoryService {
// 	return &InventoryService{DB: db}
// }

// // 🔥 Lấy toàn bộ inventory
// func (s *InventoryService) GetAll(productID, locationID, low string, page, limit int) ([]entity.Inventory, error) {
// 	var inventories []entity.Inventory

// 	query := s.DB.Preload("Product").Preload("Location")

// 	if productID != "" {
// 		query = query.Where("product_id = ?", productID)
// 	}

// 	if locationID != "" {
// 		query = query.Where("location_id = ?", locationID)
// 	}

// 	// 🔴 LOW STOCK FILTER
// 	if low == "true" {
// 		query = query.Where("quantity <= min_quantity")
// 	}

// 	// 📄 PAGINATION
// 	offset := (page - 1) * limit

// 	err := query.Offset(offset).Limit(limit).Find(&inventories).Error
// 	return inventories, err
// }

// func (s *InventoryService) ImportProduct(
// 	productID uint,
// 	locationID uint,
// 	quantity int,
// 	userID uint,
// 	importID uint,
// ) error {

// 	return s.DB.Transaction(func(tx *gorm.DB) error {

// 		var inv entity.Inventory

// 		err := tx.Where("product_id = ? AND location_id = ?", productID, locationID).
// 			First(&inv).Error

// 		if err != nil {
// 			if err == gorm.ErrRecordNotFound {
// 				inv = entity.Inventory{
// 					ProductID:  productID,
// 					LocationID: locationID,
// 					Quantity:   quantity,
// 				}
// 				if err := tx.Create(&inv).Error; err != nil {
// 					return err
// 				}
// 			} else {
// 				return err
// 			}
// 		} else {
// 			inv.Quantity += quantity
// 			if err := tx.Save(&inv).Error; err != nil {
// 				return err
// 			}
// 		}

// 		// 👉 ghi transaction
// 		trans := entity.Transaction{
// 			ProductID:     productID,
// 			LocationID:    locationID,
// 			Type:          "IMPORT",
// 			Quantity:      quantity,
// 			UserID:        userID,
// 			ReferenceID:   importID,
// 			ReferenceType: "IMPORT",
// 		}

// 		return tx.Create(&trans).Error
// 	})
// }

// func (s *InventoryService) ExportProduct(
// 	productID uint,
// 	locationID uint,
// 	quantity int,
// 	userID uint,
// 	exportID uint,
// ) error {

// 	return s.DB.Transaction(func(tx *gorm.DB) error {

// 		var inv entity.Inventory

// 		err := tx.Where("product_id = ? AND location_id = ?", productID, locationID).
// 			First(&inv).Error

// 		if err != nil {
// 			return errors.New("inventory not found")
// 		}

// 		if inv.Quantity < quantity {
// 			return errors.New("not enough stock")
// 		}

// 		inv.Quantity -= quantity
// 		if err := tx.Save(&inv).Error; err != nil {
// 			return err
// 		}

// 		trans := entity.Transaction{
// 			ProductID:     productID,
// 			LocationID:    locationID,
// 			Type:          "EXPORT",
// 			Quantity:      quantity,
// 			UserID:        userID,
// 			ReferenceID:   exportID,
// 			ReferenceType: "EXPORT",
// 		}

// 		return tx.Create(&trans).Error
// 	})
// }




package services

import (
	"errors"
	"warehouse-backend/entity"

	"gorm.io/gorm"
)

type InventoryService struct {
	DB *gorm.DB
}

func NewInventoryService(db *gorm.DB) *InventoryService {
	return &InventoryService{DB: db}
}

// 🔥 ĐÃ SỬA: Hàm GetAll giờ trả về thêm biến total dạng int64
func (s *InventoryService) GetAll(productID, locationID, low string, page, limit int) ([]entity.Inventory, int64, error) {
	var inventories []entity.Inventory
	var total int64

	// Tạo câu lệnh query gốc dựa trên Model Inventory
	query := s.DB.Model(&entity.Inventory{})

	if productID != "" {
		query = query.Where("product_id = ?", productID)
	}

	if locationID != "" {
		query = query.Where("location_id = ?", locationID)
	}

	// FILTER SẢN PHẨM SẮP HẾT HÀNG
	if low == "true" {
		query = query.Where("quantity <= min_quantity")
	}

	// 1. Đếm tổng số lượng bản ghi thỏa mãn điều kiện lọc trong DB (Bắt buộc phải có)
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// 2. Load quan hệ kèm phân trang Offset/Limit để trả về dữ liệu trang hiện tại
	offset := (page - 1) * limit
	err := query.Preload("Product").Preload("Location").Offset(offset).Limit(limit).Find(&inventories).Error

	return inventories, total, err
}

func (s *InventoryService) ImportProduct(
	productID uint,
	locationID uint,
	quantity int,
	userID uint,
	importID uint,
) error {

	return s.DB.Transaction(func(tx *gorm.DB) error {

		var inv entity.Inventory

		err := tx.Where("product_id = ? AND location_id = ?", productID, locationID).
			First(&inv).Error

		if err != nil {
			if err == gorm.ErrRecordNotFound {
				inv = entity.Inventory{
					ProductID:  productID,
					LocationID: locationID,
					Quantity:   quantity,
				}
				if err := tx.Create(&inv).Error; err != nil {
					return err
				}
			} else {
				return err
			}
		} else {
			inv.Quantity += quantity
			if err := tx.Save(&inv).Error; err != nil {
				return err
			}
		}

		trans := entity.Transaction{
			ProductID:     productID,
			LocationID:    locationID,
			Type:          "IMPORT",
			Quantity:      quantity,
			UserID:        userID,
			ReferenceID:   importID,
			ReferenceType: "IMPORT",
		}

		return tx.Create(&trans).Error
	})
}

func (s *InventoryService) ExportProduct(
	productID uint,
	locationID uint,
	quantity int,
	userID uint,
	exportID uint,
) error {

	return s.DB.Transaction(func(tx *gorm.DB) error {

		var inv entity.Inventory

		err := tx.Where("product_id = ? AND location_id = ?", productID, locationID).
			First(&inv).Error

		if err != nil {
			return errors.New("inventory not found")
		}

		if inv.Quantity < quantity {
			return errors.New("not enough stock")
		}

		inv.Quantity -= quantity
		if err := tx.Save(&inv).Error; err != nil {
			return err
		}

		trans := entity.Transaction{
			ProductID:     productID,
			LocationID:    locationID,
			Type:          "EXPORT",
			Quantity:      quantity,
			UserID:        userID,
			ReferenceID:   exportID,
			ReferenceType: "EXPORT",
		}

		return tx.Create(&trans).Error
	})
}