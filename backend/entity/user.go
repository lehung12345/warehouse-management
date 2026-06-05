package entity

import "time"

type User struct {
	ID        uint      `gorm:"primaryKey"`
	Username  string    `gorm:"not null;unique"`
	Email     string    `gorm:"unique"`
	Password  string    `gorm:"not null"`
	Role      string    `gorm:"type:varchar(10);check:role IN ('ADMIN','STAFF')"`
	CreatedAt time.Time
	UpdatedAt time.Time
}