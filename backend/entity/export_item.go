package entity

type ExportItem struct {
	ID         uint `gorm:"primaryKey"`
	ExportID   uint
	ProductID  uint
	LocationID uint
	Quantity   int `gorm:"not null"`

	Product  Product
	Location Location
}