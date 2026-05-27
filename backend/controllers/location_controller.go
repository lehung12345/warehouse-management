package controllers

import (
	"github.com/gin-gonic/gin"
	"warehouse-backend/entity"
	"warehouse-backend/services"
)

type LocationController struct {
	Service *services.LocationService
}

func NewLocationController(s *services.LocationService) *LocationController {
	return &LocationController{Service: s}
}

// ➕ CREATE
func (c *LocationController) Create(ctx *gin.Context) {
	var req entity.Location

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := c.Service.Create(req); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "created"})
}

func (c *LocationController) GetTree(ctx *gin.Context) {
	data, err := c.Service.GetTree()
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, data)
}

func (c *LocationController) GetAll(ctx *gin.Context) {
	data, err := c.Service.GetAll()
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, data)
}