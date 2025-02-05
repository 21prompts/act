package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"

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

// Route handlers implementation
func (s *Server) handleGetTasks(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	date := vars["date"]

	tasks, err := s.tasks.GetTasksForDate(date)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(tasks)
}

func (s *Server) handleSaveTasks(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	date := vars["date"]

	var tasks []Task
	if err := json.NewDecoder(r.Body).Decode(&tasks); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := s.tasks.SaveTasksForDate(date, tasks); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Notify connected clients via WebSocket
	s.broadcastUpdate(date)
}

func (s *Server) handleListTemplates(w http.ResponseWriter, r *http.Request) {
	files, err := os.ReadDir(filepath.Join(s.dataDir, "templates"))
	if err != nil {
		if os.IsNotExist(err) {
			json.NewEncoder(w).Encode([]string{})
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	templates := make([]string, 0)
	for _, f := range files {
		if !f.IsDir() && strings.HasSuffix(f.Name(), ".md") {
			templates = append(templates, strings.TrimSuffix(f.Name(), ".md"))
		}
	}

	json.NewEncoder(w).Encode(templates)
}

func (s *Server) handleGetTemplate(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	name := vars["name"]

	tasks, err := s.tasks.GetTasksForDate("templates/" + name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(tasks)
}

func (s *Server) handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := s.wsUpgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade failed: %v", err)
		return
	}
	defer conn.Close()

	// Add connection to active clients
	client := &WSClient{conn: conn}
	s.addClient(client)
	defer s.removeClient(client)

	// Keep connection alive and handle incoming messages
	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			break
		}
	}
}

// WebSocket client management
type WSClient struct {
	conn *websocket.Conn
}

var (
	clients   = make(map[*WSClient]bool)
	clientsMu sync.RWMutex
)

func (s *Server) addClient(client *WSClient) {
	clientsMu.Lock()
	defer clientsMu.Unlock()
	clients[client] = true
}

func (s *Server) removeClient(client *WSClient) {
	clientsMu.Lock()
	defer clientsMu.Unlock()
	delete(clients, client)
}

func (s *Server) broadcastUpdate(date string) {
	message := map[string]string{
		"type": "update",
		"date": date,
	}

	clientsMu.RLock()
	defer clientsMu.RUnlock()

	for client := range clients {
		client.conn.WriteJSON(message)
	}
}
