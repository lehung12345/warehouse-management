package main

import (
	"log"
	"os"

	"warehouse-backend/config"
	"warehouse-backend/entity"
	"warehouse-backend/routes"
	"warehouse-backend/services"
	"warehouse-backend/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// 1️⃣ Load cấu hình từ .env
	config.LoadConfig()
	log.Println("👉 DB STRING:", config.ENV.DBConn)

	// 2️⃣ Kết nối Database
	db, err := gorm.Open(postgres.Open(config.ENV.DBConn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ KẾT NỐI DATABASE THẤT BẠI:", err)
	}
	log.Println("✅ KẾT NỐI DATABASE THÀNH CÔNG")

	// 3️⃣ Ping test
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("❌ Không lấy được SQL DB:", err)
	}
	if err = sqlDB.Ping(); err != nil {
		log.Fatal("❌ DATABASE KHÔNG PING ĐƯỢC:", err)
	}

	// 4️⃣ Auto Migrate
	err = db.AutoMigrate(
		&entity.User{},
		&entity.Product{},
		&entity.Location{},
		&entity.Inventory{},
		&entity.Import{},
		&entity.ImportItem{},
		&entity.Export{},
		&entity.ExportItem{},
		&entity.Transaction{},
	)
	if err != nil {
		log.Fatal("❌ MIGRATE LỖI:", err)
	}
	log.Println("✅ MIGRATE THÀNH CÔNG")

	// 5️⃣ Seed Admin mặc định (chỉ khi chưa có admin nào)
	seedDefaultAdmin(db)

	// 6️⃣ Khởi tạo Gin router với CORS
	r := gin.Default()
	r.Use(corsMiddleware())

	// 7️⃣ Health check
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong", "status": "ok"})
	})

	// 8️⃣ Đăng ký toàn bộ route
	routes.SetupRoutes(r, db)

	// 9️⃣ Chạy server
	log.Println("🚀 Server chạy tại port:", config.ENV.Port)
	r.Run(":" + config.ENV.Port)
}

func seedDefaultAdmin(db *gorm.DB) {
	adminUsername := os.Getenv("ADMIN_DEFAULT_USERNAME")
	adminEmail := os.Getenv("ADMIN_DEFAULT_EMAIL")
	adminPassword := os.Getenv("ADMIN_DEFAULT_PASSWORD")

	if adminUsername == "" {
		adminUsername = "admin"
	}
	if adminEmail == "" {
		adminEmail = "admin@warehouse.com"
	}
	if adminPassword == "" {
		adminPassword = "Admin@123"
	}

	hashedPw, err := utils.HashPassword(adminPassword)
	if err != nil {
		log.Println("⚠️ Không thể hash password admin mặc định:", err)
		return
	}

	if err := services.SeedAdminIfNotExists(db, adminUsername, adminEmail, hashedPw); err != nil {
		log.Println("⚠️ Seed admin lỗi:", err)
		return
	}
}

// corsMiddleware cho phép frontend React và Flutter gọi API
func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

