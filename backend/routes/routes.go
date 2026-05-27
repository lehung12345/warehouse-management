package routes

import (
	"warehouse-backend/controllers"
	"warehouse-backend/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// SetupRoutes đăng ký toàn bộ route của ứng dụng
func SetupRoutes(r *gin.Engine, db *gorm.DB) {

	// =============================================
	// 🌐 PUBLIC ROUTES (không cần auth)
	// =============================================
	controllers.RegisterAuthRoutes(r, db)

	// =============================================
	// 🔐 PROTECTED ROUTES (cần JWT token)
	// =============================================
	protected := r.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		// ─── ADMIN ONLY ───────────────────────────────
		adminGroup := protected.Group("/admin")
		adminGroup.Use(middleware.RequireRole("ADMIN"))
		{
			// Quản lý user / nhân viên
			controllers.RegisterUserManagementRoutes(adminGroup, db)
			
			controllers.RegisterProductRoutes(adminGroup, db)
		}

		// ─── STAFF ONLY ───────────────────────────────
		staffGroup := protected.Group("/staff")
		staffGroup.Use(middleware.RequireRole("STAFF", "ADMIN"))
		{
			// Placeholder – sẽ thêm sau
			staffGroup.GET("/me", func(c *gin.Context) {
				c.JSON(200, gin.H{
					"user_id":  c.GetUint("userID"),
					"username": c.GetString("username"),
					"email":    c.GetString("email"),
					"role":     c.GetString("role"),
				})
			})
		}

		// ─── PROFILE (mọi role) ───────────────────────
		protected.GET("/me", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"user_id":  c.GetUint("userID"),
				"username": c.GetString("username"),
				"email":    c.GetString("email"),
				"role":     c.GetString("role"),
			})
		})
		InventoryRoutes(protected, db)
		LocationRoutes(protected, db)
		OrderRoutes(protected, db)
		ScanRoutes(protected, db)
		ReportRoutes(protected, db)
	}
}
