package entity

import "time"

type Inventory struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	ProductID   uint      `json:"product_id"`
	LocationID  uint      `json:"location_id"`
	Quantity    int       `gorm:"default:0" json:"quantity"`
	MinQuantity int       `gorm:"default:0" json:"min_quantity"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	Product  Product  `gorm:"foreignKey:ProductID" json:"product,omitempty"`
	Location Location `gorm:"foreignKey:LocationID" json:"location,omitempty"`
}