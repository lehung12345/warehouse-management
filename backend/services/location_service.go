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
				"id":   loc.ID,
				"name": loc.Name,
				"type": loc.Type,
				"children": buildTree(loc.ID),
			}
			result = append(result, node)
		}

		return result
	}

	return buildTree(0), nil
}