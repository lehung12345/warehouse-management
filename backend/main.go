package main

import (
	"log"

	"warehouse-backend/config"
	"warehouse-backend/entity"
	"warehouse-backend/routes"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func main() {
	// 1️⃣ Load config từ .env
	config.LoadConfig()

	// 2️⃣ Kết nối database (chuẩn)
	config.ConnectDB()
	db := config.DB

	// 3️⃣ Ping database
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("❌ Không lấy được SQL DB:", err)
	}
	if err = sqlDB.Ping(); err != nil {
		log.Fatal("❌ DATABASE KHÔNG PING ĐƯỢC:", err)
	}
	log.Println("✅ KẾT NỐI DATABASE THÀNH CÔNG")

	// 4️⃣ Auto migrate
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

	// 5️⃣ Reset sequences để tránh duplicate primary key
	fixSequences(db)

	// 6️⃣ Khởi tạo server
	r := gin.Default()
	r.Use(corsMiddleware())

	// 7️⃣ API test
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	// 8️⃣ Routes
	routes.SetupRoutes(r, db)

	// 9️⃣ Run server
	log.Println("🚀 Server chạy tại port:", config.ENV.Port)
	r.Run(":" + config.ENV.Port)
	// r.Run("0.0.0.0:" + config.ENV.Port) dùng súng rfid thì dùng
}


// =======================
// CORS Middleware
// =======================
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

// =======================
// Fix PostgreSQL Sequences
// =======================
func fixSequences(db *gorm.DB) {
	tables := []string{
		"products", "locations", "imports", "exports",
		"import_items", "export_items", "inventories", "users", "transactions",
	}
	for _, table := range tables {
		query := `SELECT setval(pg_get_serial_sequence('` + table + `', 'id'), COALESCE((SELECT MAX(id) FROM "` + table + `"), 0) + 1, false)`
		if err := db.Exec(query).Error; err != nil {
			log.Printf("⚠️  Không thể reset sequence cho bảng %s: %v", table, err)
		} else {
			log.Printf("🔧 Reset sequence: %s", table)
		}
	}
}