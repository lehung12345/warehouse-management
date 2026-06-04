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

	api := r.Group("/orders")
	{
		// Import
		api.POST("/import", controller.CreateImport)
		api.GET("/import", controller.GetImports)
		api.GET("/import/:id", controller.GetImportByID)
		api.GET("/import/code/:code", controller.GetImportByCode)
		api.POST("/import/:id/cancel", controller.CancelImport)
		api.POST("/import/:id/approve", controller.ApproveImport)

		// Export
		api.POST("/export", controller.CreateExport)
		api.GET("/export", controller.GetExports)
		api.GET("/export/:id", controller.GetExportByID)
		api.GET("/export/code/:code", controller.GetExportByCode)
		api.POST("/export/:id/cancel", controller.CancelExport)
		api.POST("/export/:id/approve", controller.ApproveExport)

		// Notification/Seen status
		api.POST("/mark-seen", controller.MarkOrderAsSeen)
		api.GET("/unseen-counts", controller.GetUnseenCounts)
	}
}