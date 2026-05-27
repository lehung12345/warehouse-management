package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"warehouse-backend/controllers"
	"warehouse-backend/services"
)

func ScanRoutes(r *gin.RouterGroup, db *gorm.DB) {

	service := services.NewScanService(db)
	controller := controllers.NewScanController(service)

	api := r.Group("/api/scan")
	{
		api.POST("/import", controller.ScanImport)
		api.POST("/export", controller.ScanExport)
	}
}