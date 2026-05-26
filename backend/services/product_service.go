package services

import (
	"errors"
	"fmt"
	"time"

	"warehouse-backend/config"
	"warehouse-backend/entity"
)

func generateSKU() string {
	return fmt.Sprintf("SP-%d", time.Now().Unix()%1000000)
}

func generateBarcode() string {
	return fmt.Sprintf("%013d", time.Now().UnixNano()%1000000000000)
}

func CreateProduct(product *entity.Product) error {
	if product.Name == "" {
		return errors.New("name is required")
	}

	product.SKU = generateSKU()
	product.Barcode = generateBarcode()

	if product.RFIDCode == "" {
		product.RFIDCode = fmt.Sprintf("RFID-%d", time.Now().UnixNano())
	}

	return config.DB.Create(product).Error
}

func GetAllProducts() ([]entity.Product, error) {
	var products []entity.Product
	err := config.DB.Find(&products).Error
	return products, err
}

func GetProductByID(id uint) (entity.Product, error) {
	var product entity.Product
	err := config.DB.First(&product, id).Error
	return product, err
}

func UpdateProduct(product *entity.Product) error {
	var old entity.Product
	if err := config.DB.First(&old, product.ID).Error; err != nil {
		return err
	}

	// không cho sửa SKU + barcode
	product.SKU = old.SKU
	product.Barcode = old.Barcode

	return config.DB.Save(product).Error
}

func DeleteProduct(id uint) error {
	return config.DB.Delete(&entity.Product{}, id).Error
}