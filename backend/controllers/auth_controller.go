package controllers

import (
	"net/http"
	"strings"
	"warehouse-backend/entity"
	"warehouse-backend/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ==================== REQUEST STRUCTS ====================

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
	Platform string `json:"platform" binding:"required,oneof=web mobile"`
}

type CreateUserRequest struct {
	Username string `json:"username" binding:"required,min=3,max=50"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Role     string `json:"role" binding:"required"`
}

// ==================== RESPONSE STRUCTS ====================

type UserResponse struct {
	ID        uint   `json:"id"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	Role      string `json:"role"`
	CreatedAt string `json:"created_at"`
}

// ==================== ROUTE REGISTRATION ====================

func RegisterAuthRoutes(r *gin.Engine, db *gorm.DB) {
	auth := r.Group("/auth")
	{
		auth.POST("/login", loginHandler(db))
	}
}

// ==================== HANDLERS ====================

// loginHandler xử lý đăng nhập bằng username và email
func loginHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req LoginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu đăng nhập không hợp lệ: vui lòng nhập đủ username, email và password"})
			return
		}

		var user entity.User
		req.Email = strings.ToLower(strings.TrimSpace(req.Email))
		req.Username = strings.TrimSpace(req.Username)

		if err := db.Where("email = ?", req.Email).First(&user).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Tài khoản không tồn tại hoặc sai thông tin"})
			return
		}

		// So khớp Username
		if user.Username != req.Username {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Tài khoản không tồn tại hoặc sai thông tin"})
			return
		}

		// Kiểm tra mật khẩu
		if !utils.CheckPasswordHash(user.Password, req.Password) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Tài khoản không tồn tại hoặc sai thông tin"})
			return
		}

		// Kiểm tra nền tảng đăng nhập
		if req.Platform == "web" && user.Role != "ADMIN" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Thông tin bị sai yêu cầu nhập lại"})
			return
		}
		if req.Platform == "mobile" && user.Role != "STAFF" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Thông tin bị sai yêu cầu nhập lại"})
			return
		}

		// Sinh JWT token
		token, err := utils.GenerateToken(user.ID, user.Username, user.Email, user.Role)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo token"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"token": token,
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
// EOF
