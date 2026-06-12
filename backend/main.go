// package main

// import (
// 	"log"
// 	"strings"

// 	"warehouse-backend/config"
// 	"warehouse-backend/entity"
// 	"warehouse-backend/routes"
// 	"warehouse-backend/services"
// 	"warehouse-backend/utils"

// 	"github.com/gin-gonic/gin"
// 	"gorm.io/gorm"
// )

// func main() {
// 	// Load config từ .env
// 	config.LoadConfig()

// 	// Kết nối database (chuẩn)
// 	config.ConnectDB()
// 	db := config.DB

// 	// Ping database
// 	sqlDB, err := db.DB()
// 	if err != nil {
// 		log.Fatal("❌ Không lấy được SQL DB:", err)
// 	}
// 	if err = sqlDB.Ping(); err != nil {
// 		log.Fatal("❌ DATABASE KHÔNG PING ĐƯỢC:", err)
// 	}
// 	log.Println("✅ KẾT NỐI DATABASE THÀNH CÔNG")

// 	// Auto migrate
// 	err = db.AutoMigrate(
// 		&entity.User{},
// 		&entity.Product{},
// 		&entity.Location{},
// 		&entity.Inventory{},
// 		&entity.Import{},
// 		&entity.ImportItem{},
// 		&entity.Export{},
// 		&entity.ExportItem{},
// 		&entity.Transaction{},
// 		&entity.OrderSeenStatus{},
// 	)
// 	// Bỏ qua lỗi constraint không tồn tại (GORM cố drop constraint cũ)
// 	if err != nil && !strings.Contains(err.Error(), "does not exist") {
// 		log.Fatal("❌ MIGRATE LỖI:", err)
// 	}
// 	log.Println("✅ MIGRATE THÀNH CÔNG")

// 	// Tạo admin mặc định nếu chưa có
// 	hashedPassword, err := utils.HashPassword(config.ENV.AdminPassword)
// 	if err != nil {
// 		log.Fatal("❌ LỖI HASH PASSWORD ADMIN:", err)
// 	}
// 	err = services.SeedAdminIfNotExists(db, config.ENV.AdminUsername, config.ENV.AdminEmail, hashedPassword)
// 	if err != nil {
// 		log.Fatal("❌ LỖI TẠO ADMIN MẶC ĐỊNH:", err)
// 	}
// 	log.Println("✅ KIỂM TRA ADMIN THÀNH CÔNG")

// 	// Drop unique constraint trên username (cho phép trùng username)
// 	dropUsernameUniqueConstraint(db)

// 	// Reset sequences để tránh duplicate primary key
// 	fixSequences(db)

// 	// Tắt debug mode để không hiện chi tiết
// 	gin.SetMode(gin.ReleaseMode)

// 	// Khởi tạo server
// 	r := gin.Default()
// 	r.Use(corsMiddleware())

// 	// API test
// 	r.GET("/ping", func(c *gin.Context) {
// 		c.JSON(200, gin.H{"message": "pong"})
// 	})

// 	// React
// 	r.Static("/assets", "./dist/assets")
// 	r.StaticFile("/favicon.svg", "./dist/favicon.svg")
// 	r.StaticFile("/icons.svg", "./dist/icons.svg")

// 	// Routes
// 	routes.SetupRoutes(r, db)

// 	// SPA
// 	r.NoRoute(func(c *gin.Context) {
// 		c.File("./dist/index.html")
// 	})

// 	// Run server
// 	log.Println("🚀 Server chạy tại port:", config.ENV.Port)
// 	// r.Run(":" + config.ENV.Port)
// 	r.Run("0.0.0.0:" + config.ENV.Port) //dùng súng rfid thì dùng
// }

// // CORS Middleware
// func corsMiddleware() gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
// 		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
// 		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
// 		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

// 		if c.Request.Method == "OPTIONS" {
// 			c.AbortWithStatus(204)
// 			return
// 		}

// 		c.Next()
// 	}
// }

