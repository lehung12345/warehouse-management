package utils

import (
	"net"
	"strings"
)

func GetLocalIP() string {
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return "localhost"
	}

	for _, addr := range addrs {
		ipnet, ok := addr.(*net.IPNet)
		if !ok || ipnet.IP == nil {
			continue
		}

		ip := ipnet.IP.String()

		// bỏ loopback + IPv6
		if ipnet.IP.IsLoopback() || strings.Contains(ip, ":") {
			continue
		}

		// CHỈ lấy IP WiFi thật
		if strings.HasPrefix(ip, "192.168.") {
			return ip
		}
	}

	return "localhost"
}