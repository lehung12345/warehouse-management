package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"warehouse-backend/entity"
	"warehouse-backend/services"
	"gorm.io/gorm"
)

func CreateProduct(c *gin.Context) {
	var product entity.Product

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := services.CreateProduct(&product)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, product)
}

func GetProducts(c *gin.Context) {
	products, err := services.GetAllProducts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot fetch products"})
		return
	}

	c.JSON(http.StatusOK, products)
}

func GetProductByID(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	product, err := services.GetProductByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	c.JSON(http.StatusOK, product)
}

func UpdateProduct(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	var product entity.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	product.ID = uint(id)

	err := services.UpdateProduct(&product)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, product)
}

func DeleteProduct(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	err := services.DeleteProduct(uint(id))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Delete failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

func RegisterProductRoutes(rg *gin.RouterGroup, db *gorm.DB) {

	product := rg.Group("/products")

	product.GET("", GetProducts)
	product.GET("/:id", GetProductByID)

	product.POST("", CreateProduct)
	product.PUT("/:id", UpdateProduct)
	product.DELETE("/:id", DeleteProduct)
}