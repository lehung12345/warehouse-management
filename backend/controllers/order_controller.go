package controllers

import (
	// "net/http"
	"strconv"
	"github.com/gin-gonic/gin"
	"warehouse-backend/entity"
	"warehouse-backend/services"
)

type OrderController struct {
	Service *services.OrderService
}

func NewOrderController(s *services.OrderService) *OrderController {
	return &OrderController{Service: s}
}

func (c *OrderController) CreateImport(ctx *gin.Context) {
	var req entity.Import

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := c.Service.CreateImport(req); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "import created"})
}

func (c *OrderController) CreateExport(ctx *gin.Context) {
	var req entity.Export

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := c.Service.CreateExport(req); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "export created"})
}

func (c *OrderController) GetImports(ctx *gin.Context) {
	data, _ := c.Service.GetImports()
	ctx.JSON(200, data)
}

func (c *OrderController) GetExports(ctx *gin.Context) {
	data, _ := c.Service.GetExports()
	ctx.JSON(200, data)
}

// func (c *OrderController) CompleteImport(ctx *gin.Context) {
// 	id := ctx.Param("id")

// 	parsedID, err := strconv.ParseUint(id, 10, 64)
// 	if err != nil {
// 		ctx.JSON(400, gin.H{"error": "invalid id"})
// 		return
// 	}

// 	err = c.Service.CompleteImport(uint(parsedID))
// 	if err != nil {
// 		ctx.JSON(500, gin.H{"error": err.Error()})
// 		return
// 	}

// 	ctx.JSON(200, gin.H{"message": "import done"})
// }

// func (c *OrderController) CompleteExport(ctx *gin.Context) {
// 	id := ctx.Param("id")

// 	parsedID, err := strconv.ParseUint(id, 10, 64)
// 	if err != nil {
// 		ctx.JSON(400, gin.H{"error": "invalid id"})
// 		return
// 	}

// 	err = c.Service.CompleteExport(uint(parsedID))
// 	if err != nil {
// 		ctx.JSON(500, gin.H{"error": err.Error()})
// 		return
// 	}

// 	ctx.JSON(200, gin.H{"message": "export done"})
// }


func (c *OrderController) CancelImport(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 64)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "invalid id"})
		return
	}
	if err := c.Service.CancelImport(uint(id)); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(200, gin.H{"message": "import cancelled"})
}

func (c *OrderController) CancelExport(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 64)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "invalid id"})
		return
	}
	if err := c.Service.CancelExport(uint(id)); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(200, gin.H{"message": "export cancelled"})
}



func (c *OrderController) GetImportByID(ctx *gin.Context) {
	id := ctx.Param("id")

	var data entity.Import
	if err := c.Service.DB.Preload("Items.Product").
		Preload("Items.Location.Parent").
		Preload("Items.Location.Parent.Parent").
		First(&data, id).Error; err != nil {

		ctx.JSON(404, gin.H{"error": "Import not found"})
		return
	}

	ctx.JSON(200, data)
}

func (c *OrderController) GetExportByID(ctx *gin.Context) {
	id := ctx.Param("id")

	var data entity.Export
	if err := c.Service.DB.Preload("Items.Product").
		Preload("Items.Location.Parent").
		Preload("Items.Location.Parent.Parent").
		First(&data, id).Error; err != nil {

		ctx.JSON(404, gin.H{"error": "Export not found"})
		return
	}

	ctx.JSON(200, data)
}

func (c *OrderController) ApproveImport(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 64)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "invalid id"})
		return
	}

	if err := c.Service.ApproveImport(uint(id)); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "Import approved successfully"})
}

func (c *OrderController) ApproveExport(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 64)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "invalid id"})
		return
	}

	if err := c.Service.ApproveExport(uint(id)); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "Export approved successfully"})
}

func (c *OrderController) GetImportByCode(ctx *gin.Context) {
	code := ctx.Param("code")

	var data entity.Import
	if err := c.Service.DB.Where("code = ?", code).First(&data).Error; err != nil {
		ctx.JSON(404, gin.H{"error": "Import not found"})
		return
	}

	ctx.JSON(200, gin.H{"id": data.ID})
}

