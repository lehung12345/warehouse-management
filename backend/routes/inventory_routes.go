package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"warehouse-backend/controllers"
	"warehouse-backend/services"
)

func InventoryRoutes(r *gin.RouterGroup, db *gorm.DB) {
	service := services.NewInventoryService(db)
	controller := controllers.NewInventoryController(service)

	api := r.Group("/api/inventories")
	{
		api.GET("", controller.GetInventories)
	}

	scan := r.Group("/scan")
	{
		scan.POST("/import", controller.ImportProduct)
		scan.POST("/export", controller.ExportProduct)
	}
}