package entity

import "time"

type Product struct {
	ID        uint      `gorm:"primaryKey"`
	Name      string    `gorm:"not null"`
	SKU       string    `gorm:"unique;not null"`
	Barcode   string
	RFIDCode  string
	Unit      string
	CreatedAt time.Time
	UpdatedAt time.Time
}