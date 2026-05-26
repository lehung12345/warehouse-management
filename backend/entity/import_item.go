package entity

type ImportItem struct {
	ID         uint `gorm:"primaryKey"`
	ImportID   uint
	ProductID  uint
	LocationID uint
	Quantity   int `gorm:"not null"`

	Product  Product
	Location Location
}