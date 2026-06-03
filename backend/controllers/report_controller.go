package controllers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"warehouse-backend/services"
)

type ReportController struct {
	Service *services.ReportService
}

func NewReportController(s *services.ReportService) *ReportController {
	return &ReportController{Service: s}
}

func (c *ReportController) ImportExport(ctx *gin.Context) {

	data, err := c.Service.ImportExportByDay()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, data)
}

func (c *ReportController) Stock(ctx *gin.Context) {

	data, err := c.Service.StockByProduct()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, data)
}

func (c *ReportController) TopProducts(ctx *gin.Context) {

	data, err := c.Service.TopProducts()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, data)
}

func (c *ReportController) TopImportedProducts(ctx *gin.Context) {

	data, err := c.Service.TopImportedProducts()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, data)
}