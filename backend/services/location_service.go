package services

import (
	"warehouse-backend/entity"
	"gorm.io/gorm"
	"errors"
	"strings"
)

type LocationService struct {
	DB *gorm.DB
}

func NewLocationService(db *gorm.DB) *LocationService {
	return &LocationService{DB: db}
}

// ➕ CREATE LOCATION
func (s *LocationService) Create(loc entity.Location) error {

	if loc.Name == "" {
		return errors.New("name không được để trống")
	}

	if loc.Capacity <= 0 {
		return errors.New("capacity phải > 0")
	}

	if loc.Type == "WAREHOUSE" {
		loc.ParentID = nil
	}

	if loc.Type == "SHELF" {
		if loc.ParentID == nil {
			return errors.New("shelf phải có warehouse")
		}

		var parent entity.Location
		if err := s.DB.First(&parent, *loc.ParentID).Error; err != nil {
			return err
		}

		if strings.TrimSpace(strings.ToUpper(parent.Type)) != "WAREHOUSE" {
			return errors.New("parent phải là warehouse")
		}

		// Validate: shelf capacity <= warehouse capacity
		if loc.Capacity > parent.Capacity {
			return errors.New("sức chứa của shelf không được vượt quá sức chứa của warehouse")
		}

		// Validate: tổng capacity của các shelf hiện tại + shelf mới <= warehouse capacity
		var existingShelves []entity.Location
		if err := s.DB.Where("parent_id = ? AND type = ?", *loc.ParentID, "SHELF").Find(&existingShelves).Error; err != nil {
			return err
		}

		totalShelfCapacity := loc.Capacity
		for _, shelf := range existingShelves {
			totalShelfCapacity += shelf.Capacity
		}

		if totalShelfCapacity > parent.Capacity {
			return errors.New("tổng sức chứa của các shelf không được vượt quá sức chứa của warehouse")
		}
	}

	if loc.Type == "BIN" {
		if loc.ParentID == nil {
			return errors.New("bin phải có shelf")
		}

		var parent entity.Location
		if err := s.DB.First(&parent, *loc.ParentID).Error; err != nil {
			return err
		}

		if strings.TrimSpace(strings.ToUpper(parent.Type)) != "SHELF" {
			return errors.New("parent phải là shelf")
		}

		// Validate: bin capacity <= shelf capacity
		if loc.Capacity > parent.Capacity {
			return errors.New("sức chứa của bin không được vượt quá sức chứa của shelf")
		}

		// Validate: tổng capacity của các bin hiện tại + bin mới <= shelf capacity
		var existingBins []entity.Location
		if err := s.DB.Where("parent_id = ? AND type = ?", *loc.ParentID, "BIN").Find(&existingBins).Error; err != nil {
			return err
		}

		totalBinCapacity := loc.Capacity
		for _, bin := range existingBins {
			totalBinCapacity += bin.Capacity
		}

		if totalBinCapacity > parent.Capacity {
			return errors.New("tổng sức chứa của các bin không được vượt quá sức chứa của shelf")
		}
	}

	return s.DB.Create(&loc).Error
}

// 📄 GET ALL (FLAT)
func (s *LocationService) GetAll() ([]entity.Location, error) {
	var list []entity.Location
	err := s.DB.Find(&list).Error
	return list, err
}

func (s *LocationService) GetTree() ([]map[string]interface{}, error) {
	var locations []entity.Location

	if err := s.DB.Find(&locations).Error; err != nil {
		return nil, err
	}

	childrenMap := make(map[uint][]entity.Location)

	for _, loc := range locations {
		parentID := uint(0)
		if loc.ParentID != nil {
			parentID = *loc.ParentID
		}
		childrenMap[parentID] = append(childrenMap[parentID], loc)
	}

	var buildTree func(parentID uint) []map[string]interface{}

	buildTree = func(parentID uint) []map[string]interface{} {
		var result []map[string]interface{}

		for _, loc := range childrenMap[parentID] {
			node := map[string]interface{}{
				"id":       loc.ID,
				"name":     loc.Name,
				"type":     loc.Type,
				"capacity": loc.Capacity,
				"children": buildTree(loc.ID),
			}
			result = append(result, node)
		}

		return result
	}

	return buildTree(0), nil
}