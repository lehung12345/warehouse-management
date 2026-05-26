package config

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	var err error

	DB, err = gorm.Open(postgres.Open(ENV.DBConn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Không kết nối được database:", err)
	}

	log.Println("✅ Kết nối database thành công")
}