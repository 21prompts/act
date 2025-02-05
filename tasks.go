package main

import (
	"fmt"
	"os"
	"path/filepath"
)

type Task struct {
	Time     string `json:"time"`
	Name     string `json:"name"`
	Duration string `json:"duration"`
	Done     bool   `json:"done"`
	Current  bool   `json:"current"`
}

type TaskManager struct {
	dataDir string
}

func NewTaskManager(dataDir string) (*TaskManager, error) {
	return &TaskManager{dataDir: dataDir}, nil
}

func (tm *TaskManager) GetTasksForDate(date string) ([]Task, error) {
	path := filepath.Join(tm.dataDir, date+".md")
	data, err := os.ReadFile(path)
	if os.IsNotExist(err) {
		return []Task{}, nil
	}
	if err != nil {
		return nil, fmt.Errorf("reading tasks: %w", err)
	}
	return parseTasksFromMarkdown(string(data))
}

func (tm *TaskManager) SaveTasksForDate(date string, tasks []Task) error {
	path := filepath.Join(tm.dataDir, date+".md")
	data := formatTasksAsMarkdown(tasks)
	return os.WriteFile(path, []byte(data), 0644)
}

// Helper functions for markdown parsing/formatting will be implemented here
