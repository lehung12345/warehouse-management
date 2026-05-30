package controllers

import (
	// "net/http"
	// "strconv"

	"github.com/gin-gonic/gin"
	"warehouse-backend/services"
)

type ScanController struct {
	Service *services.ScanService
}

func NewScanController(s *services.ScanService) *ScanController {
	return &ScanController{Service: s}
}

func (c *ScanController) ScanImport(ctx *gin.Context) {

	var req struct {
		ImportID  uint `json:"import_id"`
		ProductID uint `json:"product_id"`
		LocationID uint `json:"location_id"`
		Quantity  int  `json:"quantity"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	err := c.Service.ScanImport(req.ImportID, req.ProductID, req.LocationID, req.Quantity)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "scan import success"})
}

func (c *ScanController) ScanExport(ctx *gin.Context) {

	var req struct {
		ExportID  uint `json:"export_id"`
		ProductID uint `json:"product_id"`
		LocationID uint `json:"location_id"`
		Quantity  int  `json:"quantity"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	err := c.Service.ScanExport(req.ExportID, req.ProductID, req.LocationID, req.Quantity)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "scan export success"})
}

