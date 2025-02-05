package main

import (
	"net/http"
	"path/filepath"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

type Server struct {
	Router     *mux.Router
	tasks      *TaskManager
	wsUpgrader websocket.Upgrader
	dataDir    string
}

func NewServer(dataDir string) (*Server, error) {
	s := &Server{
		Router:  mux.NewRouter(),
		dataDir: dataDir,
		wsUpgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool { return true },
		},
	}

	// Initialize task manager
	tasks, err := NewTaskManager(dataDir)
	if err != nil {
		return nil, err
	}
	s.tasks = tasks

	// Static files
	s.Router.PathPrefix("/static/").Handler(
		http.StripPrefix("/static/",
			http.FileServer(http.Dir("static"))))

	// API routes
	api := s.Router.PathPrefix("/api").Subrouter()
	api.HandleFunc("/tasks/{date}", s.handleGetTasks).Methods("GET")
	api.HandleFunc("/tasks/{date}", s.handleSaveTasks).Methods("POST")
	api.HandleFunc("/templates", s.handleListTemplates).Methods("GET")
	api.HandleFunc("/templates/{name}", s.handleGetTemplate).Methods("GET")
	api.HandleFunc("/ws", s.handleWebSocket)

	// Serve index.html for all other routes (SPA)
	s.Router.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filepath.Join("static", "index.html"))
	})

	return s, nil
}

// Route handlers will be implemented here
