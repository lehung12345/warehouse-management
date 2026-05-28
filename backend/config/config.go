package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port   string
	DBConn string
	JWTSecret string
}

var ENV Config

func LoadConfig() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Println("Không tìm thấy file .env, dùng cấu hình mặc định")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbSSL := os.Getenv("DB_SSLMODE")

	ENV.DBConn = "host=" + dbHost + " user=" + dbUser + " password=" + dbPass + " dbname=" + dbName + " port=" + dbPort + " sslmode=" + dbSSL
	ENV.Port = port
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Println("[WARN] JWT_SECRET missing, using default 'secret' (this may break existing tokens)")
		jwtSecret = "secret"
	}
	ENV.JWTSecret = jwtSecret
}


