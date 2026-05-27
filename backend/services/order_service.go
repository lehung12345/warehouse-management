package services

import (
	"warehouse-backend/entity"
	"gorm.io/gorm"
)

type OrderService struct {
	DB *gorm.DB
}

func NewOrderService(db *gorm.DB) *OrderService {
	return &OrderService{DB: db}
}

func (s *OrderService) CreateImport(order entity.Import) error {
	return s.DB.Create(&order).Error
}

func (s *OrderService) CreateExport(order entity.Export) error {
	return s.DB.Create(&order).Error
}

func (s *OrderService) GetImports() ([]entity.Import, error) {
	var data []entity.Import
	err := s.DB.Preload("Items.Product").Find(&data).Error
	return data, err
}

func (s *OrderService) GetExports() ([]entity.Export, error) {
	var data []entity.Export
	err := s.DB.Preload("Items.Product").Find(&data).Error
	return data, err
}

func (s *OrderService) UpdateImportStatus(id uint, status string) error {
	return s.DB.Model(&entity.Import{}).
		Where("id = ?", id).
		Update("status", status).Error
}

func (s *OrderService) UpdateExportStatus(id uint, status string) error {
	return s.DB.Model(&entity.Export{}).
		Where("id = ?", id).
		Update("status", status).Error
}

func (s *OrderService) CompleteImport(id uint) error {

	var order entity.Import
	s.DB.Preload("Items").First(&order, id)

	tx := s.DB.Begin()

	for _, i := range order.Items {

		var inv entity.Inventory
		tx.Where("product_id = ? AND location_id = ?", i.ProductID, i.LocationID).
			First(&inv)

		inv.Quantity += i.Quantity
		tx.Save(&inv)
	}

	tx.Model(&entity.Import{}).
		Where("id = ?", id).
		Update("status", "DONE")

	tx.Commit()
	return nil
}

func (s *OrderService) CompleteExport(id uint) error {

	var order entity.Export
	s.DB.Preload("Items").First(&order, id)

	tx := s.DB.Begin()

	for _, i := range order.Items {

		var inv entity.Inventory
		tx.Where("product_id = ? AND location_id = ?", i.ProductID, i.LocationID).
			First(&inv)

		inv.Quantity -= i.Quantity
		tx.Save(&inv)
	}

	tx.Model(&entity.Export{}).
		Where("id = ?", id).
		Update("status", "DONE")

	tx.Commit()
	return nil
}

