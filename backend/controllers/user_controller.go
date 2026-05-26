package controllers

import (
	"net/http"
	"strconv"
	"strings"
	"warehouse-backend/services"
	"warehouse-backend/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RegisterUserManagementRoutes đăng ký các route quản lý user (chỉ ADMIN)
func RegisterUserManagementRoutes(adminGroup *gin.RouterGroup, db *gorm.DB) {
	users := adminGroup.Group("/users")
	{
		users.GET("", listStaffHandler(db))            // GET  /admin/users
		users.POST("", createStaffFromAdminHandler(db)) // POST /admin/users
		users.PUT("/:id", updateStaffHandler(db))       // PUT  /admin/users/:id
		users.DELETE("/:id", deleteStaffHandler(db))   // DELETE /admin/users/:id
		users.PUT("/:id/reset-password", resetPasswordHandler(db)) // PUT /admin/users/:id/reset-password
	}
}

// ==================== LIST STAFF ====================

func listStaffHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		users, err := services.GetAllStaff(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy danh sách nhân viên"})
			return
		}

		var result []UserResponse
		for _, u := range users {
			result = append(result, UserResponse{
				ID:        u.ID,
				Username:  u.Username,
				Email:     u.Email,
				Role:      u.Role,
				CreatedAt: u.CreatedAt.Format("2006-01-02 15:04:05"),
			})
		}

		if result == nil {
			result = []UserResponse{}
		}

		c.JSON(http.StatusOK, gin.H{
			"users": result,
			"total": len(result),
		})
	}
}

// ==================== CREATE STAFF (từ admin panel) ====================

type AdminCreateStaffRequest struct {
	Username string `json:"username" binding:"required,min=3,max=50"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

func createStaffFromAdminHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req AdminCreateStaffRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ: " + err.Error()})
			return
		}

		req.Username = strings.TrimSpace(req.Username)
		req.Email = strings.ToLower(strings.TrimSpace(req.Email))

		// Validate email unique
		if services.IsEmailExists(db, req.Email, 0) {
			c.JSON(http.StatusConflict, gin.H{"error": "Email đã được sử dụng"})
			return
		}

		hashed, err := utils.HashPassword(req.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi mã hóa mật khẩu"})
			return
		}

		user, err := services.CreateStaffUser(db, req.Username, req.Email, hashed)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Tạo tài khoản thất bại: " + err.Error()})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"message": "Tạo tài khoản nhân viên thành công",
			"user": UserResponse{
				ID:        user.ID,
				Username:  user.Username,
				Email:     user.Email,
				Role:      user.Role,
				CreatedAt: user.CreatedAt.Format("2006-01-02 15:04:05"),
			},
		})
	}
}

// ==================== UPDATE STAFF ====================

type UpdateStaffRequest struct {
	Username string `json:"username" binding:"required,min=3,max=50"`
	Email    string `json:"email" binding:"required,email"`
}

func updateStaffHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		id, err := strconv.ParseUint(idStr, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
			return
		}

		var req UpdateStaffRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ: " + err.Error()})
			return
		}

		req.Username = strings.TrimSpace(req.Username)
		req.Email = strings.ToLower(strings.TrimSpace(req.Email))

		// Validate email unique for other users
		if services.IsEmailExists(db, req.Email, uint(id)) {
			c.JSON(http.StatusConflict, gin.H{"error": "Email đã được sử dụng bởi người khác"})
			return
		}

		user, err := services.UpdateStaffUser(db, uint(id), req.Username, req.Email)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Cập nhật tài khoản thất bại: " + err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Cập nhật tài khoản thành công",
			"user": UserResponse{
				ID:        user.ID,
				Username:  user.Username,
				Email:     user.Email,
				Role:      user.Role,
				CreatedAt: user.CreatedAt.Format("2006-01-02 15:04:05"),
			},
		})
	}
}

// ==================== DELETE STAFF ====================

func deleteStaffHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		id, err := strconv.ParseUint(idStr, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
			return
		}

		// Không cho xóa chính mình
		currentUserID, _ := c.Get("userID")
		if currentUserID.(uint) == uint(id) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Không thể xóa tài khoản của chính mình"})
			return
		}

		if err := services.DeleteUser(db, uint(id)); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Xóa tài khoản thành công"})
	}
}

// ==================== RESET PASSWORD ====================

type ResetPasswordRequest struct {
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

func resetPasswordHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		id, err := strconv.ParseUint(idStr, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
			return
		}

		var req ResetPasswordRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Mật khẩu tối thiểu 6 ký tự"})
			return
		}

		hashed, err := utils.HashPassword(req.NewPassword)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi mã hóa mật khẩu"})
			return
		}

		if err := services.UpdatePassword(db, uint(id), hashed); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Reset mật khẩu thất bại"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Reset mật khẩu thành công"})
	}
}
