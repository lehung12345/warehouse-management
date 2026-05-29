package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"warehouse-backend/controllers"
	"warehouse-backend/services"
)

func OrderRoutes(r *gin.RouterGroup, db *gorm.DB) {
	service := services.NewOrderService(db)
	controller := controllers.NewOrderController(service)

	api := r.Group("/api/orders")
	{
		// Import
		api.POST("/import", controller.CreateImport)
		api.GET("/import", controller.GetImports)
		api.GET("/import/:id", controller.GetImportByID) // ✅ thêm
		api.POST("/import/:id/cancel", controller.CancelImport)

		// Export
		api.POST("/export", controller.CreateExport)
		api.GET("/export", controller.GetExports)
		api.GET("/export/:id", controller.GetExportByID) // ✅ thêm
		api.POST("/export/:id/cancel", controller.CancelExport)

		// Complete
		// api.POST("/import/:id/done", controller.CompleteImport)
		// api.POST("/export/:id/done", controller.CompleteExport)
	}
}