// // Drop unique constraint trên username
// func dropUsernameUniqueConstraint(db *gorm.DB) {
// 	// Drop cả 2 tên constraint có thể tồn tại
// 	constraints := []string{"users_username_key", "uni_users_username"}
// 	for _, constraint := range constraints {
// 		query := `ALTER TABLE users DROP CONSTRAINT IF EXISTS ` + constraint
// 		db.Exec(query)
// 	}
// }

// // Fix PostgreSQL Sequences
// func fixSequences(db *gorm.DB) {
// 	tables := []string{
// 		"products", "locations", "imports", "exports",
// 		"import_items", "export_items", "inventories", "users", "transactions", "order_seen_statuses",
// 	}
// 	for _, table := range tables {
// 		query := `SELECT setval(pg_get_serial_sequence('` + table + `', 'id'), COALESCE((SELECT MAX(id) FROM "` + table + `"), 0) + 1, false)`
// 		db.Exec(query)
// 	}
// }



//bản mới chạy 1 file thôi 
// package main

// import (
// 	"embed"
// 	"io/fs"
// 	"log"
// 	"net/http"
// 	"strings"

// 	"warehouse-backend/config"
// 	"warehouse-backend/entity"
// 	"warehouse-backend/routes"
// 	"warehouse-backend/services"
// 	"warehouse-backend/utils"

// 	"github.com/gin-gonic/gin"
// 	"gorm.io/gorm"
// )

// // Đóng gói toàn bộ thư mục dist vào trong file chạy
// //go:embed dist/*
// var embedFS embed.FS

// func main() {
// 	// Load config từ .env
// 	config.LoadConfig()

// 	// Kết nối database (chuẩn)
// 	config.ConnectDB()
// 	db := config.DB

// 	// Ping database
// 	sqlDB, err := db.DB()
// 	if err != nil {
// 		log.Fatal("❌ Không lấy được SQL DB:", err)
// 	}
// 	if err = sqlDB.Ping(); err != nil {
// 		log.Fatal("❌ DATABASE KHÔNG PING ĐƯỢC:", err)
// 	}
// 	log.Println("✅ KẾT NỐI DATABASE THÀNH CÔNG")

// 	// Auto migrate
// 	err = db.AutoMigrate(
// 		&entity.User{},
// 		&entity.Product{},
// 		&entity.Location{},
// 		&entity.Inventory{},
// 		&entity.Import{},
// 		&entity.ImportItem{},
// 		&entity.Export{},
// 		&entity.ExportItem{},
// 		&entity.Transaction{},
// 		&entity.OrderSeenStatus{},
// 	)
// 	// Bỏ qua lỗi constraint không tồn tại (GORM cố drop constraint cũ)
// 	if err != nil && !strings.Contains(err.Error(), "does not exist") {
// 		log.Fatal("❌ MIGRATE LỖI:", err)
// 	}
// 	log.Println("✅ MIGRATE THÀNH CÔNG")

// 	// Tạo admin mặc định nếu chưa có
// 	hashedPassword, err := utils.HashPassword(config.ENV.AdminPassword)
// 	if err != nil {
// 		log.Fatal("❌ LỖI HASH PASSWORD ADMIN:", err)
// 	}
// 	err = services.SeedAdminIfNotExists(db, config.ENV.AdminUsername, config.ENV.AdminEmail, hashedPassword)
// 	if err != nil {
// 		log.Fatal("❌ LỖI TẠO ADMIN MẶC ĐỊNH:", err)
// 	}
// 	log.Println("✅ KIỂM TRA ADMIN THÀNH CÔNG")

// 	// Drop unique constraint trên username (cho phép trùng username)
// 	dropUsernameUniqueConstraint(db)

// 	// Reset sequences để tránh duplicate primary key
// 	fixSequences(db)

// 	// Tắt debug mode để không hiện chi tiết
// 	gin.SetMode(gin.ReleaseMode)

// 	// Khởi tạo server
// 	r := gin.Default()
// 	r.Use(corsMiddleware())

// 	// API test
// 	r.GET("/ping", func(c *gin.Context) {
// 		c.JSON(200, gin.H{"message": "pong"})
// 	})

// 	// Cấu hình đọc Frontend từ file nhúng (embed)
// 	distFS, err := fs.Sub(embedFS, "dist")
// 	if err != nil {
// 		log.Fatal("❌ Lỗi cấu hình tài nguyên tĩnh (embed):", err)
// 	}

