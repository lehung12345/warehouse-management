package entity

import "time"
type Product struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"not null" json:"name"`
	SKU       string    `gorm:"unique;not null" json:"sku"`
	Barcode   string    `json:"barcode"`
	RFIDCode  string    `gorm:"column:rfid_code" json:"rfid_code"`
	Unit      string    `json:"unit"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}