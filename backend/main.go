package main

import (
	"log"
	"strings"

	"warehouse-backend/config"
	"warehouse-backend/entity"
	"warehouse-backend/routes"
	"warehouse-backend/services"
	"warehouse-backend/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func main() {
	// Load config từ .env
	config.LoadConfig()

	// Kết nối database (chuẩn)
	config.ConnectDB()
	db := config.DB

	// Ping database
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("❌ Không lấy được SQL DB:", err)
	}
	if err = sqlDB.Ping(); err != nil {
		log.Fatal("❌ DATABASE KHÔNG PING ĐƯỢC:", err)
	}
	log.Println("✅ KẾT NỐI DATABASE THÀNH CÔNG")

	// Auto migrate
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
		&entity.OrderSeenStatus{},
	)
	// Bỏ qua lỗi constraint không tồn tại (GORM cố drop constraint cũ)
	if err != nil && !strings.Contains(err.Error(), "does not exist") {
		log.Fatal("❌ MIGRATE LỖI:", err)
	}
	log.Println("✅ MIGRATE THÀNH CÔNG")

	// Tạo admin mặc định nếu chưa có
	hashedPassword, err := utils.HashPassword(config.ENV.AdminPassword)
	if err != nil {
		log.Fatal("❌ LỖI HASH PASSWORD ADMIN:", err)
	}
	err = services.SeedAdminIfNotExists(db, config.ENV.AdminUsername, config.ENV.AdminEmail, hashedPassword)
	if err != nil {
		log.Fatal("❌ LỖI TẠO ADMIN MẶC ĐỊNH:", err)
	}
	log.Println("✅ KIỂM TRA ADMIN THÀNH CÔNG")

	// Drop unique constraint trên username (cho phép trùng username)
	dropUsernameUniqueConstraint(db)

	// Reset sequences để tránh duplicate primary key
	fixSequences(db)

	// Tắt debug mode để không hiện chi tiết
	gin.SetMode(gin.ReleaseMode)

	// Khởi tạo server
	r := gin.Default()
	r.Use(corsMiddleware())

	// API test
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	// Routes
	routes.SetupRoutes(r, db)

	// Run server
	log.Println("🚀 Server chạy tại port:", config.ENV.Port)
	r.Run(":" + config.ENV.Port)
	// r.Run("0.0.0.0:" + config.ENV.Port) dùng súng rfid thì dùng
}

// CORS Middleware
func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

// Drop unique constraint trên username
func dropUsernameUniqueConstraint(db *gorm.DB) {
	// Drop cả 2 tên constraint có thể tồn tại
	constraints := []string{"users_username_key", "uni_users_username"}
	for _, constraint := range constraints {
		query := `ALTER TABLE users DROP CONSTRAINT IF EXISTS ` + constraint
		db.Exec(query)
	}
}

// Fix PostgreSQL Sequences
func fixSequences(db *gorm.DB) {
	tables := []string{
		"products", "locations", "imports", "exports",
		"import_items", "export_items", "inventories", "users", "transactions", "order_seen_statuses",
	}
	for _, table := range tables {
		query := `SELECT setval(pg_get_serial_sequence('` + table + `', 'id'), COALESCE((SELECT MAX(id) FROM "` + table + `"), 0) + 1, false)`
		db.Exec(query)
	}
}