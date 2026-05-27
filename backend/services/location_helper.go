package services

import (
	"strings"
	"warehouse-backend/entity"
	"gorm.io/gorm"
)

func BuildLocationPath(db *gorm.DB, locationID uint) string {
	var path []string
	current := locationID

	for current != 0 {
		var loc entity.Location
		if err := db.First(&loc, current).Error; err != nil {
			break
		}

		path = append([]string{loc.Name}, path...)
		if loc.ParentID == nil {
			break
		}
		current = *loc.ParentID
	}

	return strings.Join(path, " > ")
}