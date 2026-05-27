package entity

type ExportItem struct {
	ID              uint     `gorm:"primaryKey" json:"id"`
	ExportID        uint     `json:"export_id"`
	ProductID       uint     `json:"product_id"`
	LocationID      uint     `json:"location_id"`
	Quantity        int      `gorm:"not null" json:"quantity"`
	ScannedQuantity int      `gorm:"default:0" json:"scanned_quantity"`

	Product  Product  `json:"product"`
	Location Location `json:"location"`
}