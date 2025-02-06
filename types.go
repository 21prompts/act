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
	ID        int64  `json:"id"`
	Name      string `json:"name"`
	StartTime string `json:"start_time,omitempty"`
	Duration  string `json:"duration,omitempty"`
	Repeat    string `json:"repeat,omitempty"` // daily or weekly
}

type TaskLog struct {
	Date      string  `json:"date"`
	Name      string  `json:"name"`
	StartTime string  `json:"start_time"`
	Duration  string  `json:"duration"`
	Weather   Weather `json:"weather"`
}
