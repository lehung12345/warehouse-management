package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"warehouse-backend/services"
)

type InventoryController struct {
	Service *services.InventoryService
}

func NewInventoryController(s *services.InventoryService) *InventoryController {
	return &InventoryController{Service: s}
}

func (c *InventoryController) GetInventories(ctx *gin.Context) {
	productID := ctx.Query("product_id")
	locationID := ctx.Query("location_id")
	low := ctx.Query("low")

	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "10"))

	data, err := c.Service.GetAll(productID, locationID, low, page, limit)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 🔥 thêm trạng thái LOW
	var result []gin.H

	for _, inv := range data {
		status := "OK"
		if inv.Quantity <= inv.MinQuantity {
			status = "LOW"
		}

		locationPath := services.BuildLocationPath(c.Service.DB, inv.LocationID)

		result = append(result, gin.H{
			"id":       inv.ID,
			"product":  inv.Product.Name,
			"sku":      inv.Product.SKU,
			"quantity": inv.Quantity,
			// "location": inv.Location.Name,
			"location": locationPath,
			"status":   status,
		})
	}

	ctx.JSON(http.StatusOK, result)
}

func (c *InventoryController) ImportProduct(ctx *gin.Context) {
	var req struct {
		ProductID  uint `json:"product_id"`
		LocationID uint `json:"location_id"`
		Quantity   int  `json:"quantity"`
		ImportID   uint `json:"import_id"`
		UserID     uint `json:"user_id"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	err := c.Service.ImportProduct(
		req.ProductID,
		req.LocationID,
		req.Quantity,
		req.UserID,
		req.ImportID,
	)

	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "import success"})
}

func (c *InventoryController) ExportProduct(ctx *gin.Context) {
	var req struct {
		ProductID  uint `json:"product_id"`
		LocationID uint `json:"location_id"`
		Quantity   int  `json:"quantity"`
		ExportID   uint `json:"export_id"`
		UserID     uint `json:"user_id"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	err := c.Service.ExportProduct(
		req.ProductID,
		req.LocationID,
		req.Quantity,
		req.UserID,
		req.ExportID,
	)

	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "export success"})
}