// 	// Phục vụ các file tĩnh trong dist
// 	r.StaticFS("/assets", http.FS(distFS))

// 	// Map các file static riêng lẻ ngoài index.html nếu có ở tầng root của dist
// 	r.GET("/favicon.svg", func(c *gin.Context) {
// 		c.FileFromFS("favicon.svg", http.FS(distFS))
// 	})
// 	r.GET("/icons.svg", func(c *gin.Context) {
// 		c.FileFromFS("icons.svg", http.FS(distFS))
// 	})

// 	// Routes APIs
// 	routes.SetupRoutes(r, db)

// 	// SPA Router - Trả về index.html từ bộ nhớ nhúng khi không khớp API
// 	r.NoRoute(func(c *gin.Context) {
// 		// Nếu client yêu cầu route không phải API, trả về index.html nhúng sẵn
// 		file, err := distFS.Open("index.html")
// 		if err != nil {
// 			c.String(http.StatusNotFound, "Frontend build không tồn tại hoặc lỗi")
// 			return
// 		}
// 		defer file.Close()

// 		stat, _ := file.Stat()
// 		c.DataFromReader(http.StatusOK, stat.Size(), "text/html; charset=utf-8", file, nil)
// 	})

// 	// Run server
// 	log.Println("🚀 Server chạy tại port:", config.ENV.Port)
// 	r.Run("0.0.0.0:" + config.ENV.Port) // Hỗ trợ kết nối LAN, RFID, WSL ngoại mạng
// }

// // CORS Middleware
// func corsMiddleware() gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
// 		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
// 		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
// 		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

// 		if c.Request.Method == "OPTIONS" {
// 			c.AbortWithStatus(204)
// 			return
// 		}

// 		c.Next()
// 	}
// }

// // Drop unique constraint trên username
// func dropUsernameUniqueConstraint(db *gorm.DB) {
// 	constraints := []string{"users_username_key", "uni_users_username"}
// 	for _, constraint := range constraints {
// 		query := `ALTER TABLE users DROP CONSTRAINT IF EXISTS ` + constraint
// 		db.Exec(query)
// 	}
// }

// // Fix PostgreSQL Sequences
// func fixSequences(db *gorm.DB) {
// 	tables := []string{
// 		"products", "locations", "imports", "exports",
// 		"import_items", "export_items", "inventories", "users", "transactions", "order_seen_statuses",
// 	}
// 	for _, table := range tables {
// 		query := `SELECT setval(pg_get_serial_sequence('` + table + `', 'id'), COALESCE((SELECT MAX(id) FROM "` + table + `"), 0) + 1, false)`
// 		db.Exec(query)
// 	}
// }




//bản mới linux win
// package main

// import (
// 	"embed"
// 	"io/fs"
// 	"log"
// 	"net/http"
// 	"strings"

// 	"warehouse-backend/config"
// 	"warehouse-backend/entity"
// 	"warehouse-backend/routes"
// 	"warehouse-backend/services"
// 	"warehouse-backend/utils"

// 	"github.com/gin-gonic/gin"
// 	"gorm.io/gorm"
// )

// // Đóng gói toàn bộ thư mục dist vào trong file chạy
// //go:embed dist/*
// var embedFS embed.FS

// func main() {
// 	// Load config từ .env
// 	config.LoadConfig()

// 	// Kết nối database (chuẩn)
// 	config.ConnectDB()
// 	db := config.DB

// 	// Ping database
// 	sqlDB, err := db.DB()
// 	if err != nil {
// 		log.Fatal("❌ Không lấy được SQL DB:", err)
// 	}
// 	if err = sqlDB.Ping(); err != nil {
// 		log.Fatal("❌ DATABASE KHÔNG PING ĐƯỢC:", err)
// 	}
// 	log.Println("✅ KẾT NỐI DATABASE THÀNH CÔNG")

