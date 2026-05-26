package services

import (
	"errors"
	"strings"
	"warehouse-backend/entity"

	"gorm.io/gorm"
)

// CreateUser tạo user mới (đã hash password trước khi gọi)
func CreateUser(db *gorm.DB, u *entity.User) error {
	return db.Create(u).Error
}

// GetUserByUsername tìm user theo username
func GetUserByUsername(db *gorm.DB, username string) (*entity.User, error) {
	var user entity.User
	if err := db.Where("username = ?", username).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// GetUserByEmail tìm user theo email
func GetUserByEmail(db *gorm.DB, email string) (*entity.User, error) {
	var user entity.User
	if err := db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// GetUserByLogin tìm user theo username HOẶC email (cho login)
func GetUserByLogin(db *gorm.DB, login string) (*entity.User, error) {
	var user entity.User
	// Kiểm tra xem login có phải email không (chứa @)
	query := "username = ?"
	if strings.Contains(login, "@") {
		query = "email = ?"
	}
	if err := db.Where(query, login).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// GetUserByID tìm user theo ID
func GetUserByID(db *gorm.DB, id uint) (*entity.User, error) {
	var user entity.User
	if err := db.First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// GetAllStaff lấy danh sách tất cả nhân viên có role STAFF
func GetAllStaff(db *gorm.DB) ([]entity.User, error) {
	var users []entity.User
	if err := db.Where("role = ?", "STAFF").Order("created_at desc").Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

// GetAllUsers lấy tất cả user (admin + staff)
func GetAllUsers(db *gorm.DB) ([]entity.User, error) {
	var users []entity.User
	if err := db.Order("created_at desc").Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

// DeleteUser xóa user theo ID (không được xóa admin)
func DeleteUser(db *gorm.DB, id uint) error {
	var user entity.User
	if err := db.First(&user, id).Error; err != nil {
		return err
	}
	if user.Role == "ADMIN" {
		return errors.New("không thể xóa tài khoản ADMIN")
	}
	return db.Delete(&user).Error
}

// UpdateStaffUser cập nhật username và email cho nhân viên (không dùng cho đổi mật khẩu)
func UpdateStaffUser(db *gorm.DB, id uint, username, email string) (*entity.User, error) {
	var user entity.User
	if err := db.First(&user, id).Error; err != nil {
		return nil, err
	}
	
	if user.Role == "ADMIN" {
		return nil, errors.New("không thể sửa tài khoản ADMIN qua chức năng này")
	}

	user.Username = username
	user.Email = email

	if err := db.Save(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// UpdatePassword cập nhật mật khẩu đã hash cho user
func UpdatePassword(db *gorm.DB, id uint, hashedPassword string) error {
	return db.Model(&entity.User{}).Where("id = ?", id).Update("password", hashedPassword).Error
}

// IsEmailExists kiểm tra email đã tồn tại chưa (trừ user hiện tại)
func IsEmailExists(db *gorm.DB, email string, excludeID ...uint) bool {
	var count int64
	query := db.Model(&entity.User{}).Where("email = ?", email)
	if len(excludeID) > 0 && excludeID[0] > 0 {
		query = query.Where("id != ?", excludeID[0])
	}
	query.Count(&count)
	return count > 0
}


// CreateStaffUser tạo user STAFF mới (password đã hash)
func CreateStaffUser(db *gorm.DB, username, email, hashedPassword string) (*entity.User, error) {
	u := &entity.User{
		Username: username,
		Email:    email,
		Password: hashedPassword,
		Role:     "STAFF",
	}
	if err := db.Create(u).Error; err != nil {
		return nil, err
	}
	return u, nil
}

// SeedAdminIfNotExists tạo admin mặc định nếu chưa có
func SeedAdminIfNotExists(db *gorm.DB, username, email, hashedPassword string) error {
	var count int64
	db.Model(&entity.User{}).Where("role = ?", "ADMIN").Count(&count)
	if count > 0 {
		return nil // Đã có admin rồi
	}

	admin := &entity.User{
		Username: username,
		Email:    email,
		Password: hashedPassword,
		Role:     "ADMIN",
	}
	return db.Create(admin).Error
}
