package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

type DB struct {
	*sql.DB
}

type Task struct {
	ID        int64  `json:"id"`
	Name      string `json:"name"`
	StartTime string `json:"start_time,omitempty"`
	Duration  string `json:"duration,omitempty"`
	Repeat    string `json:"repeat,omitempty"` // daily or weekly
}

type TaskLog struct {
	Date      string          `json:"date"`
	Name      string          `json:"name"`
	StartTime string          `json:"start_time"`
	Duration  string          `json:"duration"`
	Weather   json.RawMessage `json:"weather"`
}

type Weather struct {
	Date string      `json:"date"`
	Hour int         `json:"hour"`
	Data WeatherData `json:"data"`
}

func InitDB() (*DB, error) {
	if debug {
		log.Println("Opening database connection")
	}

	db, err := sql.Open("sqlite3", "./act.db")
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %v", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %v", err)
	}

	if debug {
		log.Println("Creating database schema")
	}

	if err := createSchema(db); err != nil {
		return nil, fmt.Errorf("failed to create schema: %v", err)
	}

	return &DB{db}, nil
}

func createSchema(db *sql.DB) error {
	schema := `
	CREATE TABLE IF NOT EXISTS tasks (
		id INTEGER PRIMARY KEY,
		name TEXT NOT NULL,
		start_time TEXT,
		duration TEXT,
		repeat TEXT CHECK(repeat IN ('daily', 'weekly') OR repeat IS NULL)
	);

	CREATE TABLE IF NOT EXISTS tasklog (
		date TEXT NOT NULL,
		name TEXT NOT NULL,
		start_time TEXT NOT NULL,
		duration TEXT NOT NULL,
		weather JSON,
		PRIMARY KEY (date, start_time)
	);

	CREATE TABLE IF NOT EXISTS weather (
		date TEXT NOT NULL,
		hour INTEGER NOT NULL,
		data JSON NOT NULL,
		PRIMARY KEY (date, hour)
	);`

	_, err := db.Exec(schema)
	return err
}

// Task operations
func (db *DB) SaveTask(task *Task) error {
	query := `INSERT OR REPLACE INTO tasks (id, name, start_time, duration, repeat)
			 VALUES (?, ?, ?, ?, ?)`
	_, err := db.Exec(query, task.ID, task.Name, task.StartTime, task.Duration, task.Repeat)
	return err
}

func (db *DB) GetTasksForDay() ([]Task, error) {
	query := `SELECT id, name, start_time, duration, repeat FROM tasks 
			 WHERE repeat IS NOT NULL 
			 OR date(start_time) = date('now')`
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var t Task
		err := rows.Scan(&t.ID, &t.Name, &t.StartTime, &t.Duration, &t.Repeat)
		if err != nil {
			return nil, err
		}
		tasks = append(tasks, t)
	}
	return tasks, nil
}

// Weather operations
func (db *DB) SaveWeather(w *Weather) error {
	query := `INSERT OR REPLACE INTO weather (date, hour, data)
			 VALUES (?, ?, ?)`
	_, err := db.Exec(query, w.Date, w.Hour, w.Data)
	return err
}

func (db *DB) GetWeatherForDay(date string) ([]Weather, error) {
	query := `SELECT date, hour, data FROM weather 
			 WHERE date = ? ORDER BY hour`
	rows, err := db.Query(query, date)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var weather []Weather
	for rows.Next() {
		var w Weather
		err := rows.Scan(&w.Date, &w.Hour, &w.Data)
		if err != nil {
			return nil, err
		}
		weather = append(weather, w)
	}
	return weather, nil
}

// TaskLog operations
func (db *DB) LogTask(tl *TaskLog) error {
	query := `INSERT OR REPLACE INTO tasklog (date, name, start_time, duration, weather)
			 VALUES (?, ?, ?, ?, ?)`
	_, err := db.Exec(query, tl.Date, tl.Name, tl.StartTime, tl.Duration, tl.Weather)
	return err
}
