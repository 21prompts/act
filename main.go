package main

import (
	"encoding/json"
	"flag"
	"log"
	"net/http"
	"os"
	"time"
)

var (
	debug bool
	db    *DB
)

func jsonResponse(w http.ResponseWriter, data interface{}, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func setupAPIHandlers() {
	// Weather endpoints
	http.HandleFunc("/api/weather", func(w http.ResponseWriter, r *http.Request) {
		date := time.Now().Format("2006-01-02")
		weather, err := db.GetWeatherForDay(date)
		if err != nil {
			jsonResponse(w, map[string]string{"error": err.Error()}, http.StatusInternalServerError)
			return
		}
		jsonResponse(w, weather, http.StatusOK)
	})

	// Tasks endpoints
	http.HandleFunc("/api/tasks", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "GET":
			tasks, err := db.GetTasksForDay()
			if err != nil {
				jsonResponse(w, map[string]string{"error": err.Error()}, http.StatusInternalServerError)
				return
			}
			jsonResponse(w, tasks, http.StatusOK)

		case "POST":
			var task Task
			if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
				jsonResponse(w, map[string]string{"error": "Invalid request body"}, http.StatusBadRequest)
				return
			}
			if err := db.SaveTask(&task); err != nil {
				jsonResponse(w, map[string]string{"error": err.Error()}, http.StatusInternalServerError)
				return
			}
			jsonResponse(w, task, http.StatusCreated)

		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	// Task log endpoints
	http.HandleFunc("/api/tasklog", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}

		var taskLog TaskLog
		if err := json.NewDecoder(r.Body).Decode(&taskLog); err != nil {
			jsonResponse(w, map[string]string{"error": "Invalid request body"}, http.StatusBadRequest)
			return
		}

		if err := db.LogTask(&taskLog); err != nil {
			jsonResponse(w, map[string]string{"error": err.Error()}, http.StatusInternalServerError)
			return
		}
		jsonResponse(w, taskLog, http.StatusCreated)
	})
}

func main() {
	flag.BoolVar(&debug, "debug", false, "enable debug logging")
	flag.Parse()

	// Set up logging first
	if debug {
		log.SetOutput(os.Stdout)
		log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
		log.Println("Debug mode enabled")
	} else {
		log.SetOutput(os.Stderr)
	}

	// Initialize database
	var err error
	log.Println("Initializing database")
	db, err = InitDB()
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer db.Close()

	// Initialize weather service
	log.Println("Initializing weather service")
	ws, err := NewWeatherService(db)
	if err != nil {
		log.Fatal("Failed to initialize weather service:", err)
	}
	ws.Start()

	// Setup routes
	log.Println("Setting up API routes")
	setupAPIHandlers()
	http.Handle("/", http.FileServer(http.Dir("./static")))

	// Start server
	addr := ":8080"
	log.Printf("Server starting on http://localhost%s", addr)
	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