// 	// Auto migrate
// 	err = db.AutoMigrate(
// 		&entity.User{},
// 		&entity.Product{},
// 		&entity.Location{},
// 		&entity.Inventory{},
// 		&entity.Import{},
// 		&entity.ImportItem{},
// 		&entity.Export{},
// 		&entity.ExportItem{},
// 		&entity.Transaction{},
// 		&entity.OrderSeenStatus{},
// 	)
// 	if err != nil && !strings.Contains(err.Error(), "does not exist") {
// 		log.Fatal("❌ MIGRATE LỖI:", err)
// 	}
// 	log.Println("✅ MIGRATE THÀNH CÔNG")

// 	// Tạo admin mặc định nếu chưa có
// 	hashedPassword, err := utils.HashPassword(config.ENV.AdminPassword)
// 	if err != nil {
// 		log.Fatal("❌ LỖI HASH PASSWORD ADMIN:", err)
// 	}
// 	err = services.SeedAdminIfNotExists(db, config.ENV.AdminUsername, config.ENV.AdminEmail, hashedPassword)
// 	if err != nil {
// 		log.Fatal("❌ LỖI TẠO ADMIN MẶC ĐỊNH:", err)
// 	}
// 	log.Println("✅ KIỂM TRA ADMIN THÀNH CÔNG")

// 	dropUsernameUniqueConstraint(db)
// 	fixSequences(db)

// 	// Tắt debug mode để chạy mượt hơn ở môi trường production
// 	gin.SetMode(gin.ReleaseMode)

// 	r := gin.Default()
// 	r.Use(corsMiddleware())

// 	// API test
// 	r.GET("/ping", func(c *gin.Context) {
// 		c.JSON(200, gin.H{"message": "pong"})
// 	})

// 	// Cấu hình gốc đọc Frontend từ file nhúng (embed)
// 	distFS, err := fs.Sub(embedFS, "dist")
// 	if err != nil {
// 		log.Fatal("❌ Lỗi cấu hình tài nguyên tĩnh (embed):", err)
// 	}

// 	// 🛠️ FIX TRIỆT ĐỂ TẠI ĐÂY: Hệ thống file embed bắt buộc dùng dấu "/" cố định cho cả Win và Linux
// 	assetsFS, err := fs.Sub(embedFS, "dist/assets")
// 	if err != nil {
// 		log.Fatal("❌ Lỗi cấu hình thư mục assets (embed):", err)
// 	}
// 	r.StaticFS("/assets", http.FS(assetsFS))

// 	// Map các file tĩnh ngoài root của dist
// 	r.GET("/favicon.svg", func(c *gin.Context) {
// 		c.FileFromFS("favicon.svg", http.FS(distFS))
// 	})
// 	r.GET("/icons.svg", func(c *gin.Context) {
// 		c.FileFromFS("icons.svg", http.FS(distFS))
// 	})

// 	// Routes APIs
// 	routes.SetupRoutes(r, db)

// 	// SPA Router
// 	r.NoRoute(func(c *gin.Context) {
// 		file, err := distFS.Open("index.html")
// 		if err != nil {
// 			c.String(http.StatusNotFound, "Frontend build không tồn tại hoặc lỗi")
// 			return
// 		}
// 		defer file.Close()

// 		stat, _ := file.Stat()
// 		c.DataFromReader(http.StatusOK, stat.Size(), "text/html; charset=utf-8", file, nil)
// 	})

// 	log.Println("🚀 Server chạy tại port:", config.ENV.Port)
// 	r.Run("0.0.0.0:" + config.ENV.Port)
// }

// func corsMiddleware() gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
// 		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
// 		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
// 		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

// 		if c.Request.Method == "OPTIONS" {
// 			c.AbortWithStatus(204)
// 			return
// 		}
// 		c.Next()
// 	}
// }

// func dropUsernameUniqueConstraint(db *gorm.DB) {
// 	constraints := []string{"users_username_key", "uni_users_username"}
// 	for _, constraint := range constraints {
// 		query := `ALTER TABLE users DROP CONSTRAINT IF EXISTS ` + constraint
// 		db.Exec(query)
// 	}
// }

