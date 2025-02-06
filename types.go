package main

type WeatherData struct {
	Icon        string `json:"icon"`
	Description string `json:"description"`
}

type Weather struct {
	Date string      `json:"date"`
	Hour int         `json:"hour"`
	Data WeatherData `json:"data"`
}

type Task struct {
	ID          int64  `json:"id"`
	Name        string `json:"name"`
	StartTime   string `json:"start_time"`  // HH:MM format
	Duration    string `json:"duration"`    // e.g., "30m", "1h"
	Repeat      string `json:"repeat"`      // "daily", "weekly", or empty
	Description string `json:"description"` // optional description
	Priority    int    `json:"priority"`    // 1 (highest) to 5 (lowest)
}

type TaskFilter struct {
	Date     string `json:"date"`     // YYYY-MM-DD format
	Repeat   string `json:"repeat"`   // filter by repeat type
	Priority int    `json:"priority"` // filter by priority
}

type TaskLog struct {
	ID        int64   `json:"id"`
	Date      string  `json:"date"`
	TaskID    int64   `json:"task_id"`
	Name      string  `json:"name"`
	StartTime string  `json:"start_time"`
	Duration  string  `json:"duration"`
	Status    string  `json:"status"` // "completed", "skipped", "interrupted"
	Notes     string  `json:"notes"`  // optional notes about the task execution
	Weather   Weather `json:"weather"`
}
