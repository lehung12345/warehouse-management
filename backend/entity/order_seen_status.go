package entity

import "time"

type OrderSeenStatus struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	UserID     uint      `gorm:"not null;index" json:"user_id"`
	OrderID    uint      `gorm:"not null;index" json:"order_id"`
	OrderType  string    `gorm:"type:varchar(10);not null;index" json:"order_type"` // "import" or "export"
	SeenAt     time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"seen_at"`
	CreatedAt  time.Time `json:"created_at"`
}
