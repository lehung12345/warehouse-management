package entity

import "time"

type Export struct {
	ID        uint         `gorm:"primaryKey" json:"id"`
	Code      string       `gorm:"unique;not null" json:"code"`
	UserID    uint         `json:"user_id"`
	Status    string       `gorm:"type:varchar(20);default:'PENDING'" json:"status"`
	CreatedAt time.Time    `json:"created_at"`
	UpdatedAt time.Time    `json:"updated_at"`

	Items []ExportItem `gorm:"foreignKey:ExportID" json:"items"`
	User  *User        `gorm:"foreignKey:UserID" json:"user,omitempty"`
}