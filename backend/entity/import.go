package entity

import "time"

type Import struct {
	ID        uint      `gorm:"primaryKey"`
	Code      string    `gorm:"unique;not null"`
	UserID    uint
	Status    string    `gorm:"type:varchar(20);default:'PENDING'"`
	CreatedAt time.Time
	UpdatedAt time.Time

	Items []ImportItem `gorm:"foreignKey:ImportID"`
}