func (c *OrderController) GetExportByCode(ctx *gin.Context) {
	code := ctx.Param("code")

	var data entity.Export
	if err := c.Service.DB.Where("code = ?", code).First(&data).Error; err != nil {
		ctx.JSON(404, gin.H{"error": "Export not found"})
		return
	}

	ctx.JSON(200, gin.H{"id": data.ID})
}

func (c *OrderController) MarkOrderAsSeen(ctx *gin.Context) {
	userID, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(401, gin.H{"error": "unauthorized"})
		return
	}

	var req struct {
		OrderID   uint   `json:"order_id" binding:"required"`
		OrderType string `json:"order_type" binding:"required"` // "import" or "export"
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := c.Service.MarkOrderAsSeen(userID.(uint), req.OrderID, req.OrderType); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "order marked as seen"})
}

func (c *OrderController) GetUnseenCounts(ctx *gin.Context) {
	userID, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(401, gin.H{"error": "unauthorized"})
		return
	}

	importCount, err := c.Service.GetUnseenImportCount(userID.(uint))
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	exportCount, err := c.Service.GetUnseenExportCount(userID.(uint))
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	// Get counts by status for ALL statuses
	importAllCount, _ := c.Service.GetUnseenImportCountByStatus(userID.(uint), "ALL")
	importApprovedCount, _ := c.Service.GetUnseenImportCountByStatus(userID.(uint), "APPROVED")
	importDoneCount, _ := c.Service.GetUnseenImportCountByStatus(userID.(uint), "DONE")
	importProcessingCount, _ := c.Service.GetUnseenImportCountByStatus(userID.(uint), "PROCESSING")
	importPendingCount, _ := c.Service.GetUnseenImportCountByStatus(userID.(uint), "PENDING")
	importCancelledCount, _ := c.Service.GetUnseenImportCountByStatus(userID.(uint), "CANCELLED")

	exportAllCount, _ := c.Service.GetUnseenExportCountByStatus(userID.(uint), "ALL")
	exportApprovedCount, _ := c.Service.GetUnseenExportCountByStatus(userID.(uint), "APPROVED")
	exportDoneCount, _ := c.Service.GetUnseenExportCountByStatus(userID.(uint), "DONE")
	exportProcessingCount, _ := c.Service.GetUnseenExportCountByStatus(userID.(uint), "PROCESSING")
	exportPendingCount, _ := c.Service.GetUnseenExportCountByStatus(userID.(uint), "PENDING")
	exportCancelledCount, _ := c.Service.GetUnseenExportCountByStatus(userID.(uint), "CANCELLED")

	ctx.JSON(200, gin.H{
		"import_total":        importCount,
		"export_total":        exportCount,
		"import_all":          importAllCount,
		"import_approved":     importApprovedCount,
		"import_done":         importDoneCount,
		"import_processing":  importProcessingCount,
		"import_pending":      importPendingCount,
		"import_cancelled":    importCancelledCount,
		"export_all":          exportAllCount,
		"export_approved":     exportApprovedCount,
		"export_done":         exportDoneCount,
		"export_processing":  exportProcessingCount,
		"export_pending":      exportPendingCount,
		"export_cancelled":    exportCancelledCount,
	})
}

func (c *OrderController) GetImportsByLocation(ctx *gin.Context) {
	locationID, err := strconv.ParseUint(ctx.Param("locationId"), 10, 64)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "invalid location id"})
		return
	}

	data, err := c.Service.GetImportsByLocation(uint(locationID))
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, data)
}

func (c *OrderController) GetExportsByLocation(ctx *gin.Context) {
	locationID, err := strconv.ParseUint(ctx.Param("locationId"), 10, 64)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "invalid location id"})
		return
	}

	data, err := c.Service.GetExportsByLocation(uint(locationID))
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, data)
}