// func fixSequences(db *gorm.DB) {
// 	tables := []string{
// 		"products", "locations", "imports", "exports",
// 		"import_items", "export_items", "inventories", "users", "transactions", "order_seen_statuses",
// 	}
// 	for _, table := range tables {
// 		query := `SELECT setval(pg_get_serial_sequence('` + table + `', 'id'), COALESCE((SELECT MAX(id) FROM "` + table + `"), 0) + 1, false)`
// 		db.Exec(query)
// 	}
// }







//bản chạy đc 
package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"strings"

	"warehouse-backend/config"
	"warehouse-backend/entity"
	"warehouse-backend/routes"
	"warehouse-backend/services"
	"warehouse-backend/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// embed toàn bộ FE dist
//go:embed dist/*
var embedFS embed.FS

func main() {
	// Load config
	config.LoadConfig()

	// DB
	config.ConnectDB()
	db := config.DB

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
	if err != nil && !strings.Contains(err.Error(), "does not exist") {
		log.Fatal("❌ MIGRATE LỖI:", err)
	}
	log.Println("✅ MIGRATE THÀNH CÔNG")

	// Seed admin
	hashedPassword, err := utils.HashPassword(config.ENV.AdminPassword)
	if err != nil {
		log.Fatal("❌ LỖI HASH PASSWORD ADMIN:", err)
	}
	err = services.SeedAdminIfNotExists(
		db,
		config.ENV.AdminUsername,
		config.ENV.AdminEmail,
		hashedPassword,
	)
	if err != nil {
		log.Fatal("❌ LỖI TẠO ADMIN:", err)
	}
	log.Println("✅ KIỂM TRA ADMIN THÀNH CÔNG")

	dropUsernameUniqueConstraint(db)
	fixSequences(db)

	// release mode
	gin.SetMode(gin.ReleaseMode)

	r := gin.Default()
	r.Use(corsMiddleware())

	// test API
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	// EMBED FRONTEND
	distFS, err := fs.Sub(embedFS, "dist")
	if err != nil {
		log.Fatal("❌ Lỗi dist embed:", err)
	}

	assetsFS, err := fs.Sub(embedFS, "dist/assets")
	if err != nil {
		log.Fatal("❌ Lỗi assets embed:", err)
	}
	r.StaticFS("/assets", http.FS(assetsFS))

	r.GET("/favicon.svg", func(c *gin.Context) {
		c.FileFromFS("favicon.svg", http.FS(distFS))
	})
	r.GET("/icons.svg", func(c *gin.Context) {
		c.FileFromFS("icons.svg", http.FS(distFS))
	})

	// API routes
	routes.SetupRoutes(r, db)

	// SPA fallback
	r.NoRoute(func(c *gin.Context) {
		file, err := distFS.Open("index.html")
		if err != nil {
			c.String(http.StatusNotFound, "Frontend not found")
			return
		}
		defer file.Close()

		stat, _ := file.Stat()
		c.DataFromReader(
			http.StatusOK,
			stat.Size(),
			"text/html; charset=utf-8",
			file,
			nil,
		)
	})

	// PORT
	port := config.ENV.Port

	// GET IP
	ip := utils.GetLocalIP()

	log.Println("🚀 Server chạy tại port:" + port)
	log.Println("👉 Local: http://localhost:" + port)
	log.Println("👉 LAN:   http://" + ip + ":" + port)

	// IMPORTANT: bind all interfaces
	r.Run("0.0.0.0:" + port)
}

// CORS
func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}

// DB helpers
func dropUsernameUniqueConstraint(db *gorm.DB) {
	constraints := []string{"users_username_key", "uni_users_username"}
	for _, constraint := range constraints {
		db.Exec(`ALTER TABLE users DROP CONSTRAINT IF EXISTS ` + constraint)
	}
}

func fixSequences(db *gorm.DB) {
	tables := []string{
		"products", "locations", "imports", "exports",
		"import_items", "export_items", "inventories",
		"users", "transactions", "order_seen_statuses",
	}

	for _, table := range tables {
		query := `
		SELECT setval(
			pg_get_serial_sequence('` + table + `', 'id'),
			COALESCE((SELECT MAX(id) FROM "` + table + `"), 0) + 1,
			false
		)`
		db.Exec(query)
	}
}