package main

import (
	"fmt"
	"log"
	"time"
)

type TaskService struct {
	db *DB
}

func NewTaskService(db *DB) *TaskService {
	return &TaskService{db: db}
}

func (ts *TaskService) CreateTask(task *Task) error {
	// Validate task fields
	if task.Name == "" {
		return fmt.Errorf("task name is required")
	}
	if task.StartTime == "" {
		return fmt.Errorf("start time is required")
	}
	if task.Duration == "" {
		return fmt.Errorf("duration is required")
	}

	// Set default priority if not specified
	if task.Priority == 0 {
		task.Priority = 3
	}

	return ts.db.SaveTask(task)
}

func (ts *TaskService) GetTasksForDate(date string) ([]Task, error) {
	if date == "" {
		date = time.Now().Format("2006-01-02")
	}
	return ts.db.GetTasksForDate(date)
}

func (ts *TaskService) LogTaskExecution(taskLog *TaskLog) error {
	if taskLog.Status == "" {
		taskLog.Status = "completed"
	}

	// Get current weather for the log
	weather, err := ts.db.GetWeatherForHour(taskLog.Date, parseHour(taskLog.StartTime))
	if err == nil { // Don't fail if weather data is unavailable
		taskLog.Weather = weather
	}

	return ts.db.LogTask(taskLog)
}

func parseHour(timeStr string) int {
	t, err := time.Parse("15:04", timeStr)
	if err != nil {
		return 0
	}
	return t.Hour()
}

func handleTasks() {
	// Handle task management and logging
	if debug {
		log.Println("Handling tasks")
	}
}
