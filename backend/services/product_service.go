package services

import (
	"crypto/rand"
	"errors"
	"fmt"
	"math/big"
	"strings"
	"time"

	"warehouse-backend/config"
	"warehouse-backend/entity"
)

func randInt(max int64) int64 {
	n, err := rand.Int(rand.Reader, big.NewInt(max))
	if err != nil {
		// fallback nếu crypto/rand lỗi
		return time.Now().UnixNano() % max
	}
	return n.Int64()
}

func generateSKU() string {
	return fmt.Sprintf("SP-%d-%04d", time.Now().UnixNano(), randInt(10000))
}

func generateBarcode() string {
	// Sinh 12 chữ số ngẫu nhiên thực sự cho EAN13
	var digits strings.Builder
	for i := 0; i < 12; i++ {
		digits.WriteByte(byte('0' + randInt(10)))
	}
	barcode := digits.String()

	// Tính checksum EAN13
	sum := 0
	for i := 0; i < 12; i++ {
		digit := int(barcode[i] - '0')
		if i%2 == 0 {
			sum += digit
		} else {
			sum += digit * 3
		}
	}
	checksum := (10 - (sum % 10)) % 10

	return barcode + fmt.Sprintf("%d", checksum)
}

func generateRFID() string {
	return fmt.Sprintf("RFID-%d-%04d", time.Now().UnixNano(), randInt(10000))
}

func isSKUExists(sku string) bool {
	var count int64
	config.DB.Model(&entity.Product{}).Where("sku = ?", sku).Count(&count)
	return count > 0
}

func isBarcodeExists(barcode string) bool {
	var count int64
	config.DB.Model(&entity.Product{}).Where("barcode = ?", barcode).Count(&count)
	return count > 0
}

func isRFIDExists(rfid string) bool {
	var count int64
	config.DB.Model(&entity.Product{}).Where("rfid_code = ?", rfid).Count(&count)
	return count > 0
}

func CreateProduct(product *entity.Product) error {
	if product.Name == "" {
		return errors.New("name is required")
	}

	// Sinh SKU unique (retry tối đa 5 lần nếu trùng)
	for i := 0; i < 5; i++ {
		sku := generateSKU()
		if !isSKUExists(sku) {
			product.SKU = sku
			break
		}
	}
	if product.SKU == "" {
		return errors.New("không thể sinh SKU duy nhất, vui lòng thử lại")
	}

	// Sinh Barcode unique
	for i := 0; i < 5; i++ {
		barcode := generateBarcode()
		if !isBarcodeExists(barcode) {
			product.Barcode = barcode
			break
		}
	}
	if product.Barcode == "" {
		return errors.New("không thể sinh Barcode duy nhất, vui lòng thử lại")
	}

	// Chỉ sinh RFID nếu frontend không gửi
	if product.RFIDCode == "" {
		for i := 0; i < 5; i++ {
			rfid := generateRFID()
			if !isRFIDExists(rfid) {
				product.RFIDCode = rfid
				break
			}
		}
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

	// chỉ khóa SKU và Barcode, cho phép sửa RFID
	product.SKU = old.SKU
	product.Barcode = old.Barcode

	return config.DB.Save(product).Error
}

func DeleteProduct(id uint) error {
	return config.DB.Delete(&entity.Product{}, id).Error
}