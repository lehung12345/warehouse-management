package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"warehouse-backend/controllers"
	"warehouse-backend/services"
)

func ReportRoutes(r *gin.RouterGroup, db *gorm.DB) {

	service := services.NewReportService(db)
	controller := controllers.NewReportController(service)

	api := r.Group("/reports")
	{
		api.GET("/import-export", controller.ImportExport)
		api.GET("/stock", controller.Stock)
		api.GET("/top-products", controller.TopProducts)
	}
}