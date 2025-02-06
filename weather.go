package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"
)

const weatherAPIURL = "https://api.openweathermap.org/data/3.0/onecall"

type WeatherService struct {
	db     *DB
	apiKey string
	lat    float64
	lon    float64
	client *http.Client
}

func NewWeatherService(db *DB) (*WeatherService, error) {
	apiKey := os.Getenv("OPENWEATHER_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("OPENWEATHER_API_KEY not set")
	}

	return &WeatherService{
		db:     db,
		apiKey: apiKey,
		lat:    51.5074, // Default to London
		lon:    -0.1278,
		client: &http.Client{Timeout: 10 * time.Second},
	}, nil
}

func (ws *WeatherService) fetchWeatherData() error {
	url := fmt.Sprintf("%s?lat=%f&lon=%f&appid=%s&units=metric&exclude=minutely,daily,alerts",
		weatherAPIURL, ws.lat, ws.lon, ws.apiKey)

	resp, err := ws.client.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	var data map[string]interface{}
	if err := json.Unmarshal(body, &data); err != nil {
		return err
	}

	hourly, ok := data["hourly"].([]interface{})
	if !ok {
		return fmt.Errorf("invalid hourly data format")
	}

	now := time.Now()
	date := now.Format("2006-01-02")

	for _, h := range hourly {
		hour := h.(map[string]interface{})
		dt := int64(hour["dt"].(float64))
		t := time.Unix(dt, 0)

		weather := &Weather{
			Date: t.Format("2006-01-02"),
			Hour: t.Hour(),
			Data: json.RawMessage(hour["weather"].([]interface{})[0].(map[string]interface{})["icon"].(string)),
		}

		if err := ws.db.SaveWeather(weather); err != nil {
			log.Printf("Error saving weather: %v", err)
		}
	}

	if debug {
		log.Printf("Weather data updated for %s", date)
	}
	return nil
}

func (ws *WeatherService) Start() {
	ticker := time.NewTicker(10 * time.Minute)
	go func() {
		for {
			if err := ws.fetchWeatherData(); err != nil {
				log.Printf("Error fetching weather: %v", err)
			}
			<-ticker.C
		}
	}()
}

func init() {
	db := &DB{} // Initialize your database connection here
	ws, err := NewWeatherService(db)
	if err != nil {
		log.Fatalf("Failed to create weather service: %v", err)
	}
	ws.Start()
}
