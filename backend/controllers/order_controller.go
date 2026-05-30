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