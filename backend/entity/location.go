package entity

import "time"

type Location struct {
	ID        uint       `gorm:"primaryKey" json:"id"`
	Name      string     `gorm:"not null" json:"name"`
	ParentID  *uint      `json:"parent_id"`
	Type      string     `gorm:"type:varchar(20);check:type IN ('WAREHOUSE','SHELF','BIN')" json:"type"`
	Capacity  int        `json:"capacity"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`

	Parent *Location `gorm:"foreignKey:ParentID" json:"parent,omitempty"`
}