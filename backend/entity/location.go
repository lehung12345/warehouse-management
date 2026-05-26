package entity

import "time"

type Location struct {
	ID        uint       `gorm:"primaryKey"`
	Name      string     `gorm:"not null"`
	ParentID  *uint
	Type      string     `gorm:"type:varchar(20);check:type IN ('WAREHOUSE','SHELF','BIN')"`
	Capacity  int
	CreatedAt time.Time
}