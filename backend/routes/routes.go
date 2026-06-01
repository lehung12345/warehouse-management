package routes

import (
	"warehouse-backend/controllers"
	"warehouse-backend/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// SetupRoutes đăng ký toàn bộ route của ứng dụng
// func SetupRoutes(r *gin.Engine, db *gorm.DB) {

// 	// =============================================
// 	// 🌐 PUBLIC ROUTES (không cần auth)
// 	// =============================================
// 	controllers.RegisterAuthRoutes(r, db)

// 	// =============================================
// 	// 🔐 PROTECTED ROUTES (cần JWT token)
// 	// =============================================
// 	protected := r.Group("/")
// 	protected.Use(middleware.AuthMiddleware())
// 	{
// 		// ─── ADMIN ONLY ───────────────────────────────
// 		adminGroup := protected.Group("/admin")
// 		adminGroup.Use(middleware.RequireRole("ADMIN"))
// 		{
// 			// Quản lý user / nhân viên
// 			controllers.RegisterUserManagementRoutes(adminGroup, db)
			
// 			controllers.RegisterProductRoutes(adminGroup, db)
// 		}

// 		// ─── STAFF ONLY ───────────────────────────────
// 		staffGroup := protected.Group("/staff")
// 		staffGroup.Use(middleware.RequireRole("STAFF", "ADMIN"))
// 		{
// 			// Placeholder – sẽ thêm sau
// 			staffGroup.GET("/me", func(c *gin.Context) {
// 				c.JSON(200, gin.H{
// 					"user_id":  c.GetUint("userID"),
// 					"username": c.GetString("username"),
// 					"email":    c.GetString("email"),
// 					"role":     c.GetString("role"),
// 				})
// 			})
// 		}

// 		// ─── PROFILE (mọi role) ───────────────────────
// 		protected.GET("/me", func(c *gin.Context) {
// 			c.JSON(200, gin.H{
// 				"user_id":  c.GetUint("userID"),
// 				"username": c.GetString("username"),
// 				"email":    c.GetString("email"),
// 				"role":     c.GetString("role"),
// 			})
// 		})
// 		InventoryRoutes(protected, db)
// 		LocationRoutes(protected, db)
// 		OrderRoutes(protected, db)
// 		ScanRoutes(protected, db)
// 		ReportRoutes(protected, db)
// 	}
// }




func SetupRoutes(r *gin.Engine, db *gorm.DB) {
    // =============================================
    // 🌐 PUBLIC ROUTES (Không cần Auth)
    // =============================================
    controllers.RegisterAuthRoutes(r, db) // Thường là /auth/login công khai

    // =============================================
    // 🔐 GROUP 1: DÀNH CHO WEB ADMIN (Giữ nguyên cấu trúc cũ)
    // =============================================
    webProtected := r.Group("/")
    webProtected.Use(middleware.AuthMiddleware())
    {
        adminGroup := webProtected.Group("/admin")
        adminGroup.Use(middleware.RequireRole("ADMIN"))
        {
            controllers.RegisterUserManagementRoutes(adminGroup, db)
            controllers.RegisterProductRoutes(adminGroup, db)
            InventoryRoutes(adminGroup, db) // /admin/inventories
            LocationRoutes(adminGroup, db)  // /admin/locations
            OrderRoutes(adminGroup, db)     // /admin/orders/...
            ReportRoutes(adminGroup, db)    // /admin/reports/...
        }
    }

    // =============================================
    // 🔐 GROUP 2: DÀNH CHO FLUTTER APP (Cấu hình có tiền tố /api)
    // =============================================
    apiProtected := r.Group("/api")
    apiProtected.Use(middleware.AuthMiddleware())
    {
        // Màn hình thông tin cá nhân của nhân viên: /api/me hoặc /api/staff/me
        apiProtected.GET("/me", func(c *gin.Context) {
            c.JSON(200, gin.H{
                "user_id":  c.GetUint("userID"),
                "username": c.GetString("username"),
                "email":    c.GetString("email"),
                "role":     c.GetString("role"),
            })
        })

        staffGroup := apiProtected.Group("/staff")
        staffGroup.Use(middleware.RequireRole("STAFF"))
        {
            staffGroup.GET("/me", func(c *gin.Context) {
                c.JSON(200, gin.H{
                    "user_id":  c.GetUint("userID"),
                    "username": c.GetString("username"),
                    "role":     c.GetString("role"),
                })
            })
        }

        // Đăng ký các route xử lý nghiệp vụ Quét và Đơn hàng riêng với tiền tố /api cho Flutter
        InventoryRoutes(apiProtected, db) // Tạo thêm: /api/inventories
        LocationRoutes(apiProtected, db)  // Tạo thêm: /api/locations
        ProductRoutes(apiProtected, db)   // Tạo thêm: /api/products
        OrderRoutes(apiProtected, db)     // Tạo thêm: /api/orders/... hoặc /api/orders/import
        ScanRoutes(apiProtected, db)      // Tạo thêm: /api/scan/import và /api/scan/export
        ReportRoutes(apiProtected, db)    // Tạo thêm: /api/reports/...
    }
}