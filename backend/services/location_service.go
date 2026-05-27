package services

import (
	"warehouse-backend/entity"
	"gorm.io/gorm"
)

type LocationService struct {
	DB *gorm.DB
}

func NewLocationService(db *gorm.DB) *LocationService {
	return &LocationService{DB: db}
}

// ➕ CREATE LOCATION
func (s *LocationService) Create(loc entity.Location) error {
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

	// group by parent
	childrenMap := make(map[*uint][]entity.Location)

	for _, loc := range locations {
		parent := loc.ParentID
		childrenMap[parent] = append(childrenMap[parent], loc)
	}

	var buildTree func(parent *uint) []map[string]interface{}

	buildTree = func(parent *uint) []map[string]interface{} {
		var result []map[string]interface{}

		for _, loc := range childrenMap[parent] {
			node := map[string]interface{}{
				"id":   loc.ID,
				"name": loc.Name,
				"type": loc.Type,
				"children": buildTree(&loc.ID),
			}
			result = append(result, node)
		}

		return result
	}

	return buildTree(nil), nil
}