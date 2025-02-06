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

// Remove Task, TaskLog, and Weather type declarations as they're now in types.go

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
		start_time TEXT NOT NULL,
		duration TEXT NOT NULL,
		repeat TEXT CHECK(repeat IN ('daily', 'weekly') OR repeat IS NULL),
		description TEXT,
		priority INTEGER DEFAULT 3
	);

	CREATE TABLE IF NOT EXISTS tasklog (
		id INTEGER PRIMARY KEY,
		date TEXT NOT NULL,
		task_id INTEGER,
		name TEXT NOT NULL,
		start_time TEXT NOT NULL,
		duration TEXT NOT NULL,
		status TEXT CHECK(status IN ('completed', 'skipped', 'interrupted')),
		notes TEXT,
		weather JSON,
		FOREIGN KEY(task_id) REFERENCES tasks(id)
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

func (db *DB) GetTasksForDate(date string) ([]Task, error) {
	query := `
        SELECT id, name, start_time, duration, repeat, description, priority 
        FROM tasks 
        WHERE repeat != '' 
        OR date(start_time) = date(?)
        ORDER BY start_time`

	rows, err := db.Query(query, date)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var t Task
		err := rows.Scan(&t.ID, &t.Name, &t.StartTime, &t.Duration,
			&t.Repeat, &t.Description, &t.Priority)
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

	dataJSON, err := json.Marshal(w.Data)
	if err != nil {
		return fmt.Errorf("failed to marshal weather data: %v", err)
	}

	if debug {
		log.Printf("Saving weather data to DB: %s", string(dataJSON))
	}

	_, err = db.Exec(query, w.Date, w.Hour, string(dataJSON))
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
		var dataJSON string
		err := rows.Scan(&w.Date, &w.Hour, &dataJSON)
		if err != nil {
			return nil, err
		}

		if debug {
			log.Printf("Retrieved weather data from DB: %s", dataJSON)
		}

		var weatherData WeatherData
		if err := json.Unmarshal([]byte(dataJSON), &weatherData); err != nil {
			return nil, fmt.Errorf("failed to unmarshal weather data: %v", err)
		}
		w.Data = weatherData
		weather = append(weather, w)
	}
	return weather, nil
}

func (db *DB) GetWeatherForHour(date string, hour int) (Weather, error) {
	query := `SELECT date, hour, data FROM weather 
             WHERE date = ? AND hour = ?`

	var w Weather
	var dataJSON string
	err := db.QueryRow(query, date, hour).Scan(&w.Date, &w.Hour, &dataJSON)
	if err != nil {
		return w, err
	}

	if err := json.Unmarshal([]byte(dataJSON), &w.Data); err != nil {
		return w, fmt.Errorf("failed to unmarshal weather data: %v", err)
	}

	return w, nil
}

// TaskLog operations
func (db *DB) LogTask(tl *TaskLog) error {
	query := `INSERT OR REPLACE INTO tasklog (date, name, start_time, duration, weather)
			 VALUES (?, ?, ?, ?, ?)`
	_, err := db.Exec(query, tl.Date, tl.Name, tl.StartTime, tl.Duration, tl.Weather)
	return err
}
