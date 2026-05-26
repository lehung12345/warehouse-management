package entity

import "time"

type Transaction struct {
	ID            uint      `gorm:"primaryKey"`
	ProductID     uint
	LocationID    uint
	Type          string    `gorm:"type:varchar(10);check:type IN ('IMPORT','EXPORT')"`
	Quantity      int
	UserID        uint
	ReferenceID   uint
	ReferenceType string    `gorm:"type:varchar(10);check:reference_type IN ('IMPORT','EXPORT')"`
	CreatedAt     time.Time
}