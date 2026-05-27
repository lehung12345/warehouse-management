package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"warehouse-backend/controllers"
	"warehouse-backend/services"
)

func LocationRoutes(r *gin.RouterGroup, db *gorm.DB) {
	service := services.NewLocationService(db)
	controller := controllers.NewLocationController(service)

	api := r.Group("/api/locations")
	{
		api.POST("", controller.Create)
		api.GET("", controller.GetAll)
		api.GET("/tree", controller.GetTree)
	}
}