package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"warehouse-backend/controllers"
)

func ProductRoutes(r *gin.RouterGroup, db *gorm.DB) {
	product := r.Group("/products")
	{
		product.GET("", controllers.GetProducts)
		product.GET("/:id", controllers.GetProductByID)
		product.POST("", controllers.CreateProduct)
		product.PUT("/:id", controllers.UpdateProduct)
		product.DELETE("/:id", controllers.DeleteProduct)
	}
}
