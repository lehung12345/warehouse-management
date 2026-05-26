package entity

import "time"

type Inventory struct {
	ID          uint      `gorm:"primaryKey"`
	ProductID   uint
	LocationID  uint
	Quantity    int       `gorm:"default:0"`
	MinQuantity int       `gorm:"default:0"`
	CreatedAt   time.Time
	UpdatedAt   time.Time

	Product  Product  `gorm:"foreignKey:ProductID"`
	Location Location `gorm:"foreignKey:LocationID"`
}