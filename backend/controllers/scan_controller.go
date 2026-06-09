package controllers

import (
	"github.com/gin-gonic/gin"
	"warehouse-backend/entity"
	"warehouse-backend/services"
)

type ScanController struct {
	Service *services.ScanService
}

func NewScanController(s *services.ScanService) *ScanController {
	return &ScanController{Service: s}
}

// SCAN IMPORT
func (c *ScanController) ScanImport(ctx *gin.Context) {

	var req struct {
		ImportID   uint   `json:"import_id"`
		Barcode    string `json:"barcode"` // ✅ nhận barcode thay vì product_id
		LocationID uint   `json:"location_id"`
		Quantity   int    `json:"quantity"`
	}

	// Parse request
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// 🔥 Tìm product theo barcode
	var product entity.Product
	if err := c.Service.DB.Where("barcode = ?", req.Barcode).First(&product).Error; err != nil {
		ctx.JSON(400, gin.H{"error": "Không tìm thấy sản phẩm"})
		return
	}

	// 🔥 Gọi service với product.ID chuẩn
	err := c.Service.ScanImport(
		req.ImportID,
		product.ID,
		req.LocationID,
		req.Quantity,
	)

	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "scan import success"})
}

// =======================
// 🔥 SCAN EXPORT
// =======================
func (c *ScanController) ScanExport(ctx *gin.Context) {

	var req struct {
		ExportID   uint   `json:"export_id"`
		Barcode    string `json:"barcode"` // ✅ nhận barcode
		LocationID uint   `json:"location_id"`
		Quantity   int    `json:"quantity"`
	}

	// Parse request
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// 🔥 Tìm product theo barcode
	var product entity.Product
	if err := c.Service.DB.Where("barcode = ?", req.Barcode).First(&product).Error; err != nil {
		ctx.JSON(400, gin.H{"error": "Không tìm thấy sản phẩm"})
		return
	}

	// 🔥 Gọi service
	err := c.Service.ScanExport(
		req.ExportID,
		product.ID,
		req.LocationID,
		req.Quantity,
	)

	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "scan export success"})
}