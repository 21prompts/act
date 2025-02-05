package main

import (
	"flag"
	"log"
	"net/http"
	"os"
)

var (
	port    = flag.String("port", "8080", "HTTP service port")
	dataDir = flag.String("data", "data", "Data directory path")
)

func main() {
	flag.Parse()

	// Ensure data directory exists
	if err := os.MkdirAll(*dataDir, 0755); err != nil {
		log.Fatalf("Failed to create data directory: %v", err)
	}

	// Initialize server
	srv, err := NewServer(*dataDir)
	if err != nil {
		log.Fatalf("Failed to initialize server: %v", err)
	}

	// Start server
	log.Printf("Starting server on port %s...", *port)
	if err := http.ListenAndServe(":"+*port, srv.Router); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
