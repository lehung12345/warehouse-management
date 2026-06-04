package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"warehouse-backend/entity"
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

	// 🔥 ĐÃ SỬA: Nhận thêm biến total từ service.GetAll
	data, total, err := c.Service.GetAll(productID, locationID, low, page, limit)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var result []gin.H

	for _, inv := range data {
		status := "OK"
		if inv.Quantity <= inv.MinQuantity {
			status = "LOW"
		}

		locationPath := services.BuildLocationPath(c.Service.DB, inv.LocationID)

		result = append(result, gin.H{
			"id":           inv.ID,
			"product_id":   inv.ProductID,
			"product":      inv.Product.Name,
			"sku":          inv.Product.SKU,
			"quantity":     inv.Quantity,
			"min_quantity": inv.MinQuantity,
			"location":     locationPath,
			"status":       status,
		})
	}

	// 🔥 ĐÃ SỬA: Trả về Object chuẩn gồm data, tổng số phần tử để frontend chia trang
	ctx.JSON(http.StatusOK, gin.H{
		"data":  result,
		"total": total,
		"page":  page,
		"limit": limit,
	})
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

func (c *InventoryController) UpdateMinQuantity(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))

	var req struct {
		MinQuantity int `json:"min_quantity"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	err := c.Service.DB.Model(&entity.Inventory{}).Where("id = ?", id).Update("min_quantity", req.MinQuantity).Error
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "Min quantity updated successfully"})
}