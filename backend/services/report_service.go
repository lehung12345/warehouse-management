package services

import (
	// "time"
	// "warehouse-backend/entity"
	"gorm.io/gorm"
)

type ReportService struct {
	DB *gorm.DB
}

func NewReportService(db *gorm.DB) *ReportService {
	return &ReportService{DB: db}
}

func (s *ReportService) ImportExportByDay() (map[string]interface{}, error) {

	type Result struct {
		Date   string
		Total  int
		Type   string
	}

	var rows []Result

	s.DB.Raw(`
		SELECT 
			DATE(created_at) as date,
			COUNT(*) as total,
			'IMPORT' as type
		FROM imports
		GROUP BY DATE(created_at)

		UNION ALL

		SELECT 
			DATE(created_at) as date,
			COUNT(*) as total,
			'EXPORT' as type
		FROM exports
		GROUP BY DATE(created_at)
	`).Scan(&rows)

	dataMap := make(map[string]map[string]int)

	for _, r := range rows {
		if dataMap[r.Date] == nil {
			dataMap[r.Date] = map[string]int{
				"imports": 0,
				"exports": 0,
			}
		}

		if r.Type == "IMPORT" {
			dataMap[r.Date]["imports"] = r.Total
		} else {
			dataMap[r.Date]["exports"] = r.Total
		}
	}

	var labels []string
	var imports []int
	var exports []int

	for date, v := range dataMap {
		labels = append(labels, date)
		imports = append(imports, v["imports"])
		exports = append(exports, v["exports"])
	}

	return map[string]interface{}{
		"labels":  labels,
		"imports": imports,
		"exports": exports,
	}, nil
}

func (s *ReportService) StockByProduct() ([]map[string]interface{}, error) {

	type Result struct {
		Name     string
		Quantity int
	}

	var results []Result

	err := s.DB.Table("inventories").
		Select("products.name as name, SUM(inventories.quantity) as quantity").
		Joins("JOIN products ON products.id = inventories.product_id").
		Group("products.name").
		Scan(&results).Error

	if err != nil {
		return nil, err
	}

	var response []map[string]interface{}

	for _, r := range results {
		response = append(response, map[string]interface{}{
			"name":     r.Name,
			"quantity": r.Quantity,
		})
	}

	return response, nil
}

func (s *ReportService) TopProducts() ([]map[string]interface{}, error) {

	type Result struct {
		Name  string
		Total int
	}

	var results []Result

	err := s.DB.Table("transactions").
		Select("products.name as name, SUM(transactions.quantity) as total").
		Joins("JOIN products ON products.id = transactions.product_id").
		Where("transactions.type = ?", "EXPORT").
		Group("products.name").
		Order("total DESC").
		Limit(10).
		Scan(&results).Error

	if err != nil {
		return nil, err
	}

	var response []map[string]interface{}

	for _, r := range results {
		response = append(response, map[string]interface{}{
			"name":  r.Name,
			"total": r.Total,
		})
	}

	return response, nil
}

